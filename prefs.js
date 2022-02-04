/* 
 * 
 * org.gnome.shell.extensions.zappoii.whatwatch prefs...
 * 
 * Console-Debug:
 *   `journalctl -f -o cat /usr/bin/gjs`
 * 
 */

'use strict';

const {GObject, Gtk, Gdk, Gio} = imports.gi;
//
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Common = Me.imports.common;
const schemaid = Me.metadata['settings-schema'];
var settings;
//

function init () {
  Common.myDebugLog('Entering prefs.js init()');

  try {
    settings = ExtensionUtils.getSettings(schemaid);
    Common.debugLogging = settings.get_boolean("debuglogging");
  } catch (e) {
    Common.myErrorLog('Error getting Settings(\'' + schemaid + '\'): ' + e);
    Common.myErrorLog('It is most likely that the config is somehow corrupted...');
  }

  Common.myDebugLog('Exiting prefs.js init()');
}

function buildPrefsWidget () {
  Common.myDebugLog('Entering prefs.js buildPrefsWidget()');
  let prefsWidget = new Gtk.Notebook();

  prefsWidget.append_page(buildPrefsPage(), new Gtk.Label({ label: 'Preferences' }));
  prefsWidget.append_page(buildFacePage(), new Gtk.Label({ label: 'Face' }));
  prefsWidget.append_page(buildTickPage(), new Gtk.Label({ label: 'Ticks' }));
  prefsWidget.append_page(buildHandPage(), new Gtk.Label({ label: 'Hands' }));
  prefsWidget.append_page(buildShadowPage(), new Gtk.Label({ label: 'Shadow' }));
  prefsWidget.append_page(buildAboutPage(), new Gtk.Label({ label: 'About' }));

  Common.myDebugLog('Exiting prefs.js buildPrefsWidget()');
  return prefsWidget;
}

