/*
 *
 * org.gnome.shell.extensions.zappoii.whatwatch prefs...
 *
 * Visit https://github.com/Zappo-II/WhatWatch for
 * LICENSE and documentation
 *
 * Console-Debug:
 *   `journalctl -f -o cat /usr/bin/gjs`
 *
 */

'use strict';

import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import {ExtensionPreferences, gettext as _, ngettext, pgettext} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import * as Common from './common.js';

export default class WhatWatchPreferences extends ExtensionPreferences {
  constructor(metadata) {
    super(metadata);
    Common.setMetaData(metadata.name, metadata.version);
    Common.myDebugLog('Entering WhatWatchPreferences.constructor()');
    Common.myDebugLog('Exiting WhatWatchPreferences.constructor()');
  }

  fillPreferencesWindow(window) {
    Common.myDebugLog('Entering WhatWatchPreferences.fillPreferencesWindow()');

    window._settings = this.getSettings();

    // General Settings Page
    const pageGeneral = this._buildGeneralPage(window._settings);

    // Behaviour Page
    const pageBehaviour = this._buildBehaviourPage(window._settings);

    // Face Page
    const pageFace = this._buildFacePage(window._settings);

    // Ticks Page
    const pageTicks = this._buildTicksPage(window._settings);

    // Hands Page
    const pageHands = this._buildHandsPage(window._settings);

    // Shadow Page
    const pageShadow = this._buildShadowPage(window._settings);

    // Debug Page
    const pageDebug = this._buildDebugPage(window._settings);

    // About Page
    const pageAbout = this._buildAboutPage();

    // Add pages to window
    window.add(pageGeneral);
    window.add(pageBehaviour);
    window.add(pageFace);
    window.add(pageTicks);
    window.add(pageHands);
    window.add(pageShadow);
    window.add(pageDebug);
    window.add(pageAbout);

    window.set_search_enabled(true);

    Common.myDebugLog('Exiting WhatWatchPreferences.fillPreferencesWindow()');
  }

