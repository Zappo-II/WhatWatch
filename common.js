/* 
 * 
 * org.gnome.shell.extensions.zappoii.whatwatch common...
 * 
 * Visit https://github.com/Zappo-II/WhatWatch for 
 * LICENSE and documentation
 * 
 */
'use strict';
const GLib = imports.gi.GLib;
const Me = imports.misc.extensionUtils.getCurrentExtension();

var debugLogging = false;

function myDebugLog(msg) {
    if (debugLogging) {
        log('' + logPrefix('[DEBUG]') + ' - ' + msg + '');
    }
}

function myErrorLog(e, msg) {
    logError(e, '' + logPrefix('[ERROR]') + ' - ' + msg + '');
}

function myLog(msg) {
    log('' + logPrefix('') + '' + msg + '');
}

function logPrefix(msg) {
    let now = GLib.DateTime.new_now_local();
    let nowString = now.format("%Y-%m-%d %H:%M:%S.%f");
    return nowString + ' - ' + `${Me.metadata.name} (V.${Me.metadata.version})` + ' - ' + msg;
}
