/* 
 * 
 * org.gnome.shell.extensions.zappoii.whatwatch common...
 * 
 * Visit https://github.com/Zappo-II/WhatWatch for 
 * LICENSE and documentation
 * 
 */
'use strict';
//const GLib = imports.gi.GLib;
import GLib from 'gi://GLib';
//const Me = imports.misc.extensionUtils.getCurrentExtension();

export var debugLogging = false;
const metadata = {
  name: 'MyNameIs',
  version: 'MyVersionIs'
};

export function setDebugLogging(myBoolean) {
    debugLogging = myBoolean;
}

export function myDebugLog(msg) {
    if (debugLogging) {
        log('' + logPrefix('[DEBUG]') + ' - ' + msg + '');
    }
}

export function myErrorLog(e, msg) {
    logError(e, '' + logPrefix('[ERROR]') + ' - ' + msg + '');
}

export function myLog(msg) {
    log('' + logPrefix('') + '' + msg + '');
}

export function logPrefix(msg) {
    let now = GLib.DateTime.new_now_local();
    let nowString = now.format("%Y-%m-%d %H:%M:%S.%f");
    return nowString + ' - ' + `${metadata.name} (V.${metadata.version})` + ' - ' + msg;
}
