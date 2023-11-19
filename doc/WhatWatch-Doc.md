# WhatWatch Documentation

![WhatWatch](WhatWatch-Icon.png)

## About

This is a gnome-shell-extension. It displays an analog clock on the desktop and exposes a great variety of customisation options.

![Screenshot showing WhatWatch clock on desktop with browser window opened behind it...](WhatWatch.png "Screenshot showing WhatWatch in action...")

## General Usage

The clock is non interactive. If you set it up to be non opaque you'll be able to see any controls hidden behind it. The clock acts as if it was not there in case you click on something behind it.

Since V.5 it has some configurational settings that let the clock hide if overlapped by application windows.

## Configuration

Use the extensions app of gnome-shell to activate / deactivate the extension or to launch it's settings dialog. You might also use the gnome-extension cli or the browser plugin of ego.

The settings dialog will expose quite a bunch of parameters and attributes of the clock to be configured.

![Screenshot showing WhatWatch settings dialog...](WhatWatch-Settings.png "Screenshot showing WhatWatch settings dialog in action...")

The settings are dived into different tabs for different parts of the clock:

* `Preferences` - General settings affecting the clock as a whole.
* `Behaviour` - If and when the clock will hide when overlapped by other windows.
* `Face` - Settings that style the clock's face appearance.
* `Ticks` - Settings that style the clock's interval markers.
* `Hands` - Settings that style the clock's hands.
* `Shadow` - Settings that style the shadow behaviour of the clock's elements.
* `Debug` - Settings that configure the logging behaviour for troubleshooting.

Followed by an `About` tab with some general information on the extension.

### `Preferences`

General settings affecting the clock as a whole.

* __Clock Style__ - Select a specific style flavour (currently one of):
    * __OldSchool__ (also __default__) - The base style, clean and classic, I like it...
    * __OldSchool Arabian__ - ...add Arabian numbers.
    * __OldSchool Roman__ - ...add Roman numbers.
    * __Deutsche Bahn__ - ...like seen everywhere in germany's public transportation.
    * __Radar__ - The death star is in firing range...
* __Clock Position__ - Select the general orientation on primary screen...
* __Margin Top__ - Pixel Margin from top of screen (will not allways be used depending on _clock position_)
* __Margin Side__ - Pixel Margin from the relevant side of screen (will not allways be used depending on _clock position_)
* __Clock Size Width__ - Width of the clock
    * Width/Height should be the same but you might want to adjust to match your screen's aspect ratio...
* __Clock Size Height__ - Height of the clock
    * Width/Height should be the same but you might want to adjust to match your screen's aspect ratio...

### `Behaviour`

Settings to configure if and when the clock will hide when overlapped by other windows.

* __Hide in fullscreen mode__ - When on, the clock will hide behind fullscreen windows (like fullscreen video etc.), otherwise it will even sit on top of those. Not affected by __Blacklist WM_Class(es)__.
* __Hide when overlapped__ - When on, the clock will fade out until hidden when overlapped by an application window.
* __Hide only on focus__ - When on, the clock will fade out until hidden when overlapped by an application window having the focus.
* __Fade in interval__ - Percentage step of opacity fade in every 100 ms.
* __Fade out interval__ - Percentage step of opacity fade in every 100 ms.
* __Blacklist WM_Class(es)__ - Windows of these window manager classes will not be considdered overlapping (this is essential when using extensions like `Desktop Icons NG` by example). Several class names might be concatenated by semicolon (`;`). You might want to use the debug settings to get the class name information you need.

### `Face`

Settings that style the clock's face appearance. Not all clock styles support all settings.