  // ============================================================
  // General Settings Page
  // ============================================================
  _buildGeneralPage(settings) {
    const page = new Adw.PreferencesPage({
      title: _('General'),
      icon_name: 'preferences-system-symbolic'
    });

    // Clock Style Group
    const groupStyle = new Adw.PreferencesGroup({
      title: _('Clock Style'),
      description: _('Configure the clock appearance')
    });

    // Clock Style
    const rowStyle = new Adw.ComboRow({
      title: _('Clock Style'),
      subtitle: _('Select the visual style of the clock')
    });
    rowStyle.model = new Gtk.StringList({ strings: [
      _('(default)'),
      _('OldSchool'),
      _('OldSchool Arabian'),
      _('OldSchool Roman'),
      _('Deutsche Bahn'),
      _('Radar')
    ]});
    const styleMap = ['default', 'OldSchool', 'OldSchoolArabian', 'OldSchoolRoman', 'OldSchoolDB', 'Radar'];
    const currentStyle = settings.get_string('clockstyle');
    rowStyle.selected = Math.max(0, styleMap.indexOf(currentStyle));
    rowStyle.connect('notify::selected', () => {
      settings.set_string('clockstyle', styleMap[rowStyle.selected]);
    });
    groupStyle.add(rowStyle);

    // Clock Position
    const rowPosition = new Adw.ComboRow({
      title: _('Clock Position'),
      subtitle: _('Where to display the clock on screen')
    });
    rowPosition.model = new Gtk.StringList({ strings: [
      _('(default)'),
      _('Top-Left'),
      _('Top-Middle'),
      _('Top-Right'),
      _('Center-Left'),
      _('Center'),
      _('Center-Right')
    ]});
    const positionMap = ['default', 'top-left', 'top-middle', 'top-right', 'center-left', 'center', 'center-right'];
    const currentPosition = settings.get_string('clockposition');
    rowPosition.selected = Math.max(0, positionMap.indexOf(currentPosition));
    rowPosition.connect('notify::selected', () => {
      settings.set_string('clockposition', positionMap[rowPosition.selected]);
    });
    groupStyle.add(rowPosition);

    page.add(groupStyle);

    // Size Group
    const groupSize = new Adw.PreferencesGroup({
      title: _('Size'),
      description: _('Configure the clock dimensions')
    });

    // Clock Width
    const rowWidth = new Adw.SpinRow({
      title: _('Clock Width'),
      subtitle: _('Width of the clock in pixels')
    });
    rowWidth.adjustment = new Gtk.Adjustment({
      lower: 0,
      upper: 1024,
      step_increment: 1,
      page_increment: 10,
      value: settings.get_int('clockwidth')
    });
    rowWidth.adjustment.connect('value-changed', () => {
      settings.set_int('clockwidth', rowWidth.adjustment.value);
      settings.set_boolean('forcereset', true);
    });
    groupSize.add(rowWidth);

    // Clock Height
    const rowHeight = new Adw.SpinRow({
      title: _('Clock Height'),
      subtitle: _('Height of the clock in pixels')
    });
    rowHeight.adjustment = new Gtk.Adjustment({
      lower: 0,
      upper: 1024,
      step_increment: 1,
      page_increment: 10,
      value: settings.get_int('clockheight')
    });
    rowHeight.adjustment.connect('value-changed', () => {
      settings.set_int('clockheight', rowHeight.adjustment.value);
      settings.set_boolean('forcereset', true);
    });
    groupSize.add(rowHeight);

    page.add(groupSize);

    // Margins Group
    const groupMargins = new Adw.PreferencesGroup({
      title: _('Margins'),
      description: _('Configure the clock position offsets')
    });

    // Margin Top
    const rowMarginTop = new Adw.SpinRow({
      title: _('Margin Top'),
      subtitle: _('Distance from the top of the screen')
    });
    rowMarginTop.adjustment = new Gtk.Adjustment({
      lower: 0,
      upper: 2000,
      step_increment: 1,
      page_increment: 10,
      value: settings.get_int('margintop')
    });
    rowMarginTop.adjustment.connect('value-changed', () => {
      settings.set_int('margintop', rowMarginTop.adjustment.value);
    });
    groupMargins.add(rowMarginTop);

    // Margin Side
    const rowMarginSide = new Adw.SpinRow({
      title: _('Margin Side'),
      subtitle: _('Distance from the side of the screen')
    });
    rowMarginSide.adjustment = new Gtk.Adjustment({
      lower: 0,
      upper: 4000,
      step_increment: 1,
      page_increment: 10,
      value: settings.get_int('marginside')
    });
    rowMarginSide.adjustment.connect('value-changed', () => {
      settings.set_int('marginside', rowMarginSide.adjustment.value);
    });
    groupMargins.add(rowMarginSide);

    page.add(groupMargins);

    return page;
  }

