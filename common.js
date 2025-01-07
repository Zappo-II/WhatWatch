/* 
 * 
 * org.gnome.shell.extensions.zappoii.whatwatch common...
 * 
 * Visit https://github.com/Zappo-II/WhatWatch for 
 * LICENSE and documentation
 * 
 */
'use strict';
import GLib from 'gi://GLib';

export var debugLogging = false;
let metadata = {
  name: 'MyNameIsUndefined',
  version: 'MyVersionIsUndefined'
};

export function setDebugLogging(myBoolean) {
    debugLogging = myBoolean;
}

export function setMetaData(myName, myVersion) {
    metadata.name = myName;
    metadata.version = myVersion;
}

export function myDebugLog(msg) {
    if (debugLogging) {
        //log('' + logPrefix('[DEBUG]') + ' - ' + msg + '');
        console.debug('' + logPrefix('[DEBUG]') + ' - ' + msg + '');
    }
}

export function myErrorLog(e, msg) {
    //logError(e, '' + logPrefix('[ERROR]') + ' - ' + msg + '');
    console.error(e, '' + logPrefix('[ERROR]') + ' - ' + msg + '');
}

export function myLog(msg) {
    //log('' + logPrefix('') + '' + msg + '');
    console.log('' + logPrefix('') + '' + msg + '');
}

export function logPrefix(msg) {
    let now = GLib.DateTime.new_now_local();
    let nowString = now.format("%Y-%m-%d %H:%M:%S.%f");
    return nowString + ' - ' + `${metadata.name} (V.${metadata.version})` + ' - ' + msg;
}