* __Face color (R/G/B/A)__ - `R`, `G`, `B` Color-Values are 0-1, with `0` no color and `1` full color of the certain channel. Same for `A` in Opacity. Values are given in their spin button value fields or via color picker control at the end of the config row.
* __Center Dial radius__ - Gives the size of the small dot in the center of the dial (You might think of it as the hands' axis).
* __Center Dial color (R/G/B/A)__ - See `Face color...`, but for center dial.
* __Dial Line (Width/Inset)__ - The dial can have a perimeter line, width and inset (from outer to inner) are given here.
* __Dial Line color (R/G/B/A)__ - See `Face color...`, but for dial line.


### `Ticks`

Settings that style the clock's interval markers. Not all clock styles support all settings.

* __Tick Inset__ - General inset (Distance from outer rim to start of ticks towards center of dial).
* __Minute Tick (Width/Inset)__ - Width of the minute ticks and inset length of the minutes ticks.
* __Circle (Inner/Outer)__ - If on a circle will be drawn at end (inner) and start (outer) of tick having tick's width.
* __Minute Tick color (R/G/B/A)__ - `R`, `G`, `B` Color-Values are 0-1, with `0` no color and `1` full color of the certain channel. Same for `A` in Opacity. Values are given in their spin button value fields or via color picker control at the end of the config row.
* __5/* Tick (Width/Inset)__ - Same as above but only for each five minute (hour) tick.
* __Circle (Inner/Outer)__ - Same as above but only for each five minute (hour) tick.
* __5/* Tick color (R/G/B/A)__ - Same as above but only for each five minute (hour) tick.
* __1/4 Tick (Width/Inset)__ - Same as above but only for each quarter of an hour tick.
* __Circle (Inner/Outer)__ - Same as above but only for each quarter of an hour tick.
* __1/4 Tick color (R/G/B/A)__ - Same as above but only for each quarter of an hour tick.


### `Hands`

Settings that style the clock's hands. Not all clock styles support all settings.

* __Hour Hand (Width/Length)__ - Width of the hour hand and length of it.
* __Filled/Eyed/Tailed/Finned__ - If on the hand will be filled, eyed, tailed, finned (if chosen style supports it).
* __Hour Hand color (R/G/B/A)__ - `R`, `G`, `B` Color-Values are 0-1, with `0` no color and `1` full color of the certain channel. Same for `A` in Opacity. Values are given in their spin button value fields or via color picker control at the end of the config row.
* __Minute Hand (Width/Length)__ - Same as above but for minute hand.
* __Filled/Eyed/Tailed/Finned__ - Same as above but for minute hand.
* __Minute Hand color (R/G/B/A)__ - Same as above but for minute hand.
* __Second Hand (Width/Length)__ - Same as above but for second hand. Set width to 0.0 to hide the second hand.
* __Filled/Eyed/Tailed/Finned__ - Same as above but for second hand.
* __Second Hand color (R/G/B/A)__ - Same as above but for second hand.

### `Shadow`

Settings that style the shadow behaviour of the clock's elements. Not all clock styles support all settings.

* __Shadow Hands__ - Hands cast shadows, when on.
* __Shadow Ticks__ - Ticks cast shadows, when on.
* __Shadow Numbers__ - Numbers cast shadows, when on.
* __Shadow offset (X/Y)__ - X and Y shadow offset values are given in their spin button value fields.
* __Shadow color (R/G/B/A)__ - `R`, `G`, `B` Color-Values are 0-1, with `0` no color and `1` full color of the certain channel. Same for `A` in Opacity. Values are given in their spin button value fields or via color picker control at the end of the config row.

### `Debug`

* __Debug Logging__ - Enable / disable general logging to the system's log.
* __Timerdebug__ - Enable / disable timer trigger logging to the system's log.
* __Timedebug__ - Enable / disable time value logging to the system's log.
* __Configdebug__ - Enable / disable configurational settings logging to the system's log.
* __Windowdebug__ - Enable / disable window overlapping analysis logging to the system's log. You might want to use this to gather window manager class name information for blacklisting to prevent unexpected or unwanted hiding behaviour. See __Blacklist WM_Class(es)__ in `Behaviour`. 