  // ============================================================
  // Behaviour Page
  // ============================================================
  _buildBehaviourPage(settings) {
    const page = new Adw.PreferencesPage({
      title: _('Behaviour'),
      icon_name: 'preferences-desktop-apps-symbolic'
    });

    // Visibility Group
    const groupVisibility = new Adw.PreferencesGroup({
      title: _('Visibility'),
      description: _('Configure when the clock should hide')
    });

    // Hide in fullscreen
    const rowFullscreen = new Adw.SwitchRow({
      title: _('Hide in Fullscreen Mode'),
      subtitle: _('Automatically hide the clock when a window is fullscreen')
    });
    settings.bind('trackfullscreen', rowFullscreen, 'active', Gio.SettingsBindFlags.DEFAULT);
    rowFullscreen.connect('notify::active', () => {
      settings.set_boolean('forcereset', true);
    });
    groupVisibility.add(rowFullscreen);

    // Hide when overlapped
    const rowOverlap = new Adw.SwitchRow({
      title: _('Hide When Overlapped'),
      subtitle: _('Automatically hide when windows overlap the clock')
    });
    settings.bind('hideonoverlap', rowOverlap, 'active', Gio.SettingsBindFlags.DEFAULT);
    groupVisibility.add(rowOverlap);

    // Hide only on focus
    const rowFocus = new Adw.SwitchRow({
      title: _('Hide Only on Focus'),
      subtitle: _('Only hide when the overlapping window is focused')
    });
    settings.bind('hideonfocusoverlap', rowFocus, 'active', Gio.SettingsBindFlags.DEFAULT);
    // Bind sensitivity to hideonoverlap
    settings.bind('hideonoverlap', rowFocus, 'sensitive', Gio.SettingsBindFlags.GET);
    groupVisibility.add(rowFocus);

    page.add(groupVisibility);

    // Fade Group
    const groupFade = new Adw.PreferencesGroup({
      title: _('Fade Animation'),
      description: _('Configure the fade in/out animation speed')
    });

    // Fade in interval
    const rowFadeIn = new Adw.SpinRow({
      title: _('Fade In Interval'),
      subtitle: _('Speed of fade in animation (lower = faster)'),
      digits: 3
    });
    rowFadeIn.adjustment = new Gtk.Adjustment({
      lower: 0.001,
      upper: 1.000,
      step_increment: 0.001,
      page_increment: 0.1,
      value: settings.get_double('hideincrease')
    });
    rowFadeIn.adjustment.connect('value-changed', () => {
      settings.set_double('hideincrease', rowFadeIn.adjustment.value);
    });
    settings.bind('hideonoverlap', rowFadeIn, 'sensitive', Gio.SettingsBindFlags.GET);
    groupFade.add(rowFadeIn);

    // Fade out interval
    const rowFadeOut = new Adw.SpinRow({
      title: _('Fade Out Interval'),
      subtitle: _('Speed of fade out animation (lower = faster)'),
      digits: 3
    });
    rowFadeOut.adjustment = new Gtk.Adjustment({
      lower: 0.001,
      upper: 1.000,
      step_increment: 0.001,
      page_increment: 0.1,
      value: settings.get_double('hidedecrease')
    });
    rowFadeOut.adjustment.connect('value-changed', () => {
      settings.set_double('hidedecrease', rowFadeOut.adjustment.value);
    });
    settings.bind('hideonoverlap', rowFadeOut, 'sensitive', Gio.SettingsBindFlags.GET);
    groupFade.add(rowFadeOut);

    page.add(groupFade);

    // Blacklist Group
    const groupBlacklist = new Adw.PreferencesGroup({
      title: _('Window Blacklist'),
      description: _('Windows that should never trigger hiding (semicolon-separated WM_CLASS names)')
    });

    const rowBlacklist = new Adw.EntryRow({
      title: _('Blacklist WM_Class(es)'),
      show_apply_button: true
    });
    rowBlacklist.text = settings.get_string('hideblacklist');
    rowBlacklist.connect('apply', () => {
      settings.set_string('hideblacklist', rowBlacklist.text.replace(/ /g, ''));
    });
    settings.bind('hideonoverlap', rowBlacklist, 'sensitive', Gio.SettingsBindFlags.GET);
    groupBlacklist.add(rowBlacklist);

    page.add(groupBlacklist);

    return page;
  }

