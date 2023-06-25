# lunar-launcher-node
simple lunar client launcher in nodejs. obv this uses electron app remote debugging

Heavily Inspired By: [Lunar Launcher Inject - Nilsen84](https://github.com/Nilsen84/lunar-launcher-inject)

#### Only supports windows (cuz idc)

What it does:<br>
  - Locates `"Lunar Client.exe"` in `%localappdata%`(AppData\\Local)
  - Spawns an instance of `"Lunar Client.exe"` with arg: **`--remote-debuging-port=<PORT>`**
  - Finds `Websocket Debug Url` and connects to it.
  - Executes the (payload.js)[payload.js] through the websocket conn.
  - Bootup minecraft from the opened Lunar instance and boom. Connected

Usages:
  + Load external ***[client java agents](https://github.com/Nilsen84/lunar-client-agents])***
    - ***[Weave-Loader](https://github.com/Weave-MC/Weave-Loader)***
  + mod lunar client 💋