function buildPrefsPage () {
  Common.myDebugLog('Entering prefs.js buildPrefsPage()');

  let prefsWidget = new Gtk.Grid({
    margin_start: 18,
    margin_end: 18,
    margin_top: 18,
    margin_bottom: 18,
    column_spacing: 12,
    row_spacing: 12,
    visible: true
  });

  // Title...

  let title = new Gtk.Label({
    label: `<b>${Me.metadata.name} (V.${Me.metadata.version}) - Preferences</b>`,
    halign: Gtk.Align.START,
    use_markup: true,
    visible: true
  });
  prefsWidget.attach(title, 0, 0, 2, 1);

  // Debug Toggle

  let debugToggleRow = 1;

  let toggleDebugLoggingLabel = new Gtk.Label({
    label: 'Debug Logging:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(toggleDebugLoggingLabel, 0, debugToggleRow, 1, 1);

  let toggleDebugLogging = new Gtk.Switch({
    active: this.settings.get_boolean("debuglogging"),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggleDebugLogging, 2, debugToggleRow, 1, 1);

  this.settings.bind(
    'debuglogging',
    toggleDebugLogging,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  // clockStyle = settings.get_string("clockstyle");

  let styleRow = debugToggleRow + 1;

  let styleLabel = new Gtk.Label({
    label: 'Clock style:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(styleLabel, 0, styleRow, 1, 1);

  let styleValue = new Gtk.ComboBoxText();
  styleValue.append('default', '(default)');
  styleValue.append('OldSchool', 'OldSchool');
  styleValue.append('OldSchoolKinkyHands', 'OldSchool alt.');
  styleValue.append('OldSchoolKinkyHardCore', 'OldSchool heavy');
  //
  styleValue.append('OldSchoolNumbered', 'OldSchool num.');
  styleValue.append('OldSchoolKinkyHandsNumbered', 'OldSchool alt. num.');
  styleValue.append('OldSchoolKinkyHardCoreNumbered', 'OldSchool heavy num.');
  //
  styleValue.append('OldSchoolDB', 'Deutsche Bahn');
  styleValue.append('OldSchoolKinkyHandsDB', 'Deutsche Bahn alt.');
  styleValue.append('Radar', 'Radar');
  this.settings.bind('clockstyle', styleValue, 'active-id', Gio.SettingsBindFlags.DEFAULT);
  prefsWidget.attach(styleValue, 1, styleRow, 2, 1);

  // clockPosition = settings.get_string("clockposition");

  styleRow += 1;

  let positionLabel = new Gtk.Label({
    label: 'Clock position:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(positionLabel, 0, styleRow, 1, 1);

  let positionValue = new Gtk.ComboBoxText({
    halign: Gtk.Align.END
  });
  positionValue.append('default', '(default)');
  positionValue.append('top-left', 'Top-Left');
  positionValue.append('top-middle', 'Top-Middle');
  positionValue.append('top-right', 'Top-Right');
  positionValue.append('center-left', 'Center-Left');
  positionValue.append('center', 'Center');
  positionValue.append('center-right', 'Center-Right');
  this.settings.bind('clockposition', positionValue, 'active-id', Gio.SettingsBindFlags.DEFAULT);
  prefsWidget.attach(positionValue, 1, styleRow, 2, 1);

  // clockWidth = settings.get_int("clockwidth"); / clockHeight = settings.get_int("clockheight");

  let widthHeightRow = styleRow + 1;

  let spinWidthLabel = new Gtk.Label({
    label: 'Clock size width:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinWidthLabel, 0, widthHeightRow, 1, 1);

  let spinWidth = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 0
  });
  spinWidth.set_sensitive(true);
  spinWidth.set_range(0, 1024);
  spinWidth.set_value(this.settings.get_int('clockwidth'));
  spinWidth.set_increments(1, 10);
  spinWidth.connect('value-changed', w => {
      this.settings.set_int('clockwidth', w.get_value());
  });
  prefsWidget.attach(spinWidth, 2, widthHeightRow, 1, 1);

  let spinWidthNotification = new Gtk.Label({
    label: `<i>must restart <b>${Me.metadata.name}</b> to take effekt.</i>`,
    halign: Gtk.Align.START,
    use_markup: true,
    visible: true
  });
  prefsWidget.attach(spinWidthNotification, 3, widthHeightRow, 3, 1);

  widthHeightRow += 1;

  let spinHeightLabel = new Gtk.Label({
    label: 'Clock size height:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinHeightLabel, 0, widthHeightRow, 1, 1);

  let spinHeight = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 0
  });
  spinHeight.set_sensitive(true);
  spinHeight.set_range(0, 1024);
  spinHeight.set_value(this.settings.get_int('clockheight'));
  spinHeight.set_increments(1, 10);
  spinHeight.connect('value-changed', w => {
      this.settings.set_int('clockheight', w.get_value());
  });
  prefsWidget.attach(spinHeight, 2, widthHeightRow, 1, 1);

  let spinHeightNotification = new Gtk.Label({
    label: `<i>must restart <b>${Me.metadata.name}</b> to take effekt.</i>`,
    halign: Gtk.Align.START,
    use_markup: true,
    visible: true
  });
  prefsWidget.attach(spinHeightNotification, 3, widthHeightRow, 3, 1);

  // marginTop = settings.get_int("margintop"); marginSide = settings.get_int("marginside");

  let marginRow = widthHeightRow +1;

  let spinMarginTopLabel = new Gtk.Label({
    label: 'Margin top:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinMarginTopLabel, 0, marginRow, 1, 1);

  let spinMarginTop = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 0
  });
  spinMarginTop.set_sensitive(true);
  spinMarginTop.set_range(0, 2000);
  spinMarginTop.set_value(this.settings.get_int('margintop'));
  spinMarginTop.set_increments(1, 10);
  spinMarginTop.connect('value-changed', w => {
      this.settings.set_int('margintop', w.get_value());
  });
  prefsWidget.attach(spinMarginTop, 2, marginRow, 1, 1);

  marginRow += 1;

  let spinMarginSideLabel = new Gtk.Label({
    label: 'Margin side:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinMarginSideLabel, 0, marginRow, 1, 1);

  let spinMarginSide = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 0
  });
  spinMarginSide.set_sensitive(true);
  spinMarginSide.set_range(0, 4000);
  spinMarginSide.set_value(this.settings.get_int('marginside'));
  spinMarginSide.set_increments(1, 10);
  spinMarginSide.connect('value-changed', w => {
      this.settings.set_int('marginside', w.get_value());
  });
  prefsWidget.attach(spinMarginSide, 2, marginRow, 1, 1);

  Common.myDebugLog('Exiting prefs.js buildPrefsPage()');
  return prefsWidget;
}

function buildFacePage () {
  Common.myDebugLog('Entering prefs.js buildFacePage()');

  let _colorSet;

  let prefsWidget = new Gtk.Grid({
    margin_start: 18,
    margin_end: 18,
    margin_top: 18,
    margin_bottom: 18,
    column_spacing: 12,
    row_spacing: 12,
    visible: true
  });

  // Title...

  let title = new Gtk.Label({
    label: `<b>${Me.metadata.name} (V.${Me.metadata.version}) - Face</b>`,
    halign: Gtk.Align.START,
    use_markup: true,
    visible: true
  });
  prefsWidget.attach(title, 0, 0, 2, 1);

  // faceColor

  let faceColorRow = 1;

  let spinFaceDialColor_ALabel = new Gtk.Label({
    label: 'Face color (R/G/B/A):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinFaceDialColor_ALabel, 0, faceColorRow, 1, 1);

  let spinFaceDialColor_R = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceDialColor_R.set_sensitive(true);
  spinFaceDialColor_R.set_range(0.0, 1.0);
  spinFaceDialColor_R.set_value(this.settings.get_double('facedialcolor-r'));
  spinFaceDialColor_R.set_increments(0.01, 0.1);
  spinFaceDialColor_R.connect('value-changed', w => {
      this.settings.set_double('facedialcolor-r', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceDialColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.red = w.get_value();
      Common.myDebugLog('spinFaceDialColor_R changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceDialColor_R, 1, faceColorRow, 1, 1);

  let spinFaceDialColor_G = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceDialColor_G.set_sensitive(true);
  spinFaceDialColor_G.set_range(0.0, 1.0);
  spinFaceDialColor_G.set_value(this.settings.get_double('facedialcolor-g'));
  spinFaceDialColor_G.set_increments(0.01, 0.1);
  spinFaceDialColor_G.connect('value-changed', w => {
      this.settings.set_double('facedialcolor-g', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceDialColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.green = w.get_value();
      Common.myDebugLog('spinFaceDialColor_G changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceDialColor_G, 2, faceColorRow, 1, 1);

  let spinFaceDialColor_B = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceDialColor_B.set_sensitive(true);
  spinFaceDialColor_B.set_range(0.0, 1.0);
  spinFaceDialColor_B.set_value(this.settings.get_double('facedialcolor-b'));
  spinFaceDialColor_B.set_increments(0.01, 0.1);
  spinFaceDialColor_B.connect('value-changed', w => {
      this.settings.set_double('facedialcolor-b', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceDialColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.blue = w.get_value();
      Common.myDebugLog('spinFaceDialColor_B changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceDialColor_B, 3, faceColorRow, 1, 1);

  let spinFaceDialColor_A = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceDialColor_A.set_sensitive(true);
  spinFaceDialColor_A.set_range(0.0, 1.0);
  spinFaceDialColor_A.set_value(this.settings.get_double('facedialcolor-a'));
  spinFaceDialColor_A.set_increments(0.01, 0.1);
  spinFaceDialColor_A.connect('value-changed', w => {
      this.settings.set_double('facedialcolor-a', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceDialColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.alpha = w.get_value();
      Common.myDebugLog('spinFaceDialColor_A changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceDialColor_A, 4, faceColorRow, 1, 1);

  let buttonFaceDialColor = new Gtk.ColorButton({halign: Gtk.Align.END});
  buttonFaceDialColor.set_use_alpha(true);
  _colorSet = new Gdk.RGBA();
  _colorSet.red = this.settings.get_double('facedialcolor-r');
  _colorSet.green = this.settings.get_double('facedialcolor-g');
  _colorSet.blue = this.settings.get_double('facedialcolor-b');
  _colorSet.alpha = this.settings.get_double('facedialcolor-a');
  buttonFaceDialColor.set_rgba(_colorSet);
  buttonFaceDialColor.connect("color_set", () => {
    Common.myDebugLog('buttonFaceDialColor.rgba       : ' + buttonFaceDialColor.rgba.to_string());
    Common.myDebugLog('buttonFaceDialColor.rgba.red   : ' + buttonFaceDialColor.rgba.red);
    Common.myDebugLog('buttonFaceDialColor.rgba.green : ' + buttonFaceDialColor.rgba.green);
    Common.myDebugLog('buttonFaceDialColor.rgba.blue  : ' + buttonFaceDialColor.rgba.blue);
    Common.myDebugLog('buttonFaceDialColor.rgba.alpha : ' + buttonFaceDialColor.rgba.alpha);
    spinFaceDialColor_R.set_value(buttonFaceDialColor.rgba.red);
    spinFaceDialColor_G.set_value(buttonFaceDialColor.rgba.green);
    spinFaceDialColor_B.set_value(buttonFaceDialColor.rgba.blue);
    spinFaceDialColor_A.set_value(buttonFaceDialColor.rgba.alpha);
  });
  prefsWidget.attach(buttonFaceDialColor, 5, faceColorRow, 1, 1);

  // faceCenterDialRadius = settings.get_double("facecenterdialradius");

  let faceCenterDialRadiusRow = faceColorRow +1;

  let spinFaceCenterDialRadius_Label = new Gtk.Label({
    label: 'Center Dial radius:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinFaceCenterDialRadius_Label, 0, faceCenterDialRadiusRow, 1, 1);

  let spinFaceCenterDialRadius = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceCenterDialRadius.set_sensitive(true);
  spinFaceCenterDialRadius.set_range(0.0, 1.0);
  spinFaceCenterDialRadius.set_value(this.settings.get_double('facecenterdialradius'));
  spinFaceCenterDialRadius.set_increments(0.01, 0.1);
  spinFaceCenterDialRadius.connect('value-changed', w => {
      this.settings.set_double('facecenterdialradius', w.get_value());
  });
  prefsWidget.attach(spinFaceCenterDialRadius, 1, faceCenterDialRadiusRow, 1, 1);

  // faceCenterDialColor = {"R": settings.get_double("facecenterdialcolor-r"), "G": settings.get_double("facecenterdialcolor-g"), "B": settings.get_double("facecenterdialcolor-b"), "A": settings.get_double("facecenterdialcolor-a")};

  let faceCenterDialColorRow = faceCenterDialRadiusRow +1;

  let spinFaceCenterDialColor_ALabel = new Gtk.Label({
    label: 'Center Dial color (R/G/B/A):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinFaceCenterDialColor_ALabel, 0, faceCenterDialColorRow, 1, 1);

  let spinFaceCenterDialColor_R = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceCenterDialColor_R.set_sensitive(true);
  spinFaceCenterDialColor_R.set_range(0.0, 1.0);
  spinFaceCenterDialColor_R.set_value(this.settings.get_double('facecenterdialcolor-r'));
  spinFaceCenterDialColor_R.set_increments(0.01, 0.1);
  spinFaceCenterDialColor_R.connect('value-changed', w => {
      this.settings.set_double('facecenterdialcolor-r', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceCenterDialColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.red = w.get_value();
      Common.myDebugLog('spinFaceCenterDialColor_R changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceCenterDialColor_R, 1, faceCenterDialColorRow, 1, 1);

  let spinFaceCenterDialColor_G = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceCenterDialColor_G.set_sensitive(true);
  spinFaceCenterDialColor_G.set_range(0.0, 1.0);
  spinFaceCenterDialColor_G.set_value(this.settings.get_double('facecenterdialcolor-g'));
  spinFaceCenterDialColor_G.set_increments(0.01, 0.1);
  spinFaceCenterDialColor_G.connect('value-changed', w => {
      this.settings.set_double('facecenterdialcolor-g', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceCenterDialColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.green = w.get_value();
      Common.myDebugLog('spinFaceCenterDialColor_G changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceCenterDialColor_G, 2, faceCenterDialColorRow, 1, 1);

  let spinFaceCenterDialColor_B = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceCenterDialColor_B.set_sensitive(true);
  spinFaceCenterDialColor_B.set_range(0.0, 1.0);
  spinFaceCenterDialColor_B.set_value(this.settings.get_double('facecenterdialcolor-b'));
  spinFaceCenterDialColor_B.set_increments(0.01, 0.1);
  spinFaceCenterDialColor_B.connect('value-changed', w => {
      this.settings.set_double('facecenterdialcolor-b', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceCenterDialColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.blue = w.get_value();
      Common.myDebugLog('spinFaceCenterDialColor_B changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceCenterDialColor_B, 3, faceCenterDialColorRow, 1, 1);

  let spinFaceCenterDialColor_A = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceCenterDialColor_A.set_sensitive(true);
  spinFaceCenterDialColor_A.set_range(0.0, 1.0);
  spinFaceCenterDialColor_A.set_value(this.settings.get_double('facecenterdialcolor-a'));
  spinFaceCenterDialColor_A.set_increments(0.01, 0.1);
  spinFaceCenterDialColor_A.connect('value-changed', w => {
      this.settings.set_double('facecenterdialcolor-a', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceCenterDialColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.alpha = w.get_value();
      Common.myDebugLog('spinFaceCenterDialColor_A changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceCenterDialColor_A, 4, faceCenterDialColorRow, 1, 1);

  let buttonFaceCenterDialColor = new Gtk.ColorButton({halign: Gtk.Align.END});
  buttonFaceCenterDialColor.set_use_alpha(true);
  _colorSet = new Gdk.RGBA();
  _colorSet.red = this.settings.get_double('facecenterdialcolor-r');
  _colorSet.green = this.settings.get_double('facecenterdialcolor-g');
  _colorSet.blue = this.settings.get_double('facecenterdialcolor-b');
  _colorSet.alpha = this.settings.get_double('facecenterdialcolor-a');
  buttonFaceCenterDialColor.set_rgba(_colorSet);
  buttonFaceCenterDialColor.connect("color_set", () => {
    Common.myDebugLog('buttonFaceCenterDialColor.rgba       : ' + buttonFaceCenterDialColor.rgba.to_string());
    Common.myDebugLog('buttonFaceCenterDialColor.rgba.red   : ' + buttonFaceCenterDialColor.rgba.red);
    Common.myDebugLog('buttonFaceCenterDialColor.rgba.green : ' + buttonFaceCenterDialColor.rgba.green);
    Common.myDebugLog('buttonFaceCenterDialColor.rgba.blue  : ' + buttonFaceCenterDialColor.rgba.blue);
    Common.myDebugLog('buttonFaceCenterDialColor.rgba.alpha : ' + buttonFaceCenterDialColor.rgba.alpha);
    spinFaceCenterDialColor_R.set_value(buttonFaceCenterDialColor.rgba.red);
    spinFaceCenterDialColor_G.set_value(buttonFaceCenterDialColor.rgba.green);
    spinFaceCenterDialColor_B.set_value(buttonFaceCenterDialColor.rgba.blue);
    spinFaceCenterDialColor_A.set_value(buttonFaceCenterDialColor.rgba.alpha);
  });
  prefsWidget.attach(buttonFaceCenterDialColor, 5, faceCenterDialColorRow, 1, 1);

  // faceDialLineWidth = settings.get_double("facediallinewidth");
  // faceDialLineInset = settings.get_double("facediallineinset");
  // faceDialLineTickInset = settings.get_double("facediallinetickinset");
  // faceDialLineColor = {"R": settings.get_double("facediallinecolor-r"), "G": settings.get_double("facediallinecolor-g"), "B": settings.get_double("facediallinecolor-b"), "A": settings.get_double("facediallinecolor-a")};

  let faceDialLineRow = faceCenterDialColorRow +1;

  let faceDialLineLabel = new Gtk.Label({
    label: 'Dial Line (Width/Inset):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(faceDialLineLabel, 0, faceDialLineRow, 1, 1);

  let faceDialLineWidth = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  faceDialLineWidth.set_sensitive(true);
  faceDialLineWidth.set_range(0.0, 1.0);
  faceDialLineWidth.set_value(this.settings.get_double('facediallinewidth'));
  faceDialLineWidth.set_increments(0.01, 0.1);
  faceDialLineWidth.connect('value-changed', w => {
      this.settings.set_double('facediallinewidth', w.get_value());
  });
  prefsWidget.attach(faceDialLineWidth, 1, faceDialLineRow, 1, 1);

  let faceDialLineLength = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  faceDialLineLength.set_sensitive(true);
  faceDialLineLength.set_range(0.0, 1.0);
  faceDialLineLength.set_value(this.settings.get_double('facediallineinset'));
  faceDialLineLength.set_increments(0.01, 0.1);
  faceDialLineLength.connect('value-changed', w => {
      this.settings.set_double('facediallineinset', w.get_value());
  });
  prefsWidget.attach(faceDialLineLength, 2, faceDialLineRow, 1, 1);

  let faceDialLineTILabel = new Gtk.Label({
    label: 'Tick Inset:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(faceDialLineTILabel, 3, faceDialLineRow, 1, 1);

  let faceDialLineTI = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  faceDialLineTI.set_sensitive(true);
  faceDialLineTI.set_range(0.0, 1.0);
  faceDialLineTI.set_value(this.settings.get_double('facediallinetickinset'));
  faceDialLineTI.set_increments(0.01, 0.1);
  faceDialLineTI.connect('value-changed', w => {
      this.settings.set_double('facediallinetickinset', w.get_value());
  });
  prefsWidget.attach(faceDialLineTI, 4, faceDialLineRow, 1, 1);

  let faceDialLineColorRow = faceDialLineRow +1;

  let spinFaceDialLineColor_ALabel = new Gtk.Label({
    label: 'Dial Line color (R/G/B/A):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinFaceDialLineColor_ALabel, 0, faceDialLineColorRow, 1, 1);

  let spinFaceDialLineColor_R = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceDialLineColor_R.set_sensitive(true);
  spinFaceDialLineColor_R.set_range(0.0, 1.0);
  spinFaceDialLineColor_R.set_value(this.settings.get_double('facediallinecolor-r'));
  spinFaceDialLineColor_R.set_increments(0.01, 0.1);
  spinFaceDialLineColor_R.connect('value-changed', w => {
      this.settings.set_double('facediallinecolor-r', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceDialLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.red = w.get_value();
      Common.myDebugLog('spinFaceDialLineColor_R changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceDialLineColor_R, 1, faceDialLineColorRow, 1, 1);

  let spinFaceDialLineColor_G = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceDialLineColor_G.set_sensitive(true);
  spinFaceDialLineColor_G.set_range(0.0, 1.0);
  spinFaceDialLineColor_G.set_value(this.settings.get_double('facediallinecolor-g'));
  spinFaceDialLineColor_G.set_increments(0.01, 0.1);
  spinFaceDialLineColor_G.connect('value-changed', w => {
      this.settings.set_double('facediallinecolor-g', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceDialLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.green = w.get_value();
      Common.myDebugLog('spinFaceDialLineColor_G changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceDialLineColor_G, 2, faceDialLineColorRow, 1, 1);

  let spinFaceDialLineColor_B = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceDialLineColor_B.set_sensitive(true);
  spinFaceDialLineColor_B.set_range(0.0, 1.0);
  spinFaceDialLineColor_B.set_value(this.settings.get_double('facediallinecolor-b'));
  spinFaceDialLineColor_B.set_increments(0.01, 0.1);
  spinFaceDialLineColor_B.connect('value-changed', w => {
      this.settings.set_double('facediallinecolor-b', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceDialLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.blue = w.get_value();
      Common.myDebugLog('spinFaceDialLineColor_B changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceDialLineColor_B, 3, faceDialLineColorRow, 1, 1);

  let spinFaceDialLineColor_A = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceDialLineColor_A.set_sensitive(true);
  spinFaceDialLineColor_A.set_range(0.0, 1.0);
  spinFaceDialLineColor_A.set_value(this.settings.get_double('facediallinecolor-a'));
  spinFaceDialLineColor_A.set_increments(0.01, 0.1);
  spinFaceDialLineColor_A.connect('value-changed', w => {
      this.settings.set_double('facediallinecolor-a', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceDialLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.alpha = w.get_value();
      Common.myDebugLog('spinFaceDialLineColor_A changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceDialLineColor_A, 4, faceDialLineColorRow, 1, 1);

  let buttonFaceDialLineColor = new Gtk.ColorButton({halign: Gtk.Align.END});
  buttonFaceDialLineColor.set_use_alpha(true);
  _colorSet = new Gdk.RGBA();
  _colorSet.red = this.settings.get_double('facediallinecolor-r');
  _colorSet.green = this.settings.get_double('facediallinecolor-g');
  _colorSet.blue = this.settings.get_double('facediallinecolor-b');
  _colorSet.alpha = this.settings.get_double('facediallinecolor-a');
  buttonFaceDialLineColor.set_rgba(_colorSet);
  buttonFaceDialLineColor.connect("color_set", () => {
    Common.myDebugLog('buttonFaceDialLineColor.rgba       : ' + buttonFaceDialLineColor.rgba.to_string());
    Common.myDebugLog('buttonFaceDialLineColor.rgba.red   : ' + buttonFaceDialLineColor.rgba.red);
    Common.myDebugLog('buttonFaceDialLineColor.rgba.green : ' + buttonFaceDialLineColor.rgba.green);
    Common.myDebugLog('buttonFaceDialLineColor.rgba.blue  : ' + buttonFaceDialLineColor.rgba.blue);
    Common.myDebugLog('buttonFaceDialLineColor.rgba.alpha : ' + buttonFaceDialLineColor.rgba.alpha);
    spinFaceDialLineColor_R.set_value(buttonFaceDialLineColor.rgba.red);
    spinFaceDialLineColor_G.set_value(buttonFaceDialLineColor.rgba.green);
    spinFaceDialLineColor_B.set_value(buttonFaceDialLineColor.rgba.blue);
    spinFaceDialLineColor_A.set_value(buttonFaceDialLineColor.rgba.alpha);
  });
  prefsWidget.attach(buttonFaceDialLineColor, 5, faceDialLineColorRow, 1, 1);

  Common.myDebugLog('Exiting prefs.js buildFacePage()');
  return prefsWidget;
}

function buildTickPage () {
  Common.myDebugLog('Entering prefs.js buildTickPage()');

  let _colorSet;

  let prefsWidget = new Gtk.Grid({
    margin_start: 18,
    margin_end: 18,
    margin_top: 18,
    margin_bottom: 18,
    column_spacing: 12,
    row_spacing: 12,
    visible: true
  });

  // Title...

  let title = new Gtk.Label({
    label: `<b>${Me.metadata.name} (V.${Me.metadata.version}) - Ticks</b>`,
    halign: Gtk.Align.START,
    use_markup: true,
    visible: true
  });
  prefsWidget.attach(title, 0, 0, 2, 1);

  // faceMinuteTickLineWidth = settings.get_double("faceminuteticklinewidth");
  // faceMinuteTickLineInset = settings.get_double("faceminuteticklineinset");
  // faceMinuteTickColor = {"R": settings.get_double("faceminutetickcolor-r"), "G": settings.get_double("faceminutetickcolor-g"), "B": settings.get_double("faceminutetickcolor-b"), "A": settings.get_double("faceminutetickcolor-a")};

  let faceMinuteTickLineRow = 1;

  let faceMinuteTickLineLabel = new Gtk.Label({
    label: 'Minute Tick (Width/Inset):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(faceMinuteTickLineLabel, 0, faceMinuteTickLineRow, 1, 1);

  let faceMinuteTickLineWidth = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  faceMinuteTickLineWidth.set_sensitive(true);
  faceMinuteTickLineWidth.set_range(0.0, 1.0);
  faceMinuteTickLineWidth.set_value(this.settings.get_double('faceminuteticklinewidth'));
  faceMinuteTickLineWidth.set_increments(0.01, 0.1);
  faceMinuteTickLineWidth.connect('value-changed', w => {
      this.settings.set_double('faceminuteticklinewidth', w.get_value());
  });
  prefsWidget.attach(faceMinuteTickLineWidth, 1, faceMinuteTickLineRow, 1, 1);

  let faceMinuteTickLineLength = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  faceMinuteTickLineLength.set_sensitive(true);
  faceMinuteTickLineLength.set_range(0.0, 1.0);
  faceMinuteTickLineLength.set_value(this.settings.get_double('faceminuteticklineinset'));
  faceMinuteTickLineLength.set_increments(0.01, 0.1);
  faceMinuteTickLineLength.connect('value-changed', w => {
      this.settings.set_double('faceminuteticklineinset', w.get_value());
  });
  prefsWidget.attach(faceMinuteTickLineLength, 2, faceMinuteTickLineRow, 1, 1);

  let toggleMinuteTickLineCircleLabel = new Gtk.Label({
    label: 'Circle (Inner/Outer):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(toggleMinuteTickLineCircleLabel, 3, faceMinuteTickLineRow, 2, 1);

  let toggleMinuteTickLineCircle = new Gtk.Switch({
    active: this.settings.get_boolean("faceminutetickcircle"),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggleMinuteTickLineCircle, 4, faceMinuteTickLineRow, 1, 1);

  this.settings.bind(
    'faceminutetickcircle',
    toggleMinuteTickLineCircle,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  let toggleMinuteTickLineOuterCircle = new Gtk.Switch({
    active: this.settings.get_boolean("faceminutetickoutercircle"),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggleMinuteTickLineOuterCircle, 5, faceMinuteTickLineRow, 1, 1);

  this.settings.bind(
    'faceminutetickoutercircle',
    toggleMinuteTickLineOuterCircle,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  let faceMinuteTickLineColorRow = faceMinuteTickLineRow +1;

  let spinFaceMinuteTickLineColor_ALabel = new Gtk.Label({
    label: 'Minute Tick color (R/G/B/A):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinFaceMinuteTickLineColor_ALabel, 0, faceMinuteTickLineColorRow, 1, 1);

  let spinFaceMinuteTickLineColor_R = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceMinuteTickLineColor_R.set_sensitive(true);
  spinFaceMinuteTickLineColor_R.set_range(0.0, 1.0);
  spinFaceMinuteTickLineColor_R.set_value(this.settings.get_double('faceminutetickcolor-r'));
  spinFaceMinuteTickLineColor_R.set_increments(0.01, 0.1);
  spinFaceMinuteTickLineColor_R.connect('value-changed', w => {
      this.settings.set_double('faceminutetickcolor-r', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceMinuteTickLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.red = w.get_value();
      Common.myDebugLog('spinFaceMinuteTickLineColor_R changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceMinuteTickLineColor_R, 1, faceMinuteTickLineColorRow, 1, 1);

  let spinFaceMinuteTickLineColor_G = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceMinuteTickLineColor_G.set_sensitive(true);
  spinFaceMinuteTickLineColor_G.set_range(0.0, 1.0);
  spinFaceMinuteTickLineColor_G.set_value(this.settings.get_double('faceminutetickcolor-g'));
  spinFaceMinuteTickLineColor_G.set_increments(0.01, 0.1);
  spinFaceMinuteTickLineColor_G.connect('value-changed', w => {
      this.settings.set_double('faceminutetickcolor-g', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceMinuteTickLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.green = w.get_value();
      Common.myDebugLog('spinFaceMinuteTickLineColor_G changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceMinuteTickLineColor_G, 2, faceMinuteTickLineColorRow, 1, 1);

  let spinFaceMinuteTickLineColor_B = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceMinuteTickLineColor_B.set_sensitive(true);
  spinFaceMinuteTickLineColor_B.set_range(0.0, 1.0);
  spinFaceMinuteTickLineColor_B.set_value(this.settings.get_double('faceminutetickcolor-b'));
  spinFaceMinuteTickLineColor_B.set_increments(0.01, 0.1);
  spinFaceMinuteTickLineColor_B.connect('value-changed', w => {
      this.settings.set_double('faceminutetickcolor-b', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceMinuteTickLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.blue = w.get_value();
      Common.myDebugLog('spinFaceMinuteTickLineColor_B changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceMinuteTickLineColor_B, 3, faceMinuteTickLineColorRow, 1, 1);

  let spinFaceMinuteTickLineColor_A = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceMinuteTickLineColor_A.set_sensitive(true);
  spinFaceMinuteTickLineColor_A.set_range(0.0, 1.0);
  spinFaceMinuteTickLineColor_A.set_value(this.settings.get_double('faceminutetickcolor-a'));
  spinFaceMinuteTickLineColor_A.set_increments(0.01, 0.1);
  spinFaceMinuteTickLineColor_A.connect('value-changed', w => {
      this.settings.set_double('faceminutetickcolor-a', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceMinuteTickLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.alpha = w.get_value();
      Common.myDebugLog('spinFaceMinuteTickLineColor_A changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceMinuteTickLineColor_A, 4, faceMinuteTickLineColorRow, 1, 1);
  
  let buttonFaceMinuteTickLineColor = new Gtk.ColorButton({halign: Gtk.Align.END});
  buttonFaceMinuteTickLineColor.set_use_alpha(true);
  _colorSet = new Gdk.RGBA();
  _colorSet.red = this.settings.get_double('faceminutetickcolor-r');
  _colorSet.green = this.settings.get_double('faceminutetickcolor-g');
  _colorSet.blue = this.settings.get_double('faceminutetickcolor-b');
  _colorSet.alpha = this.settings.get_double('faceminutetickcolor-a');
  buttonFaceMinuteTickLineColor.set_rgba(_colorSet);
  buttonFaceMinuteTickLineColor.connect("color_set", () => {
    Common.myDebugLog('buttonFaceMinuteTickLineColor.rgba       : ' + buttonFaceMinuteTickLineColor.rgba.to_string());
    Common.myDebugLog('buttonFaceMinuteTickLineColor.rgba.red   : ' + buttonFaceMinuteTickLineColor.rgba.red);
    Common.myDebugLog('buttonFaceMinuteTickLineColor.rgba.green : ' + buttonFaceMinuteTickLineColor.rgba.green);
    Common.myDebugLog('buttonFaceMinuteTickLineColor.rgba.blue  : ' + buttonFaceMinuteTickLineColor.rgba.blue);
    Common.myDebugLog('buttonFaceMinuteTickLineColor.rgba.alpha : ' + buttonFaceMinuteTickLineColor.rgba.alpha);
    spinFaceMinuteTickLineColor_R.set_value(buttonFaceMinuteTickLineColor.rgba.red);
    spinFaceMinuteTickLineColor_G.set_value(buttonFaceMinuteTickLineColor.rgba.green);
    spinFaceMinuteTickLineColor_B.set_value(buttonFaceMinuteTickLineColor.rgba.blue);
    spinFaceMinuteTickLineColor_A.set_value(buttonFaceMinuteTickLineColor.rgba.alpha);
  });
  prefsWidget.attach(buttonFaceMinuteTickLineColor, 5, faceMinuteTickLineColorRow, 1, 1);
  
  // faceTickLineWidth = settings.get_double("faceticklinewidth");
  // faceTickLineInset = settings.get_double("faceticklineinset");
  // faceTickColor = {"R": settings.get_double("facetickcolor-r"), "G": settings.get_double("facetickcolor-g"), "B": settings.get_double("facetickcolor-b"), "A": settings.get_double("facetickcolor-a")};

  let faceTickLineRow = faceMinuteTickLineColorRow +1;

  let faceTickLineLabel = new Gtk.Label({
    label: '5/* Tick (Width/Inset):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(faceTickLineLabel, 0, faceTickLineRow, 1, 1);

  let faceTickLineWidth = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  faceTickLineWidth.set_sensitive(true);
  faceTickLineWidth.set_range(0.0, 1.0);
  faceTickLineWidth.set_value(this.settings.get_double('faceticklinewidth'));
  faceTickLineWidth.set_increments(0.01, 0.1);
  faceTickLineWidth.connect('value-changed', w => {
      this.settings.set_double('faceticklinewidth', w.get_value());
  });
  prefsWidget.attach(faceTickLineWidth, 1, faceTickLineRow, 1, 1);

  let faceTickLineLength = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  faceTickLineLength.set_sensitive(true);
  faceTickLineLength.set_range(0.0, 1.0);
  faceTickLineLength.set_value(this.settings.get_double('faceticklineinset'));
  faceTickLineLength.set_increments(0.01, 0.1);
  faceTickLineLength.connect('value-changed', w => {
      this.settings.set_double('faceticklineinset', w.get_value());
  });
  prefsWidget.attach(faceTickLineLength, 2, faceTickLineRow, 1, 1);

  let toggleTickLineCircleLabel = new Gtk.Label({
    label: 'Circle (Inner/Outer):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(toggleTickLineCircleLabel, 3, faceTickLineRow, 2, 1);

  let toggleTickLineCircle = new Gtk.Switch({
    active: this.settings.get_boolean("facetickcircle"),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggleTickLineCircle, 4, faceTickLineRow, 1, 1);

  this.settings.bind(
    'facetickcircle',
    toggleTickLineCircle,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  let toggleTickLineOuterCircle = new Gtk.Switch({
    active: this.settings.get_boolean("facetickoutercircle"),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggleTickLineOuterCircle, 5, faceTickLineRow, 1, 1);

  this.settings.bind(
    'facetickoutercircle',
    toggleTickLineOuterCircle,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  let faceTickLineColorRow = faceTickLineRow +1;

  let spinFaceTickLineColor_ALabel = new Gtk.Label({
    label: '5/* Tick color (R/G/B/A):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinFaceTickLineColor_ALabel, 0, faceTickLineColorRow, 1, 1);

  let spinFaceTickLineColor_R = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceTickLineColor_R.set_sensitive(true);
  spinFaceTickLineColor_R.set_range(0.0, 1.0);
  spinFaceTickLineColor_R.set_value(this.settings.get_double('facetickcolor-r'));
  spinFaceTickLineColor_R.set_increments(0.01, 0.1);
  spinFaceTickLineColor_R.connect('value-changed', w => {
      this.settings.set_double('facetickcolor-r', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceTickLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.red = w.get_value();
      Common.myDebugLog('spinFaceTickLineColor_R changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceTickLineColor_R, 1, faceTickLineColorRow, 1, 1);

  let spinFaceTickLineColor_G = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceTickLineColor_G.set_sensitive(true);
  spinFaceTickLineColor_G.set_range(0.0, 1.0);
  spinFaceTickLineColor_G.set_value(this.settings.get_double('facetickcolor-g'));
  spinFaceTickLineColor_G.set_increments(0.01, 0.1);
  spinFaceTickLineColor_G.connect('value-changed', w => {
      this.settings.set_double('facetickcolor-g', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceTickLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.green = w.get_value();
      Common.myDebugLog('spinFaceTickLineColor_G changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceTickLineColor_G, 2, faceTickLineColorRow, 1, 1);

  let spinFaceTickLineColor_B = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceTickLineColor_B.set_sensitive(true);
  spinFaceTickLineColor_B.set_range(0.0, 1.0);
  spinFaceTickLineColor_B.set_value(this.settings.get_double('facetickcolor-b'));
  spinFaceTickLineColor_B.set_increments(0.01, 0.1);
  spinFaceTickLineColor_B.connect('value-changed', w => {
      this.settings.set_double('facetickcolor-b', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceTickLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.blue = w.get_value();
      Common.myDebugLog('spinFaceTickLineColor_B changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceTickLineColor_B, 3, faceTickLineColorRow, 1, 1);

  let spinFaceTickLineColor_A = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceTickLineColor_A.set_sensitive(true);
  spinFaceTickLineColor_A.set_range(0.0, 1.0);
  spinFaceTickLineColor_A.set_value(this.settings.get_double('facetickcolor-a'));
  spinFaceTickLineColor_A.set_increments(0.01, 0.1);
  spinFaceTickLineColor_A.connect('value-changed', w => {
      this.settings.set_double('facetickcolor-a', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceTickLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.alpha = w.get_value();
      Common.myDebugLog('spinFaceTickLineColor_A changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceTickLineColor_A, 4, faceTickLineColorRow, 1, 1);

  let buttonFaceTickLineColor = new Gtk.ColorButton({halign: Gtk.Align.END});
  buttonFaceTickLineColor.set_use_alpha(true);
  _colorSet = new Gdk.RGBA();
  _colorSet.red = this.settings.get_double('facetickcolor-r');
  _colorSet.green = this.settings.get_double('facetickcolor-g');
  _colorSet.blue = this.settings.get_double('facetickcolor-b');
  _colorSet.alpha = this.settings.get_double('facetickcolor-a');
  buttonFaceTickLineColor.set_rgba(_colorSet);
  buttonFaceTickLineColor.connect("color_set", () => {
    Common.myDebugLog('buttonFaceTickLineColor.rgba       : ' + buttonFaceTickLineColor.rgba.to_string());
    Common.myDebugLog('buttonFaceTickLineColor.rgba.red   : ' + buttonFaceTickLineColor.rgba.red);
    Common.myDebugLog('buttonFaceTickLineColor.rgba.green : ' + buttonFaceTickLineColor.rgba.green);
    Common.myDebugLog('buttonFaceTickLineColor.rgba.blue  : ' + buttonFaceTickLineColor.rgba.blue);
    Common.myDebugLog('buttonFaceTickLineColor.rgba.alpha : ' + buttonFaceTickLineColor.rgba.alpha);
    spinFaceTickLineColor_R.set_value(buttonFaceTickLineColor.rgba.red);
    spinFaceTickLineColor_G.set_value(buttonFaceTickLineColor.rgba.green);
    spinFaceTickLineColor_B.set_value(buttonFaceTickLineColor.rgba.blue);
    spinFaceTickLineColor_A.set_value(buttonFaceTickLineColor.rgba.alpha);
  });
  prefsWidget.attach(buttonFaceTickLineColor, 5, faceTickLineColorRow, 1, 1);

  // faceProminentTickLineWidth = settings.get_double("faceprominentticklinewidth");
  // faceProminentTickLineInset = settings.get_double("faceprominentticklineinset");
  // faceProminentTickColor = {"R": settings.get_double("faceprominenttickcolor-r"), "G": settings.get_double("faceprominenttickcolor-g"), "B": settings.get_double("faceprominenttickcolor-b"), "A": settings.get_double("faceprominenttickcolor-a")};

  let faceProminentTickLineRow = faceTickLineColorRow +1;

  let faceProminentTickLineLabel = new Gtk.Label({
    label: '1/4 Tick (Width/Inset):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(faceProminentTickLineLabel, 0, faceProminentTickLineRow, 1, 1);

  let faceProminentTickLineWidth = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  faceProminentTickLineWidth.set_sensitive(true);
  faceProminentTickLineWidth.set_range(0.0, 1.0);
  faceProminentTickLineWidth.set_value(this.settings.get_double('faceprominentticklinewidth'));
  faceProminentTickLineWidth.set_increments(0.01, 0.1);
  faceProminentTickLineWidth.connect('value-changed', w => {
      this.settings.set_double('faceprominentticklinewidth', w.get_value());
  });
  prefsWidget.attach(faceProminentTickLineWidth, 1, faceProminentTickLineRow, 1, 1);

  let faceProminentTickLineLength = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  faceProminentTickLineLength.set_sensitive(true);
  faceProminentTickLineLength.set_range(0.0, 1.0);
  faceProminentTickLineLength.set_value(this.settings.get_double('faceprominentticklineinset'));
  faceProminentTickLineLength.set_increments(0.01, 0.1);
  faceProminentTickLineLength.connect('value-changed', w => {
      this.settings.set_double('faceprominentticklineinset', w.get_value());
  });
  prefsWidget.attach(faceProminentTickLineLength, 2, faceProminentTickLineRow, 1, 1);

  let toggleProminentTickLineCircleLabel = new Gtk.Label({
    label: 'Circle (Inner/Outer):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(toggleProminentTickLineCircleLabel, 3, faceProminentTickLineRow, 2, 1);

  let toggleProminentTickLineCircle = new Gtk.Switch({
    active: this.settings.get_boolean("faceprominenttickcircle"),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggleProminentTickLineCircle, 4, faceProminentTickLineRow, 1, 1);

  this.settings.bind(
    'faceprominenttickcircle',
    toggleProminentTickLineCircle,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  let toggleProminentTickLineOuterCircle = new Gtk.Switch({
    active: this.settings.get_boolean("faceprominenttickoutercircle"),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggleProminentTickLineOuterCircle, 5, faceProminentTickLineRow, 1, 1);

  this.settings.bind(
    'faceprominenttickoutercircle',
    toggleProminentTickLineOuterCircle,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  let faceProminentTickLineColorRow = faceProminentTickLineRow +1;

  let spinFaceProminentTickLineColor_ALabel = new Gtk.Label({
    label: '1/4 Tick color (R/G/B/A):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinFaceProminentTickLineColor_ALabel, 0, faceProminentTickLineColorRow, 1, 1);

  let spinFaceProminentTickLineColor_R = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceProminentTickLineColor_R.set_sensitive(true);
  spinFaceProminentTickLineColor_R.set_range(0.0, 1.0);
  spinFaceProminentTickLineColor_R.set_value(this.settings.get_double('faceprominenttickcolor-r'));
  spinFaceProminentTickLineColor_R.set_increments(0.01, 0.1);
  spinFaceProminentTickLineColor_R.connect('value-changed', w => {
      this.settings.set_double('faceprominenttickcolor-r', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceProminentTickLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.red = w.get_value();
      Common.myDebugLog('spinFaceProminentTickLineColor_R changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceProminentTickLineColor_R, 1, faceProminentTickLineColorRow, 1, 1);

  let spinFaceProminentTickLineColor_G = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceProminentTickLineColor_G.set_sensitive(true);
  spinFaceProminentTickLineColor_G.set_range(0.0, 1.0);
  spinFaceProminentTickLineColor_G.set_value(this.settings.get_double('faceprominenttickcolor-g'));
  spinFaceProminentTickLineColor_G.set_increments(0.01, 0.1);
  spinFaceProminentTickLineColor_G.connect('value-changed', w => {
      this.settings.set_double('faceprominenttickcolor-g', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceProminentTickLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.green = w.get_value();
      Common.myDebugLog('spinFaceProminentTickLineColor_G changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceProminentTickLineColor_G, 2, faceProminentTickLineColorRow, 1, 1);

  let spinFaceProminentTickLineColor_B = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceProminentTickLineColor_B.set_sensitive(true);
  spinFaceProminentTickLineColor_B.set_range(0.0, 1.0);
  spinFaceProminentTickLineColor_B.set_value(this.settings.get_double('faceprominenttickcolor-b'));
  spinFaceProminentTickLineColor_B.set_increments(0.01, 0.1);
  spinFaceProminentTickLineColor_B.connect('value-changed', w => {
      this.settings.set_double('faceprominenttickcolor-b', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceProminentTickLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.blue = w.get_value();
      Common.myDebugLog('spinFaceProminentTickLineColor_B changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceProminentTickLineColor_B, 3, faceProminentTickLineColorRow, 1, 1);

  let spinFaceProminentTickLineColor_A = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceProminentTickLineColor_A.set_sensitive(true);
  spinFaceProminentTickLineColor_A.set_range(0.0, 1.0);
  spinFaceProminentTickLineColor_A.set_value(this.settings.get_double('faceprominenttickcolor-a'));
  spinFaceProminentTickLineColor_A.set_increments(0.01, 0.1);
  spinFaceProminentTickLineColor_A.connect('value-changed', w => {
      this.settings.set_double('faceprominenttickcolor-a', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceProminentTickLineColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.alpha = w.get_value();
      Common.myDebugLog('spinFaceProminentTickLineColor_A changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceProminentTickLineColor_A, 4, faceProminentTickLineColorRow, 1, 1);

  let buttonFaceProminentTickLineColor = new Gtk.ColorButton({halign: Gtk.Align.END});
  buttonFaceProminentTickLineColor.set_use_alpha(true);
  _colorSet = new Gdk.RGBA();
  _colorSet.red = this.settings.get_double('faceprominenttickcolor-r');
  _colorSet.green = this.settings.get_double('faceprominenttickcolor-g');
  _colorSet.blue = this.settings.get_double('faceprominenttickcolor-b');
  _colorSet.alpha = this.settings.get_double('faceprominenttickcolor-a');
  buttonFaceProminentTickLineColor.set_rgba(_colorSet);
  buttonFaceProminentTickLineColor.connect("color_set", () => {
    Common.myDebugLog('buttonFaceProminentTickLineColor.rgba       : ' + buttonFaceProminentTickLineColor.rgba.to_string());
    Common.myDebugLog('buttonFaceProminentTickLineColor.rgba.red   : ' + buttonFaceProminentTickLineColor.rgba.red);
    Common.myDebugLog('buttonFaceProminentTickLineColor.rgba.green : ' + buttonFaceProminentTickLineColor.rgba.green);
    Common.myDebugLog('buttonFaceProminentTickLineColor.rgba.blue  : ' + buttonFaceProminentTickLineColor.rgba.blue);
    Common.myDebugLog('buttonFaceProminentTickLineColor.rgba.alpha : ' + buttonFaceProminentTickLineColor.rgba.alpha);
    spinFaceProminentTickLineColor_R.set_value(buttonFaceProminentTickLineColor.rgba.red);
    spinFaceProminentTickLineColor_G.set_value(buttonFaceProminentTickLineColor.rgba.green);
    spinFaceProminentTickLineColor_B.set_value(buttonFaceProminentTickLineColor.rgba.blue);
    spinFaceProminentTickLineColor_A.set_value(buttonFaceProminentTickLineColor.rgba.alpha);
  });
  prefsWidget.attach(buttonFaceProminentTickLineColor, 5, faceProminentTickLineColorRow, 1, 1);

  Common.myDebugLog('Exiting prefs.js buildTickPage()');
  return prefsWidget;
}

function buildHandPage () {
  Common.myDebugLog('Entering prefs.js buildHandPage()');

  let _colorSet;

  let prefsWidget = new Gtk.Grid({
    margin_start: 18,
    margin_end: 18,
    margin_top: 18,
    margin_bottom: 18,
    column_spacing: 12,
    row_spacing: 12,
    visible: true
  });

  // Title...

  let title = new Gtk.Label({
    label: `<b>${Me.metadata.name} (V.${Me.metadata.version}) - Hands</b>`,
    halign: Gtk.Align.START,
    use_markup: true,
    visible: true
  });
  prefsWidget.attach(title, 0, 0, 2, 1);

  // faceHourHandLineWidth = settings.get_double("facehourhandlinewidth");
  // faceHourHandLineLength = settings.get_double("facehourhandlinelength");
  // faceHourHandColor = {"R": settings.get_double("facehourhandcolor-r"), "G": settings.get_double("facehourhandcolor-g"), "B": settings.get_double("facehourhandcolor-b"), "A": settings.get_double("facehourhandcolor-a")};
  // faceHourHandFilled = settings.get_boolean("facehourhandfilled");

  let hourHandLineRow = 1;

  let hourHandLineLabel = new Gtk.Label({
    label: 'Hour Hand (Width/Length):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(hourHandLineLabel, 0, hourHandLineRow, 1, 1);

  let hourHandLineWidth = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  hourHandLineWidth.set_sensitive(true);
  hourHandLineWidth.set_range(0.0, 1.0);
  hourHandLineWidth.set_value(this.settings.get_double('facehourhandlinewidth'));
  hourHandLineWidth.set_increments(0.01, 0.1);
  hourHandLineWidth.connect('value-changed', w => {
      this.settings.set_double('facehourhandlinewidth', w.get_value());
  });
  prefsWidget.attach(hourHandLineWidth, 1, hourHandLineRow, 1, 1);

  let hourHandLineLength = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  hourHandLineLength.set_sensitive(true);
  hourHandLineLength.set_range(0.0, 1.0);
  hourHandLineLength.set_value(this.settings.get_double('facehourhandlinelength'));
  hourHandLineLength.set_increments(0.01, 0.1);
  hourHandLineLength.connect('value-changed', w => {
      this.settings.set_double('facehourhandlinelength', w.get_value());
  });
  prefsWidget.attach(hourHandLineLength, 2, hourHandLineRow, 1, 1);

  let faceHourHandColorRow = hourHandLineRow +1;

  let spinFaceHourHandColor_ALabel = new Gtk.Label({
    label: 'Hour Hand color (R/G/B/A):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinFaceHourHandColor_ALabel, 0, faceHourHandColorRow, 1, 1);

  let spinFaceHourHandColor_R = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceHourHandColor_R.set_sensitive(true);
  spinFaceHourHandColor_R.set_range(0.0, 1.0);
  spinFaceHourHandColor_R.set_value(this.settings.get_double('facehourhandcolor-r'));
  spinFaceHourHandColor_R.set_increments(0.01, 0.1);
  spinFaceHourHandColor_R.connect('value-changed', w => {
      this.settings.set_double('facehourhandcolor-r', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceHourHandColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.red = w.get_value();
      Common.myDebugLog('spinFaceHourHandColor_R changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceHourHandColor_R, 1, faceHourHandColorRow, 1, 1);

  let spinFaceHourHandColor_G = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceHourHandColor_G.set_sensitive(true);
  spinFaceHourHandColor_G.set_range(0.0, 1.0);
  spinFaceHourHandColor_G.set_value(this.settings.get_double('facehourhandcolor-g'));
  spinFaceHourHandColor_G.set_increments(0.01, 0.1);
  spinFaceHourHandColor_G.connect('value-changed', w => {
      this.settings.set_double('facehourhandcolor-g', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceHourHandColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.green = w.get_value();
      Common.myDebugLog('spinFaceHourHandColor_G changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceHourHandColor_G, 2, faceHourHandColorRow, 1, 1);

  let spinFaceHourHandColor_B = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceHourHandColor_B.set_sensitive(true);
  spinFaceHourHandColor_B.set_range(0.0, 1.0);
  spinFaceHourHandColor_B.set_value(this.settings.get_double('facehourhandcolor-b'));
  spinFaceHourHandColor_B.set_increments(0.01, 0.1);
  spinFaceHourHandColor_B.connect('value-changed', w => {
      this.settings.set_double('facehourhandcolor-b', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceHourHandColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.blue = w.get_value();
      Common.myDebugLog('spinFaceHourHandColor_B changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceHourHandColor_B, 3, faceHourHandColorRow, 1, 1);

  let spinFaceHourHandColor_A = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceHourHandColor_A.set_sensitive(true);
  spinFaceHourHandColor_A.set_range(0.0, 1.0);
  spinFaceHourHandColor_A.set_value(this.settings.get_double('facehourhandcolor-a'));
  spinFaceHourHandColor_A.set_increments(0.01, 0.1);
  spinFaceHourHandColor_A.connect('value-changed', w => {
      this.settings.set_double('facehourhandcolor-a', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceHourHandColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.alpha = w.get_value();
      Common.myDebugLog('spinFaceHourHandColor_A changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceHourHandColor_A, 4, faceHourHandColorRow, 1, 1);

  let buttonFaceHourHandColor = new Gtk.ColorButton({halign: Gtk.Align.END});
  buttonFaceHourHandColor.set_use_alpha(true);
  _colorSet = new Gdk.RGBA();
  _colorSet.red = this.settings.get_double('facehourhandcolor-r');
  _colorSet.green = this.settings.get_double('facehourhandcolor-g');
  _colorSet.blue = this.settings.get_double('facehourhandcolor-b');
  _colorSet.alpha = this.settings.get_double('facehourhandcolor-a');
  buttonFaceHourHandColor.set_rgba(_colorSet);
  buttonFaceHourHandColor.connect("color_set", () => {
    Common.myDebugLog('buttonFaceHourHandColor.rgba       : ' + buttonFaceHourHandColor.rgba.to_string());
    Common.myDebugLog('buttonFaceHourHandColor.rgba.red   : ' + buttonFaceHourHandColor.rgba.red);
    Common.myDebugLog('buttonFaceHourHandColor.rgba.green : ' + buttonFaceHourHandColor.rgba.green);
    Common.myDebugLog('buttonFaceHourHandColor.rgba.blue  : ' + buttonFaceHourHandColor.rgba.blue);
    Common.myDebugLog('buttonFaceHourHandColor.rgba.alpha : ' + buttonFaceHourHandColor.rgba.alpha);
    spinFaceHourHandColor_R.set_value(buttonFaceHourHandColor.rgba.red);
    spinFaceHourHandColor_G.set_value(buttonFaceHourHandColor.rgba.green);
    spinFaceHourHandColor_B.set_value(buttonFaceHourHandColor.rgba.blue);
    spinFaceHourHandColor_A.set_value(buttonFaceHourHandColor.rgba.alpha);
  });
  prefsWidget.attach(buttonFaceHourHandColor, 5, faceHourHandColorRow, 1, 1);

  let hourHandFilledToggleRow = hourHandLineRow;

  let toggleHourHandFilledLabel = new Gtk.Label({
    label: 'Filled:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(toggleHourHandFilledLabel, 3, hourHandFilledToggleRow, 1, 1);

  let toggleHourHandFilled = new Gtk.Switch({
    active: this.settings.get_boolean("facehourhandfilled"),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggleHourHandFilled, 4, hourHandFilledToggleRow, 1, 1);

  this.settings.bind(
    'facehourhandfilled',
    toggleHourHandFilled,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  // faceMinuteHandLineWidth = settings.get_double("faceminutehandlinewidth");
  // faceMinuteHandLineLength = settings.get_double("faceminutehandlinelength");
  // faceMinuteHandColor = {"R": settings.get_double("faceminutehandcolor-r"), "G": settings.get_double("faceminutehandcolor-g"), "B": settings.get_double("faceminutehandcolor-b"), "A": settings.get_double("faceminutehandcolor-a")};
  // faceMinuteHandFilled = settings.get_boolean("faceminutehandfilled");

  let minuteHandLineRow = faceHourHandColorRow +1;

  let minuteHandLineLabel = new Gtk.Label({
    label: 'Minute Hand (Width/Length):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(minuteHandLineLabel, 0, minuteHandLineRow, 1, 1);

  let minuteHandLineWidth = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  minuteHandLineWidth.set_sensitive(true);
  minuteHandLineWidth.set_range(0.0, 1.0);
  minuteHandLineWidth.set_value(this.settings.get_double('faceminutehandlinewidth'));
  minuteHandLineWidth.set_increments(0.01, 0.1);
  minuteHandLineWidth.connect('value-changed', w => {
      this.settings.set_double('faceminutehandlinewidth', w.get_value());
  });
  prefsWidget.attach(minuteHandLineWidth, 1, minuteHandLineRow, 1, 1);

  let minuteHandLineLength = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  minuteHandLineLength.set_sensitive(true);
  minuteHandLineLength.set_range(0.0, 1.0);
  minuteHandLineLength.set_value(this.settings.get_double('faceminutehandlinelength'));
  minuteHandLineLength.set_increments(0.01, 0.1);
  minuteHandLineLength.connect('value-changed', w => {
      this.settings.set_double('faceminutehandlinelength', w.get_value());
  });
  prefsWidget.attach(minuteHandLineLength, 2, minuteHandLineRow, 1, 1);

  let faceMinuteHandColorRow = minuteHandLineRow +1;

  let spinFaceMinuteHandColor_ALabel = new Gtk.Label({
    label: 'Minute Hand color (R/G/B/A):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinFaceMinuteHandColor_ALabel, 0, faceMinuteHandColorRow, 1, 1);

  let spinFaceMinuteHandColor_R = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceMinuteHandColor_R.set_sensitive(true);
  spinFaceMinuteHandColor_R.set_range(0.0, 1.0);
  spinFaceMinuteHandColor_R.set_value(this.settings.get_double('faceminutehandcolor-r'));
  spinFaceMinuteHandColor_R.set_increments(0.01, 0.1);
  spinFaceMinuteHandColor_R.connect('value-changed', w => {
      this.settings.set_double('faceminutehandcolor-r', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceMinuteHandColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.red = w.get_value();
      Common.myDebugLog('spinFaceMinuteHandColor_R changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceMinuteHandColor_R, 1, faceMinuteHandColorRow, 1, 1);

  let spinFaceMinuteHandColor_G = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceMinuteHandColor_G.set_sensitive(true);
  spinFaceMinuteHandColor_G.set_range(0.0, 1.0);
  spinFaceMinuteHandColor_G.set_value(this.settings.get_double('faceminutehandcolor-g'));
  spinFaceMinuteHandColor_G.set_increments(0.01, 0.1);
  spinFaceMinuteHandColor_G.connect('value-changed', w => {
      this.settings.set_double('faceminutehandcolor-g', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceMinuteHandColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.green = w.get_value();
      Common.myDebugLog('spinFaceMinuteHandColor_G changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceMinuteHandColor_G, 2, faceMinuteHandColorRow, 1, 1);

  let spinFaceMinuteHandColor_B = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceMinuteHandColor_B.set_sensitive(true);
  spinFaceMinuteHandColor_B.set_range(0.0, 1.0);
  spinFaceMinuteHandColor_B.set_value(this.settings.get_double('faceminutehandcolor-b'));
  spinFaceMinuteHandColor_B.set_increments(0.01, 0.1);
  spinFaceMinuteHandColor_B.connect('value-changed', w => {
      this.settings.set_double('faceminutehandcolor-b', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceMinuteHandColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.blue = w.get_value();
      Common.myDebugLog('spinFaceMinuteHandColor_B changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceMinuteHandColor_B, 3, faceMinuteHandColorRow, 1, 1);

  let spinFaceMinuteHandColor_A = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceMinuteHandColor_A.set_sensitive(true);
  spinFaceMinuteHandColor_A.set_range(0.0, 1.0);
  spinFaceMinuteHandColor_A.set_value(this.settings.get_double('faceminutehandcolor-a'));
  spinFaceMinuteHandColor_A.set_increments(0.01, 0.1);
  spinFaceMinuteHandColor_A.connect('value-changed', w => {
      this.settings.set_double('faceminutehandcolor-a', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceMinuteHandColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.alpha = w.get_value();
      Common.myDebugLog('spinFaceMinuteHandColor_A changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceMinuteHandColor_A, 4, faceMinuteHandColorRow, 1, 1);

  let buttonFaceMinuteHandColor = new Gtk.ColorButton({halign: Gtk.Align.END});
  buttonFaceMinuteHandColor.set_use_alpha(true);
  _colorSet = new Gdk.RGBA();
  _colorSet.red = this.settings.get_double('faceminutehandcolor-r');
  _colorSet.green = this.settings.get_double('faceminutehandcolor-g');
  _colorSet.blue = this.settings.get_double('faceminutehandcolor-b');
  _colorSet.alpha = this.settings.get_double('faceminutehandcolor-a');
  buttonFaceMinuteHandColor.set_rgba(_colorSet);
  buttonFaceMinuteHandColor.connect("color_set", () => {
    Common.myDebugLog('buttonFaceMinuteHandColor.rgba       : ' + buttonFaceMinuteHandColor.rgba.to_string());
    Common.myDebugLog('buttonFaceMinuteHandColor.rgba.red   : ' + buttonFaceMinuteHandColor.rgba.red);
    Common.myDebugLog('buttonFaceMinuteHandColor.rgba.green : ' + buttonFaceMinuteHandColor.rgba.green);
    Common.myDebugLog('buttonFaceMinuteHandColor.rgba.blue  : ' + buttonFaceMinuteHandColor.rgba.blue);
    Common.myDebugLog('buttonFaceMinuteHandColor.rgba.alpha : ' + buttonFaceMinuteHandColor.rgba.alpha);
    spinFaceHourHandColor_R.set_value(buttonFaceMinuteHandColor.rgba.red);
    spinFaceHourHandColor_G.set_value(buttonFaceMinuteHandColor.rgba.green);
    spinFaceHourHandColor_B.set_value(buttonFaceMinuteHandColor.rgba.blue);
    spinFaceHourHandColor_A.set_value(buttonFaceMinuteHandColor.rgba.alpha);
  });
  prefsWidget.attach(buttonFaceMinuteHandColor, 5, faceMinuteHandColorRow, 1, 1);

  let minuteHandFilledToggleRow = minuteHandLineRow;

  let toggleMinuteHandFilledLabel = new Gtk.Label({
    label: 'Filled:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(toggleMinuteHandFilledLabel, 3, minuteHandFilledToggleRow, 1, 1);

  let toggleMinuteHandFilled = new Gtk.Switch({
    active: this.settings.get_boolean("faceminutehandfilled"),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggleMinuteHandFilled, 4, minuteHandFilledToggleRow, 1, 1);

  this.settings.bind(
    'faceminutehandfilled',
    toggleMinuteHandFilled,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  // faceSecondHandLineWidth = settings.get_double("facesecondhandlinewidth");
  // faceSecondHandLineLength = settings.get_double("facesecondhandlinelength");

  let secondHandLineRow = faceMinuteHandColorRow +1;

  let secondHandLineLabel = new Gtk.Label({
    label: 'Second Hand (Width/Length):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(secondHandLineLabel, 0, secondHandLineRow, 1, 1);

  let secondHandLineWidth = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  secondHandLineWidth.set_sensitive(true);
  secondHandLineWidth.set_range(0.0, 1.0);
  secondHandLineWidth.set_value(this.settings.get_double('facesecondhandlinewidth'));
  secondHandLineWidth.set_increments(0.01, 0.1);
  secondHandLineWidth.connect('value-changed', w => {
      this.settings.set_double('facesecondhandlinewidth', w.get_value());
  });
  prefsWidget.attach(secondHandLineWidth, 1, secondHandLineRow, 1, 1);

  let secondHandLineLength = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  secondHandLineLength.set_sensitive(true);
  secondHandLineLength.set_range(0.0, 1.0);
  secondHandLineLength.set_value(this.settings.get_double('facesecondhandlinelength'));
  secondHandLineLength.set_increments(0.01, 0.1);
  secondHandLineLength.connect('value-changed', w => {
      this.settings.set_double('facesecondhandlinelength', w.get_value());
  });
  prefsWidget.attach(secondHandLineLength, 2, secondHandLineRow, 1, 1);

  // faceSecondHandColor = {"R": settings.get_double("facesecondhandcolor-r"), "G": settings.get_double("facesecondhandcolor-g"), "B": settings.get_double("facesecondhandcolor-b"), "A": settings.get_double("facesecondhandcolor-a")};

  let faceSecondHandColorRow = secondHandLineRow +1;

  let spinFaceSecondHandColor_ALabel = new Gtk.Label({
    label: 'Second Hand color (R/G/B/A):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinFaceSecondHandColor_ALabel, 0, faceSecondHandColorRow, 1, 1);

  let spinFaceSecondHandColor_R = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceSecondHandColor_R.set_sensitive(true);
  spinFaceSecondHandColor_R.set_range(0.0, 1.0);
  spinFaceSecondHandColor_R.set_value(this.settings.get_double('facesecondhandcolor-r'));
  spinFaceSecondHandColor_R.set_increments(0.01, 0.1);
  spinFaceSecondHandColor_R.connect('value-changed', w => {
      this.settings.set_double('facesecondhandcolor-r', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceSecondHandColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.red = w.get_value();
      Common.myDebugLog('spinFaceSecondHandColor_R changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceSecondHandColor_R, 1, faceSecondHandColorRow, 1, 1);

  let spinFaceSecondHandColor_G = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceSecondHandColor_G.set_sensitive(true);
  spinFaceSecondHandColor_G.set_range(0.0, 1.0);
  spinFaceSecondHandColor_G.set_value(this.settings.get_double('facesecondhandcolor-g'));
  spinFaceSecondHandColor_G.set_increments(0.01, 0.1);
  spinFaceSecondHandColor_G.connect('value-changed', w => {
      this.settings.set_double('facesecondhandcolor-g', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceSecondHandColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.green = w.get_value();
      Common.myDebugLog('spinFaceSecondHandColor_G changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceSecondHandColor_G, 2, faceSecondHandColorRow, 1, 1);

  let spinFaceSecondHandColor_B = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceSecondHandColor_B.set_sensitive(true);
  spinFaceSecondHandColor_B.set_range(0.0, 1.0);
  spinFaceSecondHandColor_B.set_value(this.settings.get_double('facesecondhandcolor-b'));
  spinFaceSecondHandColor_B.set_increments(0.01, 0.1);
  spinFaceSecondHandColor_B.connect('value-changed', w => {
      this.settings.set_double('facesecondhandcolor-b', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceSecondHandColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.blue = w.get_value();
      Common.myDebugLog('spinFaceSecondHandColor_B changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceSecondHandColor_B, 3, faceSecondHandColorRow, 1, 1);

  let spinFaceSecondHandColor_A = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceSecondHandColor_A.set_sensitive(true);
  spinFaceSecondHandColor_A.set_range(0.0, 1.0);
  spinFaceSecondHandColor_A.set_value(this.settings.get_double('facesecondhandcolor-a'));
  spinFaceSecondHandColor_A.set_increments(0.01, 0.1);
  spinFaceSecondHandColor_A.connect('value-changed', w => {
      this.settings.set_double('facesecondhandcolor-a', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceSecondHandColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.alpha = w.get_value();
      Common.myDebugLog('spinFaceSecondHandColor_A changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceSecondHandColor_A, 4, faceSecondHandColorRow, 1, 1);

  let buttonFaceSecondHandColor = new Gtk.ColorButton({halign: Gtk.Align.END});
  buttonFaceSecondHandColor.set_use_alpha(true);
  _colorSet = new Gdk.RGBA();
  _colorSet.red = this.settings.get_double('facesecondhandcolor-r');
  _colorSet.green = this.settings.get_double('facesecondhandcolor-g');
  _colorSet.blue = this.settings.get_double('facesecondhandcolor-b');
  _colorSet.alpha = this.settings.get_double('facesecondhandcolor-a');
  buttonFaceSecondHandColor.set_rgba(_colorSet);
  buttonFaceSecondHandColor.connect("color_set", () => {
    Common.myDebugLog('buttonFaceSecondHandColor.rgba       : ' + buttonFaceSecondHandColor.rgba.to_string());
    Common.myDebugLog('buttonFaceSecondHandColor.rgba.red   : ' + buttonFaceSecondHandColor.rgba.red);
    Common.myDebugLog('buttonFaceSecondHandColor.rgba.green : ' + buttonFaceSecondHandColor.rgba.green);
    Common.myDebugLog('buttonFaceSecondHandColor.rgba.blue  : ' + buttonFaceSecondHandColor.rgba.blue);
    Common.myDebugLog('buttonFaceSecondHandColor.rgba.alpha : ' + buttonFaceSecondHandColor.rgba.alpha);
    spinFaceSecondHandColor_R.set_value(buttonFaceSecondHandColor.rgba.red);
    spinFaceSecondHandColor_G.set_value(buttonFaceSecondHandColor.rgba.green);
    spinFaceSecondHandColor_B.set_value(buttonFaceSecondHandColor.rgba.blue);
    spinFaceSecondHandColor_A.set_value(buttonFaceSecondHandColor.rgba.alpha);
  });
  prefsWidget.attach(buttonFaceSecondHandColor, 5, faceSecondHandColorRow, 1, 1);

  // faceSecondHandFilled = settings.get_boolean("facesecondhandfilled");

  let secondHandFilledToggleRow = secondHandLineRow;

  let toggleSecondHandFilledLabel = new Gtk.Label({
    label: 'Filled:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(toggleSecondHandFilledLabel, 3, secondHandFilledToggleRow, 1, 1);

  let toggleSecondHandFilled = new Gtk.Switch({
    active: this.settings.get_boolean("facesecondhandfilled"),
    halign: Gtk.Align.END,
    vexpand: false,
    visible: true
  });
  prefsWidget.attach(toggleSecondHandFilled, 4, secondHandFilledToggleRow, 1, 1);

  this.settings.bind(
    'facesecondhandfilled',
    toggleSecondHandFilled,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  Common.myDebugLog('Exiting prefs.js buildHandsPage()');
  return prefsWidget;
}

function buildShadowPage () {
  Common.myDebugLog('Entering prefs.js buildShadowPage()');

  let _colorSet;

  let prefsWidget = new Gtk.Grid({
    margin_start: 18,
    margin_end: 18,
    margin_top: 18,
    margin_bottom: 18,
    column_spacing: 12,
    row_spacing: 12,
    visible: true
  });

  // Title...

  let title = new Gtk.Label({
    label: `<b>${Me.metadata.name} (V.${Me.metadata.version}) - Shadow</b>`,
    halign: Gtk.Align.START,
    use_markup: true,
    visible: true
  });
  prefsWidget.attach(title, 0, 0, 2, 1);

  // Shadow...

  let faceDialShadowRow = 1;

  let toggleDialShadowHandLabel = new Gtk.Label({
    label: 'Shadow Hands:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(toggleDialShadowHandLabel, 0, faceDialShadowRow, 1, 1);

  let toggleDialShadowHand = new Gtk.Switch({
    active: this.settings.get_boolean("faceshadowhand"),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggleDialShadowHand, 1, faceDialShadowRow, 1, 1);

  this.settings.bind(
    'faceshadowhand',
    toggleDialShadowHand,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  faceDialShadowRow += 1;

  let toggleDialShadowTickLabel = new Gtk.Label({
    label: 'Shadow Ticks:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(toggleDialShadowTickLabel, 0, faceDialShadowRow, 1, 1);

  let toggleDialShadowTick = new Gtk.Switch({
    active: this.settings.get_boolean("faceshadowtick"),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggleDialShadowTick, 1, faceDialShadowRow, 1, 1);

  this.settings.bind(
    'faceshadowtick',
    toggleDialShadowTick,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  faceDialShadowRow += 1;

  let toggleDialShadowNumberLabel = new Gtk.Label({
    label: 'Shadow Numbers:',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(toggleDialShadowNumberLabel, 0, faceDialShadowRow, 1, 1);

  let toggleDialShadowNumber = new Gtk.Switch({
    active: this.settings.get_boolean("faceshadownumber"),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggleDialShadowNumber, 1, faceDialShadowRow, 1, 1);

  this.settings.bind(
    'faceshadownumber',
    toggleDialShadowNumber,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  faceDialShadowRow += 1;

  let faceDialShadowLabel = new Gtk.Label({
    label: 'Shadow offset (X/Y):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(faceDialShadowLabel, 0, faceDialShadowRow, 1, 1);

  let faceDialShadowX = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  faceDialShadowX.set_sensitive(true);
  faceDialShadowX.set_range(0.0, 1.0);
  faceDialShadowX.set_value(this.settings.get_double('faceshadowoffsetx'));
  faceDialShadowX.set_increments(0.01, 0.1);
  faceDialShadowX.connect('value-changed', w => {
      this.settings.set_double('faceshadowoffsetx', w.get_value());
  });
  prefsWidget.attach(faceDialShadowX, 1, faceDialShadowRow, 1, 1);

  let faceDialShadowY = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  faceDialShadowY.set_sensitive(true);
  faceDialShadowY.set_range(0.0, 1.0);
  faceDialShadowY.set_value(this.settings.get_double('faceshadowoffsety'));
  faceDialShadowY.set_increments(0.01, 0.1);
  faceDialShadowY.connect('value-changed', w => {
      this.settings.set_double('faceshadowoffsety', w.get_value());
  });
  prefsWidget.attach(faceDialShadowY, 2, faceDialShadowRow, 1, 1);

  let faceDialShadowColorRow = faceDialShadowRow +1;

  let spinFaceDialShadowColor_ALabel = new Gtk.Label({
    label: 'Shadow color (R/G/B/A):',
    halign: Gtk.Align.START,
    visible: true
  });
  prefsWidget.attach(spinFaceDialShadowColor_ALabel, 0, faceDialShadowColorRow, 1, 1);

  let spinFaceDialShadowColor_R = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceDialShadowColor_R.set_sensitive(true);
  spinFaceDialShadowColor_R.set_range(0.0, 1.0);
  spinFaceDialShadowColor_R.set_value(this.settings.get_double('faceshadowcolor-r'));
  spinFaceDialShadowColor_R.set_increments(0.01, 0.1);
  spinFaceDialShadowColor_R.connect('value-changed', w => {
      this.settings.set_double('faceshadowcolor-r', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceDialShadowColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.red = w.get_value();
      Common.myDebugLog('spinFaceDialShadowColor_R changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceDialShadowColor_R, 1, faceDialShadowColorRow, 1, 1);

  let spinFaceDialShadowColor_G = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceDialShadowColor_G.set_sensitive(true);
  spinFaceDialShadowColor_G.set_range(0.0, 1.0);
  spinFaceDialShadowColor_G.set_value(this.settings.get_double('faceshadowcolor-g'));
  spinFaceDialShadowColor_G.set_increments(0.01, 0.1);
  spinFaceDialShadowColor_G.connect('value-changed', w => {
      this.settings.set_double('faceshadowcolor-g', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceDialShadowColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.green = w.get_value();
      Common.myDebugLog('spinFaceDialShadowColor_G changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceDialShadowColor_G, 2, faceDialShadowColorRow, 1, 1);

  let spinFaceDialShadowColor_B = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceDialShadowColor_B.set_sensitive(true);
  spinFaceDialShadowColor_B.set_range(0.0, 1.0);
  spinFaceDialShadowColor_B.set_value(this.settings.get_double('faceshadowcolor-b'));
  spinFaceDialShadowColor_B.set_increments(0.01, 0.1);
  spinFaceDialShadowColor_B.connect('value-changed', w => {
      this.settings.set_double('faceshadowcolor-b', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceDialShadowColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.blue = w.get_value();
      Common.myDebugLog('spinFaceDialShadowColor_B changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceDialShadowColor_B, 3, faceDialShadowColorRow, 1, 1);

  let spinFaceDialShadowColor_A = new Gtk.SpinButton({ 
    halign: Gtk.Align.END, 
    digits: 3
  });
  spinFaceDialShadowColor_A.set_sensitive(true);
  spinFaceDialShadowColor_A.set_range(0.0, 1.0);
  spinFaceDialShadowColor_A.set_value(this.settings.get_double('faceshadowcolor-a'));
  spinFaceDialShadowColor_A.set_increments(0.01, 0.1);
  spinFaceDialShadowColor_A.connect('value-changed', w => {
      this.settings.set_double('faceshadowcolor-a', w.get_value());
      //
      let _color = new Gdk.RGBA();
      let couplingControl = buttonFaceDialShadowColor
      _color.red = couplingControl.rgba.red;
      _color.green = couplingControl.rgba.green;
      _color.blue = couplingControl.rgba.blue;
      _color.alpha = couplingControl.rgba.alpha;
      _color.alpha = w.get_value();
      Common.myDebugLog('spinFaceDialShadowColor_A changed: ' + w.get_value());
      couplingControl.set_rgba(_color);
      //
  });
  prefsWidget.attach(spinFaceDialShadowColor_A, 4, faceDialShadowColorRow, 1, 1);

  let buttonFaceDialShadowColor = new Gtk.ColorButton({halign: Gtk.Align.END});
  buttonFaceDialShadowColor.set_use_alpha(true);
  _colorSet = new Gdk.RGBA();
  _colorSet.red = this.settings.get_double('faceshadowcolor-r');
  _colorSet.green = this.settings.get_double('faceshadowcolor-g');
  _colorSet.blue = this.settings.get_double('faceshadowcolor-b');
  _colorSet.alpha = this.settings.get_double('faceshadowcolor-a');
  buttonFaceDialShadowColor.set_rgba(_colorSet);
  buttonFaceDialShadowColor.connect("color_set", () => {
    Common.myDebugLog('buttonFaceDialShadowColor.rgba       : ' + buttonFaceDialShadowColor.rgba.to_string());
    Common.myDebugLog('buttonFaceDialShadowColor.rgba.red   : ' + buttonFaceDialShadowColor.rgba.red);
    Common.myDebugLog('buttonFaceDialShadowColor.rgba.green : ' + buttonFaceDialShadowColor.rgba.green);
    Common.myDebugLog('buttonFaceDialShadowColor.rgba.blue  : ' + buttonFaceDialShadowColor.rgba.blue);
    Common.myDebugLog('buttonFaceDialShadowColor.rgba.alpha : ' + buttonFaceDialShadowColor.rgba.alpha);
    spinFaceDialShadowColor_R.set_value(buttonFaceDialShadowColor.rgba.red);
    spinFaceDialShadowColor_G.set_value(buttonFaceDialShadowColor.rgba.green);
    spinFaceDialShadowColor_B.set_value(buttonFaceDialShadowColor.rgba.blue);
    spinFaceDialShadowColor_A.set_value(buttonFaceDialShadowColor.rgba.alpha);
  });
  prefsWidget.attach(buttonFaceDialShadowColor, 5, faceDialShadowColorRow, 1, 1);

  Common.myDebugLog('Exiting prefs.js buildShadowPage()');
  return prefsWidget;
}

function buildAboutPage () {
  Common.myDebugLog('Entering prefs.js buildAboutPage()');

  let prefsWidget = new Gtk.Grid({
    margin_start: 18,
    margin_end: 18,
    margin_top: 18,
    margin_bottom: 18,
    column_spacing: 12,
    row_spacing: 12,
    visible: true
  });

  // Title...

  let title = new Gtk.Label({
    label: `<b>${Me.metadata.name} (V.${Me.metadata.version}) - About</b>`,
    halign: Gtk.Align.START,
    use_markup: true,
    visible: true
  });
  prefsWidget.attach(title, 0, 0, 2, 1);

  let theRow = 1;

  let theLabel = new Gtk.Label({
    label: `${Me.metadata.name} (V.${Me.metadata.version}) was first brought to you in 02-2022 by Zappo-II.\n${Me.metadata.description}\nVisit <a href="${Me.metadata.url}">${Me.metadata.url}</a> for further details.\nThere is more to come, so stay tuned...`,
    halign: Gtk.Align.START,
    use_markup: true,
    visible: true
  });
  prefsWidget.attach(theLabel, 0, theRow, 6, 6);

  Common.myDebugLog('Exiting prefs.js buildAboutPage()');
  return prefsWidget;
}