  // ============================================================
  // Face Page
  // ============================================================
  _buildFacePage(settings) {
    const page = new Adw.PreferencesPage({
      title: _('Face'),
      icon_name: 'preferences-color-symbolic'
    });

    // Face Color Group
    const groupFace = new Adw.PreferencesGroup({
      title: _('Face'),
      description: _('Configure the clock face appearance')
    });

    // Face Color
    const rowFaceColor = this._createColorExpanderRow(
      settings,
      _('Face Color'),
      _('Background color of the clock face'),
      'facedialcolor'
    );
    groupFace.add(rowFaceColor);

    page.add(groupFace);

    // Center Dial Group
    const groupCenterDial = new Adw.PreferencesGroup({
      title: _('Center Dial'),
      description: _('Configure the center dial (hub) of the clock')
    });

    // Center Dial Radius
    const rowCenterRadius = new Adw.SpinRow({
      title: _('Center Dial Radius'),
      subtitle: _('Size of the center dial (0-1 relative to clock size)'),
      digits: 3
    });
    rowCenterRadius.adjustment = new Gtk.Adjustment({
      lower: 0.0,
      upper: 1.0,
      step_increment: 0.01,
      page_increment: 0.1,
      value: settings.get_double('facecenterdialradius')
    });
    rowCenterRadius.adjustment.connect('value-changed', () => {
      settings.set_double('facecenterdialradius', rowCenterRadius.adjustment.value);
    });
    groupCenterDial.add(rowCenterRadius);

    // Center Dial Color
    const rowCenterColor = this._createColorExpanderRow(
      settings,
      _('Center Dial Color'),
      _('Color of the center dial'),
      'facecenterdialcolor'
    );
    groupCenterDial.add(rowCenterColor);

    page.add(groupCenterDial);

    // Dial Line Group
    const groupDialLine = new Adw.PreferencesGroup({
      title: _('Dial Line'),
      description: _('Configure the outer dial line (rim) of the clock')
    });

    // Dial Line Width
    const rowDialWidth = new Adw.SpinRow({
      title: _('Dial Line Width'),
      subtitle: _('Width of the dial line (0-1 relative to clock size)'),
      digits: 3
    });
    rowDialWidth.adjustment = new Gtk.Adjustment({
      lower: 0.0,
      upper: 1.0,
      step_increment: 0.01,
      page_increment: 0.1,
      value: settings.get_double('facediallinewidth')
    });
    rowDialWidth.adjustment.connect('value-changed', () => {
      settings.set_double('facediallinewidth', rowDialWidth.adjustment.value);
    });
    groupDialLine.add(rowDialWidth);

    // Dial Line Inset
    const rowDialInset = new Adw.SpinRow({
      title: _('Dial Line Inset'),
      subtitle: _('Inset of the dial line from the edge'),
      digits: 3
    });
    rowDialInset.adjustment = new Gtk.Adjustment({
      lower: 0.0,
      upper: 1.0,
      step_increment: 0.01,
      page_increment: 0.1,
      value: settings.get_double('facediallineinset')
    });
    rowDialInset.adjustment.connect('value-changed', () => {
      settings.set_double('facediallineinset', rowDialInset.adjustment.value);
    });
    groupDialLine.add(rowDialInset);

    // Dial Line Color
    const rowDialColor = this._createColorExpanderRow(
      settings,
      _('Dial Line Color'),
      _('Color of the dial line'),
      'facediallinecolor'
    );
    groupDialLine.add(rowDialColor);

    page.add(groupDialLine);

    return page;
  }

  // ============================================================
  // Ticks Page
  // ============================================================
  _buildTicksPage(settings) {
    const page = new Adw.PreferencesPage({
      title: _('Ticks'),
      icon_name: 'view-grid-symbolic'
    });

    // General Tick Settings
    const groupGeneral = new Adw.PreferencesGroup({
      title: _('General'),
      description: _('Global tick settings')
    });

    const rowTickInset = new Adw.SpinRow({
      title: _('Tick Inset'),
      subtitle: _('Global inset for all ticks from the dial line'),
      digits: 3
    });
    rowTickInset.adjustment = new Gtk.Adjustment({
      lower: 0.0,
      upper: 1.0,
      step_increment: 0.01,
      page_increment: 0.1,
      value: settings.get_double('facediallinetickinset')
    });
    rowTickInset.adjustment.connect('value-changed', () => {
      settings.set_double('facediallinetickinset', rowTickInset.adjustment.value);
    });
    groupGeneral.add(rowTickInset);

    page.add(groupGeneral);

    // Minute Ticks Group
    const groupMinute = new Adw.PreferencesGroup({
      title: _('Minute Ticks'),
      description: _('Configure the small minute tick marks')
    });

    this._addTickSettings(groupMinute, settings, 'faceminutetick', _('Minute Tick'));
    page.add(groupMinute);

    // Hour Ticks Group (5-minute marks)
    const groupHour = new Adw.PreferencesGroup({
      title: _('Hour Ticks (5-minute marks)'),
      description: _('Configure the 5-minute interval tick marks')
    });

    this._addTickSettings(groupHour, settings, 'facetick', _('Hour Tick'));
    page.add(groupHour);

    // Quarter Ticks Group
    const groupQuarter = new Adw.PreferencesGroup({
      title: _('Quarter Ticks (15-minute marks)'),
      description: _('Configure the quarter hour tick marks')
    });

    this._addTickSettings(groupQuarter, settings, 'faceprominenttick', _('Quarter Tick'));
    page.add(groupQuarter);

    return page;
  }

