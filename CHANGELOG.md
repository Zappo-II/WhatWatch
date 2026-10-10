# Changelog

All notable changes to WhatWatch will be documented in this file.

## v17 - Monitor Selection, Bug Fixes and German Translation

### New
- Choose which monitor shows the clock (General > Monitor). The monitor is stored by connector name (e.g. `DP-2`); if it is not connected, the clock falls back to the primary monitor
- The clock is rebuilt when monitors are added, removed or rearranged

### Fixes
- Minimized or hidden windows no longer hide the clock when "Hide When Overlapped" is enabled
- A window without a workspace can no longer stop the clock; errors in the update timer are now logged instead of stopping it
- Clock width/height can no longer be set below 16 pixels (0 broke drawing)
- Shadow offset X/Y can now be negative (range -1.0 to 1.0), so shadows can fall left or up
- Fade in/out descriptions in the preferences said "lower = faster"; a higher value fades faster
- Debug logging now also works in the preferences dialog

### Improvements
- Settings are no longer polled 10 times per second; the extension reacts to setting changes via the `changed` signal
- All spin rows in the preferences are bound to their settings, so changes made via `gsettings`/`dconf` show up in an open dialog
- The preferences dialog now disconnects its debug-setting handler when it closes
- German translation completed (150/150 strings) and fixed a broken format string

### Cleanup
- Remove unused code (`test()`) and unused imports
- `install.local.sh` drops `POT-Creation-Date` from the generated `.pot`, so it no longer shows up as changed after every build
- Fix schema descriptions: clock width/height default to 256, not 128
- Remove dead and commented-out code in the drawing and window-overlap code; use `Meta.WindowType` constants instead of raw numbers
- Update documentation (tab names, monitor selection, fade and shadow ranges, debug option names)

## v16 - GNOME 51 Compatibility

- Add GNOME Shell 51 to supported versions
- Replace deprecated `Gtk.ColorButton` with `Gtk.ColorDialogButton` in the color settings
- Remove unused experimental D-Bus monitor code (`dbus_test()`), which would break under GNOME 51's `makeProxyWrapper()` change

## v13 - Preferences Dialog Modernization

**Rewritten preferences dialog using native libadwaita widgets**

### Changes
- **Complete UI overhaul**: Migrated from legacy `Gtk.Grid` layout to modern `Adw.PreferencesPage/Group/Row` pattern
- **Separate pages**: Split monolithic "Legacy Settings" into 8 dedicated tabs:
  - General, Behaviour, Face, Ticks, Hands, Shadow, Debug, About
- **Modern widgets**: Replaced manual widget assembly with native Adwaita rows:
  - `Adw.ComboRow` for dropdowns (clock style, position)
  - `Adw.SpinRow` for numeric values
  - `Adw.SwitchRow` for toggles
  - `Adw.EntryRow` for text input (blacklist)
  - `Adw.ExpanderRow` for collapsible sections
- **Improved color controls**: Colors now use collapsible `ExpanderRow` with `ColorButton` in header and R/G/B/A spin rows as children (collapsed by default, expandable for precise editing)
- **Hand style grouping**: Filled/Eyed/Tailed/Finned toggles grouped in expandable "Style" section per hand
- **Code reduction**: ~2,700 lines to ~1,000 lines (63% reduction)
- **Search enabled**: All settings are now searchable via the window search

### Technical
- Follows GNOME Human Interface Guidelines (HIG)
- Compatible with GNOME Shell 45-49
- Full functionality preserved - no settings removed

## v8.6 - 12

- Fix Gnome 49 version compatibility

## v8.5

- Fix Gnome 48 version compatibility

## v8.4

- Fix review issues

## v8.3

- Fix review issues
