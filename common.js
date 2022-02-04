/* 
 * 
 * org.gnome.shell.extensions.zappoii.whatwatch common...
 * 
 */
'use strict';
const GLib = imports.gi.GLib;
const Me = imports.misc.extensionUtils.getCurrentExtension();

var debugLogging = false;

function myDebugLog(msg) {
    if (debugLogging) {
        let myPrefix = '[DEBUG] ';
        myLog('' + myPrefix + '' + msg + '');
    }
}

function myErrorLog(msg) {
    let myPrefix = '[ERROR] ';
    myLog('' + myPrefix + '' + msg + '');
}

function myLog(msg) {
    let now = GLib.DateTime.new_now_local();
    let nowString = now.format("%Y-%m-%d %H:%M:%S.%f");
    let myPrefix = nowString + ' - ' + `${Me.metadata.name} (V.${Me.metadata.version})` + ' - ';
    log('' + myPrefix + '' + msg + '');
}