  _addTickSettings(group, settings, prefix, label) {
    // Width
    const rowWidth = new Adw.SpinRow({
      title: _('%s Width').format(label),
      subtitle: _('Width of the tick marks'),
      digits: 3
    });
    rowWidth.adjustment = new Gtk.Adjustment({
      lower: 0.0,
      upper: 1.0,
      step_increment: 0.01,
      page_increment: 0.1,
      value: settings.get_double(prefix + 'linewidth')
    });
    rowWidth.adjustment.connect('value-changed', () => {
      settings.set_double(prefix + 'linewidth', rowWidth.adjustment.value);
    });
    group.add(rowWidth);

    // Inset
    const rowInset = new Adw.SpinRow({
      title: _('%s Inset').format(label),
      subtitle: _('Length/inset of the tick marks'),
      digits: 3
    });
    rowInset.adjustment = new Gtk.Adjustment({
      lower: 0.0,
      upper: 1.0,
      step_increment: 0.01,
      page_increment: 0.1,
      value: settings.get_double(prefix + 'lineinset')
    });
    rowInset.adjustment.connect('value-changed', () => {
      settings.set_double(prefix + 'lineinset', rowInset.adjustment.value);
    });
    group.add(rowInset);

    // Circle toggles
    const rowCircleInner = new Adw.SwitchRow({
      title: _('%s Inner Circle').format(label),
      subtitle: _('Draw as circle at inner position')
    });
    settings.bind(prefix + 'circle', rowCircleInner, 'active', Gio.SettingsBindFlags.DEFAULT);
    group.add(rowCircleInner);

    const rowCircleOuter = new Adw.SwitchRow({
      title: _('%s Outer Circle').format(label),
      subtitle: _('Draw as circle at outer position')
    });
    settings.bind(prefix + 'outercircle', rowCircleOuter, 'active', Gio.SettingsBindFlags.DEFAULT);
    group.add(rowCircleOuter);

    // Color
    const rowColor = this._createColorExpanderRow(
      settings,
      _('%s Color').format(label),
      _('Color of the tick marks'),
      prefix + 'color'
    );
    group.add(rowColor);
  }

  // ============================================================
  // Hands Page
  // ============================================================
  _buildHandsPage(settings) {
    const page = new Adw.PreferencesPage({
      title: _('Hands'),
      icon_name: 'document-edit-symbolic'
    });

    // Hour Hand Group
    const groupHour = new Adw.PreferencesGroup({
      title: _('Hour Hand'),
      description: _('Configure the hour hand appearance')
    });
    this._addHandSettings(groupHour, settings, 'facehourhand', _('Hour Hand'));
    page.add(groupHour);

    // Minute Hand Group
    const groupMinute = new Adw.PreferencesGroup({
      title: _('Minute Hand'),
      description: _('Configure the minute hand appearance')
    });
    this._addHandSettings(groupMinute, settings, 'faceminutehand', _('Minute Hand'));
    page.add(groupMinute);

    // Second Hand Group
    const groupSecond = new Adw.PreferencesGroup({
      title: _('Second Hand'),
      description: _('Configure the second hand appearance')
    });
    this._addHandSettings(groupSecond, settings, 'facesecondhand', _('Second Hand'));
    page.add(groupSecond);

    return page;
  }

