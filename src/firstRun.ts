import fs from 'fs';

import type { Device } from 'vizio-smart-cast';
import arp from '@network-utils/arp-lookup';

import {
  initReadline,
  discoverDevice,
  pairDevice,
  createConfig,
  writeConfig,
  writeBatFiles,
} from './utils';

export type FirstRun = typeof firstRun;

const firstRun = async (smartcast: Device) => {
  const distDirectory = process.cwd();
  const { askPromisedQuestion, closeReadline } = initReadline();

  // TODO: should be its own psShutdown question block
  const psShutdownExists = (
    (await askPromisedQuestion(
      'Have you downloaded PsTool and extracted PsShutdown? [Y/n] '
    )) || 'y'
  ).toLocaleLowerCase();
  if (psShutdownExists === 'y') {
    let psShutdownFilePath;
    while (
      !psShutdownFilePath &&
      (psShutdownFilePath ? fs.existsSync(psShutdownFilePath) : true)
    ) {
      psShutdownFilePath = await askPromisedQuestion(
        'Please enter the absolute filepath to your extracted PsShutdown.exe'
      );
    }
    // ask if user knows the TV's IP
    const ipAlreadyKnown = (
      (await askPromisedQuestion(
        "Do you know the IP address of the TV you're connecting to? [Y/n] "
      )) || 'y'
    ).toLocaleLowerCase();
    if (ipAlreadyKnown === 'y') {
      // ask user to enter IP
      const ipAddress = (await askPromisedQuestion('Enter IP: ')) || '';
      if (arp.isIP(ipAddress)) {
        const authToken = await pairDevice(
          smartcast,
          askPromisedQuestion,
          ipAddress
        );
        const macAddress = await arp.toMAC(ipAddress);
        if (authToken && macAddress) {
          const shouldChangeToInput = (
            (await askPromisedQuestion(
              'Do you want to automatically switch to an input? [y/N] '
            )) || ''
          ).toLocaleLowerCase();
          let defaultInputName;
          if (shouldChangeToInput === 'y') {
            while (!defaultInputName) {
              defaultInputName =
                (await askPromisedQuestion('Enter input name: ')) || '';
            }
          }
          // create and write config file
          const config = createConfig(
            ipAddress,
            authToken,
            macAddress,
            defaultInputName
          );
          console.log('attempting to write config file...');
          await writeConfig(config);
          console.log('attempting to write .bat files...');
          await writeBatFiles(distDirectory, psShutdownFilePath as string);
        } else {
          console.log(
            `Error encountered during pairing. Config file not written.`
          );
        }
      } else {
        console.log(
          `Invalid IP address entered. Please try again with a valid IP address.`
        );
      }
    } else {
      // TODO: refactor this block to remove duplicate config writing code (should just do discovery)
      const runDiscovery = (
        (await askPromisedQuestion('Do you want to run discovery? [Y/n] ')) ||
        'y'
      ).toLocaleLowerCase();
      if (runDiscovery === 'y') {
        const devices = await discoverDevice(smartcast);
        if (devices && devices.length) {
          /* TODO: this only handles one valid (manufacturer = 'VIZIO') device, 
          update to handle multiple VIZIO devices found on the network */
          const discoveredDevice =
            devices && devices.length ? devices.pop() : null;
          const ipAddress = discoveredDevice ? discoveredDevice.ip : null;
          const authToken = ipAddress
            ? await pairDevice(smartcast, askPromisedQuestion, ipAddress)
            : null;
          const macAddress = ipAddress ? await arp.toMAC(ipAddress) : null;
          if (ipAddress && authToken && macAddress) {
            // create and write config file
            const config = createConfig(ipAddress, authToken, macAddress);
            console.log('attempting to write config file...');
            await writeConfig(config);
          } else {
            console.log(
              `Error encountered during pairing. Config file not written.`
            );
          }
        } else {
          console.log(`No devices found. Config file not written.`);
        }
      }
    }
  } else {
    return console.log(
      'Please download PsTools and extract PsShutdown and try again (see README)'
    );
  }
  closeReadline();
};

export default firstRun;
