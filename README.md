# WhatWatch

![Screenshot showing WhatWatch clock on desktop with browser window opened behind it...](doc/WhatWatch.png "Screenshot showing WhatWatch in action...")

## About

This is a gnome-shell-extension that supports Gnome-Shell:

* 41

It displays an analog clock on the desktop and exposes a great variety of customisation options.

![Screenshot showing WhatWatch settings page...](doc/WhatWatch-Settings.png "Screenshot showing WhatWatch settings dialog in action...")

## Install

Clone this repo to your `.../gnome-shell/extensions/` folder.

```
cd ~/.local/share/gnome-shell/extensions/
git clone git@github.com:Zappo-II/WhatWatch.git
```

Update the installation directory with `git pull`.

You must restart (X11: `Alt-F2` --> `r`) or logout/relogin (Wayland) to activate the (updated) extension.

Your mileage may vary.

## Documentation

Please take a look at the documentation found in the `.../doc` folder of the extension's installation directory.

* [WhatWatch-Doc.md](doc/WhatWatch-Doc.md)

## Troubleshooting

* check your system's log `journalctl -f` for any `GJS` / `gnome-shell` messages...
* activate Debug Logging via preferences page...

## Issues / Requests

Please report any issues or requests at [github](https://github.com/Zappo-II/WhatWatch/issues)...