  _addHandSettings(group, settings, prefix, label) {
    // Width
    const rowWidth = new Adw.SpinRow({
      title: _('%s Width').format(label),
      subtitle: _('Width of the hand'),
      digits: 3
    });
    rowWidth.adjustment = new Gtk.Adjustment({
      lower: 0.0,
      upper: 1.0,
      step_increment: 0.01,
      page_increment: 0.1,
      value: settings.get_double(prefix + 'linewidth')
    });
    rowWidth.adjustment.connect('value-changed', () => {
      settings.set_double(prefix + 'linewidth', rowWidth.adjustment.value);
    });
    group.add(rowWidth);

    // Length
    const rowLength = new Adw.SpinRow({
      title: _('%s Length').format(label),
      subtitle: _('Length of the hand'),
      digits: 3
    });
    rowLength.adjustment = new Gtk.Adjustment({
      lower: 0.0,
      upper: 1.0,
      step_increment: 0.01,
      page_increment: 0.1,
      value: settings.get_double(prefix + 'linelength')
    });
    rowLength.adjustment.connect('value-changed', () => {
      settings.set_double(prefix + 'linelength', rowLength.adjustment.value);
    });
    group.add(rowLength);

    // Style toggles in an expander
    const rowStyles = new Adw.ExpanderRow({
      title: _('%s Style').format(label),
      subtitle: _('Hand shape options')
    });

    const rowFilled = new Adw.SwitchRow({
      title: _('Filled'),
      subtitle: _('Draw hand with filled shape')
    });
    settings.bind(prefix + 'filled', rowFilled, 'active', Gio.SettingsBindFlags.DEFAULT);
    rowStyles.add_row(rowFilled);

    const rowEyed = new Adw.SwitchRow({
      title: _('Eyed'),
      subtitle: _('Add an eye/hole to the hand')
    });
    settings.bind(prefix + 'eyed', rowEyed, 'active', Gio.SettingsBindFlags.DEFAULT);
    rowStyles.add_row(rowEyed);

    const rowTailed = new Adw.SwitchRow({
      title: _('Tailed'),
      subtitle: _('Add a tail/counterweight to the hand')
    });
    settings.bind(prefix + 'tailed', rowTailed, 'active', Gio.SettingsBindFlags.DEFAULT);
    rowStyles.add_row(rowTailed);

    const rowFinned = new Adw.SwitchRow({
      title: _('Finned'),
      subtitle: _('Add fins to the hand')
    });
    settings.bind(prefix + 'finned', rowFinned, 'active', Gio.SettingsBindFlags.DEFAULT);
    rowStyles.add_row(rowFinned);

    group.add(rowStyles);

    // Color
    const rowColor = this._createColorExpanderRow(
      settings,
      _('%s Color').format(label),
      _('Color of the hand'),
      prefix + 'color'
    );
    group.add(rowColor);
  }

  // ============================================================
  // Shadow Page
  // ============================================================
  _buildShadowPage(settings) {
    const page = new Adw.PreferencesPage({
      title: _('Shadow'),
      icon_name: 'weather-clear-symbolic'
    });

    // Shadow Toggles Group
    const groupToggles = new Adw.PreferencesGroup({
      title: _('Shadow Elements'),
      description: _('Choose which elements cast shadows')
    });

    const rowShadowHands = new Adw.SwitchRow({
      title: _('Shadow Hands'),
      subtitle: _('Draw shadows for clock hands')
    });
    settings.bind('faceshadowhand', rowShadowHands, 'active', Gio.SettingsBindFlags.DEFAULT);
    groupToggles.add(rowShadowHands);

    const rowShadowTicks = new Adw.SwitchRow({
      title: _('Shadow Ticks'),
      subtitle: _('Draw shadows for tick marks')
    });
    settings.bind('faceshadowtick', rowShadowTicks, 'active', Gio.SettingsBindFlags.DEFAULT);
    groupToggles.add(rowShadowTicks);

    const rowShadowNumbers = new Adw.SwitchRow({
      title: _('Shadow Numbers'),
      subtitle: _('Draw shadows for numbers')
    });
    settings.bind('faceshadownumber', rowShadowNumbers, 'active', Gio.SettingsBindFlags.DEFAULT);
    groupToggles.add(rowShadowNumbers);

    page.add(groupToggles);

    // Shadow Offset Group
    const groupOffset = new Adw.PreferencesGroup({
      title: _('Shadow Offset'),
      description: _('Configure shadow position')
    });

    const rowOffsetX = new Adw.SpinRow({
      title: _('Shadow Offset X'),
      subtitle: _('Horizontal shadow offset'),
      digits: 3
    });
    rowOffsetX.adjustment = new Gtk.Adjustment({
      lower: 0.0,
      upper: 1.0,
      step_increment: 0.01,
      page_increment: 0.1,
      value: settings.get_double('faceshadowoffsetx')
    });
    rowOffsetX.adjustment.connect('value-changed', () => {
      settings.set_double('faceshadowoffsetx', rowOffsetX.adjustment.value);
    });
    groupOffset.add(rowOffsetX);

    const rowOffsetY = new Adw.SpinRow({
      title: _('Shadow Offset Y'),
      subtitle: _('Vertical shadow offset'),
      digits: 3
    });
    rowOffsetY.adjustment = new Gtk.Adjustment({
      lower: 0.0,
      upper: 1.0,
      step_increment: 0.01,
      page_increment: 0.1,
      value: settings.get_double('faceshadowoffsety')
    });
    rowOffsetY.adjustment.connect('value-changed', () => {
      settings.set_double('faceshadowoffsety', rowOffsetY.adjustment.value);
    });
    groupOffset.add(rowOffsetY);

    page.add(groupOffset);

    // Shadow Color Group
    const groupColor = new Adw.PreferencesGroup({
      title: _('Shadow Color'),
      description: _('Configure shadow color and opacity')
    });

    const rowColor = this._createColorExpanderRow(
      settings,
      _('Shadow Color'),
      _('Color and opacity of shadows'),
      'faceshadowcolor'
    );
    groupColor.add(rowColor);

    page.add(groupColor);

    return page;
  }

