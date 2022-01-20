import type { Device } from 'vizio-smart-cast';

import type { DiscoveredDevices } from '../types';

const discoverDevice = (smartcast: Device, timeout?: number) => {
  const discoveryTimeout = timeout || 4000;
  const devices: DiscoveredDevices = [];

  const discover = new Promise<void>(function (_resolve, _reject) {
    smartcast.discover(
      (device) => {
        console.log('Found: ', device);
        devices.push(device);
      },
      (err: unknown) => {
        console.log('error discovering device: ', err);
      },
      discoveryTimeout
    );
  });

  const timeoutPromise = new Promise<DiscoveredDevices>((resolve, _reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      console.log(
        `Discovery ran for ${discoveryTimeout} ms and found ${devices.length} devices`
      );
      resolve(devices);
    }, discoveryTimeout);
  });

  return Promise.race([discover, timeoutPromise]);
};

export default discoverDevice;
