import type { Device } from 'vizio-smart-cast';
import arp from '@network-utils/arp-lookup';

import {
  initReadline,
  discoverDevice,
  pairDevice,
  createConfig,
  writeConfig,
} from './utils';

export type FirstRun = typeof firstRun;

const firstRun = async (smartcast: Device) => {
  const { askPromisedQuestion, closeReadline } = initReadline();
  // ask if user knows the TV's IP
  const ipAlreadyKnown = (
    (await askPromisedQuestion(
      "Do you know the IP address of the TV you're connecting to? [Y/n] "
    )) || ''
  ).toLocaleLowerCase();
  if (ipAlreadyKnown === '' || ipAlreadyKnown === 'y') {
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
      console.log(
        `Invalid IP address entered. Please try again with a valid IP address.`
      );
    }
  } else {
    const runDiscovery = (
      (await askPromisedQuestion('Do you want to run discovery? [Y/n] ')) || ''
    ).toLocaleLowerCase();
    if (runDiscovery === '' || runDiscovery === 'y') {
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
  closeReadline();
};

export default firstRun;