  // ============================================================
  // Debug Page
  // ============================================================
  _buildDebugPage(settings) {
    const page = new Adw.PreferencesPage({
      title: _('Debug'),
      icon_name: 'find-location-symbolic'
    });

    const group = new Adw.PreferencesGroup({
      title: _('Debug Settings'),
      description: _('Configure the debug logging behaviour')
    });

    const rowDebug = new Adw.SwitchRow({
      title: _('Debugging'),
      subtitle: _('General debug mode, toggles debug output in general')
    });
    settings.bind('debuglogging', rowDebug, 'active', Gio.SettingsBindFlags.DEFAULT);
    group.add(rowDebug);

    const rowTimer = new Adw.SwitchRow({
      title: _('Timer Debugging'),
      subtitle: _('Timer debug mode, toggles timer specific debug output')
    });
    settings.bind('timerdebug', rowTimer, 'active', Gio.SettingsBindFlags.DEFAULT);
    settings.bind('debuglogging', rowTimer, 'sensitive', Gio.SettingsBindFlags.GET);
    group.add(rowTimer);

    const rowTime = new Adw.SwitchRow({
      title: _('Time Debugging'),
      subtitle: _('Time debug mode, toggles time specific debug output')
    });
    settings.bind('timedebug', rowTime, 'active', Gio.SettingsBindFlags.DEFAULT);
    settings.bind('debuglogging', rowTime, 'sensitive', Gio.SettingsBindFlags.GET);
    group.add(rowTime);

    const rowConfig = new Adw.SwitchRow({
      title: _('Config Debugging'),
      subtitle: _('Config debug mode, toggles configuration specific debug output')
    });
    settings.bind('configdebug', rowConfig, 'active', Gio.SettingsBindFlags.DEFAULT);
    settings.bind('debuglogging', rowConfig, 'sensitive', Gio.SettingsBindFlags.GET);
    group.add(rowConfig);

    const rowWindow = new Adw.SwitchRow({
      title: _('Window Debugging'),
      subtitle: _('Window debug mode, toggles window overlapping analysis logging. Use to gather WM_CLASS names for blacklisting.')
    });
    settings.bind('windowdebug', rowWindow, 'active', Gio.SettingsBindFlags.DEFAULT);
    settings.bind('debuglogging', rowWindow, 'sensitive', Gio.SettingsBindFlags.GET);
    group.add(rowWindow);

    // Reset sub-debug options when main debug is disabled
    settings.connect('changed::debuglogging', () => {
      if (!settings.get_boolean('debuglogging')) {
        settings.set_boolean('timerdebug', false);
        settings.set_boolean('timedebug', false);
        settings.set_boolean('configdebug', false);
        settings.set_boolean('windowdebug', false);
      }
    });

    page.add(group);

    return page;
  }

