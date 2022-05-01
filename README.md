# vizio-control

`vizio-control` is an app lets you wake and sleep your Vizio Smart TV. It can be set to run based on Windows [System Power Management Events](https://docs.microsoft.com/en-us/windows/win32/power/system-power-management-events#power-setting-change-events), allowing you to turn your display on/off automatically when you wake/sleep your PC.

### Rationale
I wrote this because my Vizio Smart TV is connected to my Windows media PC and I got tired of waking/sleeping the PC with my wireless keyboard and then having to use a separate TV remote to turn on/off my TV. Now, I simply hit <kbd>Space</kbd>, Windows starts up, and my TV automatically turns on 😎. 

### Requirements
- Node `>= v16.13.2`

### Instructions
1)  Download [PsTools](https://docs.microsoft.com/en-us/sysinternals/downloads/pstools) and extract `PsShutdown.exe` / `PsShutdown64.exe` to a directory of your choice.
2) `git clone https://github.com/andrewheartsxd/vizio-control`
3) `cd vizio-control`
4) `npm install`
5) `npm run preLaunch`
6) `npm start` and follow the prompts to create `config.json` file and Windows batch files
7) TODO: instructions for Windows Task Scheduler / sleep shortcut

### Contributors
This builds off the great work done by [@heathbar](https://github.com/heathbar/vizio-smart-cast) and [@exiva](https://github.com/exiva/Vizio_SmartCast_API).