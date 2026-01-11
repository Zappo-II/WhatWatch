# Changelog

All notable changes to WhatWatch will be documented in this file.

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