  // ============================================================
  // About Page
  // ============================================================
  _buildAboutPage() {
    const page = new Adw.PreferencesPage({
      title: _('About'),
      icon_name: 'help-about-symbolic'
    });

    const group = new Adw.PreferencesGroup({
      title: _('About %s - V.%s (%s)').format(
        this.metadata.name,
        this.metadata.version,
        this.metadata['version-name']
      ),
      description: _('%s was first brought to you in 02.2022 by Zappo II').format(this.metadata.name)
    });

    const rowDescription = new Adw.ActionRow({
      icon_name: 'dialog-information-symbolic',
      title: this.metadata['description']
    });
    group.add(rowDescription);

    const rowEgo = new Adw.ActionRow({
      icon_name: 'start-here',
      title: _('Visit this extension@gnome.org...')
    });
    const egoLink = new Gtk.LinkButton({
      label: 'Gnome',
      uri: 'https://extensions.gnome.org/extension/4806/what-watch/'
    });
    rowEgo.add_suffix(egoLink);
    rowEgo.set_activatable_widget(egoLink);
    group.add(rowEgo);

    const rowGithub = new Adw.ActionRow({
      icon_name: 'emblem-system-symbolic',
      title: _('Documentation, Issues, Code, License, etc.')
    });
    const githubLink = new Gtk.LinkButton({
      label: 'Github',
      uri: this.metadata['url']
    });
    rowGithub.add_suffix(githubLink);
    rowGithub.set_activatable_widget(githubLink);
    group.add(rowGithub);

    page.add(group);

    return page;
  }

  // ============================================================
  // Helper: Create Color Expander Row
  // ============================================================
  _createColorExpanderRow(settings, title, subtitle, settingsPrefix) {
    const expander = new Adw.ExpanderRow({
      title: title,
      subtitle: subtitle
    });

    // Create color button for the header
    const colorButton = new Gtk.ColorButton({
      use_alpha: true,
      valign: Gtk.Align.CENTER
    });

    // Initialize color from settings
    const color = new Gdk.RGBA();
    color.red = settings.get_double(settingsPrefix + '-r');
    color.green = settings.get_double(settingsPrefix + '-g');
    color.blue = settings.get_double(settingsPrefix + '-b');
    color.alpha = settings.get_double(settingsPrefix + '-a');
    colorButton.set_rgba(color);

    expander.add_suffix(colorButton);

    // Create spin rows for R, G, B, A
    const channels = [
      { key: '-r', label: _('Red'), value: color.red },
      { key: '-g', label: _('Green'), value: color.green },
      { key: '-b', label: _('Blue'), value: color.blue },
      { key: '-a', label: _('Alpha'), value: color.alpha }
    ];

    const spinRows = {};

    for (const channel of channels) {
      const row = new Adw.SpinRow({
        title: channel.label,
        digits: 3
      });
      row.adjustment = new Gtk.Adjustment({
        lower: 0.0,
        upper: 1.0,
        step_increment: 0.01,
        page_increment: 0.1,
        value: channel.value
      });

      const settingKey = settingsPrefix + channel.key;
      const channelKey = channel.key;

      row.adjustment.connect('value-changed', () => {
        settings.set_double(settingKey, row.adjustment.value);
        // Update color button
        const newColor = new Gdk.RGBA();
        newColor.red = colorButton.rgba.red;
        newColor.green = colorButton.rgba.green;
        newColor.blue = colorButton.rgba.blue;
        newColor.alpha = colorButton.rgba.alpha;

        if (channelKey === '-r') newColor.red = row.adjustment.value;
        else if (channelKey === '-g') newColor.green = row.adjustment.value;
        else if (channelKey === '-b') newColor.blue = row.adjustment.value;
        else if (channelKey === '-a') newColor.alpha = row.adjustment.value;

        colorButton.set_rgba(newColor);
      });

      spinRows[channel.key] = row;
      expander.add_row(row);
    }

    // Connect color button to update spin rows
    colorButton.connect('color-set', () => {
      const rgba = colorButton.rgba;
      spinRows['-r'].adjustment.value = rgba.red;
      spinRows['-g'].adjustment.value = rgba.green;
      spinRows['-b'].adjustment.value = rgba.blue;
      spinRows['-a'].adjustment.value = rgba.alpha;
    });

    return expander;
  }
}
