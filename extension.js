/* 
 * 
 * WhatWatch@Zappo-II.github.io
 * org.gnome.shell.extensions.zappoii.whatwatch ...
 * 
 * Visit https://github.com/Zappo-II/WhatWatch for 
 * LICENSE and documentation
 * 
 * Console-Debug:
 *   `journalctl -f -o cat /usr/bin/gnome-shell`
 * 
 */
'use strict';

const {St, GLib, Gio, Shell} = imports.gi;
const Main = imports.ui.main;
const Cairo = imports.cairo;
//
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Common = Me.imports.common;
//
const schemaid = Me.metadata['settings-schema'];
//
let repaintHandlerID = null;
var area = null;
var config = null;
var settings = null;
let timeout = null;
//

function init () {
    Common.myDebugLog('Entering init()');

    // NOP

    Common.myDebugLog('Exiting init()');
}

function enable () {
    Common.myDebugLog('Entering enable()');
    //
    settings = ExtensionUtils.getSettings(schemaid);
    Common.debugLogging = settings.get_boolean("debuglogging");

    Common.myDebugLog('Entering enable() - After initialisation of Common.debugLogging...');
    //

    config = readSettings();

    const clockWidth = config.clockWidth;
    const clockHeight = config.clockHeight;

    Common.myDebugLog('Initializing "area" as St.DrawingArea(' + clockWidth + ',' + clockHeight + ')...');
    area = new St.DrawingArea({
        style_class : 'bg-color',
        reactive : true,
        can_focus : true,
        track_hover : true,
        width: clockWidth,
        height: clockHeight
    });

    setClockPosition();

    /*

    area.connect("enter-event", () => {
        Common.myDebugLog('entered');
    });
  
    area.connect("leave-event", () => {
        Common.myDebugLog('left');
    });

    area.connect("button-press-event", () => {
        Common.myDebugLog('clicked');
        test();
    });

    */

    Common.myDebugLog('Connecting "area - repaint" to local function drawClock()...');
    repaintHandlerID = area.connect('repaint', (area) => drawClock(area));

    Common.myDebugLog('Adding "area" to LayoutManager...');
    Main.layoutManager.addChrome(area, {
        affectsInputRegion : false,
        affectsStruts : false,
        trackFullscreen : config.trackFullscreen
    });

    Common.myDebugLog('Adding callback (area.queue_repaint()) "timeout" with 500ms to Source context...');
    timeout = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 500, () => {
        Common.myDebugLog('TimeOut triggered...');
        this.area.queue_repaint();
        return true;
    });
    //
    Common.myLog(`${Me.metadata.name}`, `${Me.metadata.name} (V.${Me.metadata.version}) is enabled now...`);
    Common.myDebugLog('Exiting enable()');
}

function disable () {
    Common.myDebugLog('Entering disable()');
    //
    if (timeout) {
        Common.myDebugLog('Removing "timeout" from Source context...');
        GLib.Source.remove(timeout);
        timeout = null;
    }
    //
    if (repaintHandlerID) {
        if (area) {
            Common.myDebugLog('Disconnecting "area" repaintHandler...');
            area.disconnect(repaintHandlerID);
        }
        repaintHandlerID = null;
    }
    if (area) {
        Common.myDebugLog('Removing "area" from LayoutManager...');
        Main.layoutManager.removeChrome(area);
        area.destroy();
        area = null;
    }
    config = null;
    settings = null;
    //
    Common.myLog(`${Me.metadata.name}`, `${Me.metadata.name} (V.${Me.metadata.version}) is disabled now...`);
    Common.myDebugLog('Exiting disable()');
}

function setClockPosition() {
    let skipThis = false;
    //
    const clockPosition = config.clockPosition;
    const clockWidth = config.clockWidth;
    const clockHeight = config.clockHeight;
    const marginTop = config.marginTop;
    const marginSide = config.marginSide;
    //
    let pMonitor = Main.layoutManager.primaryMonitor;

    switch (clockPosition) {
        case "center-left":
            Common.myDebugLog('area.set_position(' + clockPosition + '):= (' + marginSide + ',' + ( pMonitor.height / 2 ) - ( clockHeight / 2 ) + ')');
            area.set_position(marginSide, ( pMonitor.height / 2 ) - ( clockHeight / 2 ));
            break;
    
        case "center":
            Common.myDebugLog('area.set_position(' + clockPosition + '):= (' + ( pMonitor.width / 2 ) - ( clockWidth / 2 ) + ',' + ( pMonitor.height / 2 ) - ( clockHeight / 2 ) + ')');
            area.set_position(( pMonitor.width / 2 ) - ( clockWidth / 2 ), ( pMonitor.height / 2 ) - ( clockHeight / 2 ));
            break;
        
        case "center-right":
            Common.myDebugLog('area.set_position(' + clockPosition + '):= (' +  ( pMonitor.width - clockWidth - marginSide ) + ',' + ( pMonitor.height / 2 ) - ( clockHeight / 2 ) + ')');
            area.set_position(( pMonitor.width - clockWidth - marginSide ), ( pMonitor.height / 2 ) - ( clockHeight / 2 ));
            break;

        case "top-left":
            Common.myDebugLog('area.set_position(' + clockPosition + '):= (' +  marginSide + ',' + marginTop + ')');
            area.set_position(marginSide, marginTop);
            break;

        case "top-middle":
            Common.myDebugLog('area.set_position(' + clockPosition + '):= (' +  (pMonitor.width / 2 ) - (clockWidth / 2) + ',' + marginTop + ')');
            area.set_position((pMonitor.width / 2 ) - (clockWidth / 2), marginTop);
            break;

        case "top-right":
        case "default":
            skipThis = true;            
        default:
            if (! skipThis) {
                Common.myErrorLog('setClockPosition - Invalid clockPosition: ' + clockPosition);
            }
            Common.myDebugLog('area.set_position(' + clockPosition + '):= (' + pMonitor.width + ' - ' +  clockWidth + ' - ' + marginSide + '), ' + marginTop);
            area.set_position(pMonitor.x + (pMonitor.width - clockWidth - marginSide), pMonitor.y + marginTop);
            break;
    }

}

function drawClock (area) {
    let skipThis = false;

    config = readSettings();
    setClockPosition();

    if ( ! windowTest()) {

        switch (config.clockStyle) {
            case "Radar":
                drawRadarClock (area);
                break;

            case "OldSchoolDB":
                drawOldSchoolClock (area, false, false, true);
                break;

            case "OldSchoolArabian":
                drawOldSchoolClock (area, true, false, false);
                break;

            case "OldSchoolRoman":
                drawOldSchoolClock (area, true, true, false);
                break;
                    
            case "OldSchool":
            case "default":
                skipThis = true;
            default:
                if (! skipThis) {
                    Common.myErrorLog('drawClock - Invalid clockStyle: ' + config.clockStyle);
                }
                drawOldSchoolClock (area, false, false, false);
                break;
        }

    }

    return true;
}

function drawOldSchoolClock (area, hasNumbers, hasRomanNumbers, isBundesBahn) {
    // Get the cairo context
    let cr = area.get_context();

    const myClockData = clockGetTime();

    const faceDialLineWidth = config.faceDialLineWidth;
    const faceDialLineInset = config.faceDialLineInset;
    const faceDialLineTickInset = config.faceDialLineTickInset;

    let faceDialLineTickRadius = 1 - faceDialLineWidth - faceDialLineInset - faceDialLineTickInset

    const faceHourHandLineWidth = config.faceHourHandLineWidth;
    const faceHourHandLineLength = config.faceHourHandLineLength;
    const faceHourHandColor = config.faceHourHandColor;
    const faceHourHandFilled = config.faceHourHandFilled;
    const faceHourHandEyed = config.faceHourHandEyed;
    const faceHourHandTailed = config.faceHourHandTailed;
    const faceHourHandFinned = config.faceHourHandFinned;

    const faceMinuteHandLineWidth = config.faceMinuteHandLineWidth;
    const faceMinuteHandLineLength = config.faceMinuteHandLineLength;
    const faceMinuteHandColor = config.faceMinuteHandColor;
    const faceMinuteHandFilled = config.faceMinuteHandFilled;
    const faceMinuteHandEyed = config.faceMinuteHandEyed;
    const faceMinuteHandTailed = config.faceMinuteHandTailed;
    const faceMinuteHandFinned = config.faceMinuteHandFinned;

    const faceSecondHandLineWidth = config.faceSecondHandLineWidth;
    const faceSecondHandLineLength = config.faceSecondHandLineLength;
    const faceSecondHandColor = config.faceSecondHandColor;
    const faceSecondHandFilled = config.faceSecondHandFilled;
    const faceSecondHandEyed = config.faceSecondHandEyed;
    const faceSecondHandTailed = config.faceSecondHandTailed;
    const faceSecondHandFinned = config.faceSecondHandFinned;

    let theFont = '';
    let theOnlyQuarters = false;
    let theOthersSmall = false;
    let theArabianNumbers = false;

    // Do some drawing with cairo
    cr.save();
    //
    drawFaceInit(cr);
    drawFaceDial(cr);

    if (isBundesBahn) {
        clockRoundRectangle (cr, {X: -0.13, Y: (-1 * (faceDialLineTickRadius - config.faceProminentTickLineInset - 0.05))}, {height: 0.15, width: 0.26}, 0.02, 4, {R: 1, G: 0, B: 0, A: 1}, false);
        clockPrint(cr, {X: -0.1, Y: (-1 * (faceDialLineTickRadius - config.faceProminentTickLineInset - 0.17))}, {R: 1, G: 0, B: 0, A: 1}, "", 0.125, false, true, "DB");
    }

    //
    // Shadow
    let shadow = {};
    shadow.X = config.faceShadowOffsetX;
    shadow.Y = config.faceShadowOffsetY;
    let shadowColor = {};
    shadowColor = config.faceShadowColor;

    if (config.faceShadowTick) {
        drawFaceDialLine(cr, shadow, shadowColor, true);
        drawFaceDialTicks(cr, faceDialLineTickRadius, shadow, shadowColor, true);    
    }

    if (hasNumbers) {
        theFont = 'sans serif';
        theOnlyQuarters = false;
        theOthersSmall = true;
        theArabianNumbers = true;
        if (hasRomanNumbers) {
            theFont = 'serif';
            theArabianNumbers = false;
            theOthersSmall = true;
        }
        if (config.faceShadowNumber) {
            drawFaceDialNumbers (cr, faceDialLineTickRadius, shadow, shadowColor, true, theArabianNumbers, theOnlyQuarters, theOthersSmall, theFont);
        }
    }

    if (config.faceShadowHand) {
        drawHand(cr, shadow, faceHourHandLineWidth, faceHourHandLineLength, shadowColor, myClockData.nowHourDegrees + myClockData.nowMinuteDegrees / 12, faceHourHandTailed, faceHourHandFinned, faceHourHandEyed, faceHourHandFilled);
        drawHand(cr, shadow, faceMinuteHandLineWidth, faceMinuteHandLineLength, shadowColor, myClockData.nowMinuteDegrees + myClockData.nowSecondDegrees / 60, faceMinuteHandTailed, faceMinuteHandFinned, faceMinuteHandEyed, faceMinuteHandFilled);
        drawHand(cr, shadow, faceSecondHandLineWidth, faceSecondHandLineLength, shadowColor, myClockData.nowSecondDegrees, faceSecondHandTailed, faceSecondHandFinned, faceSecondHandEyed , faceSecondHandFilled);    
        drawCenterDial(cr, shadow, shadowColor, true);
    }

    //
    // Normal Hands
    shadow.X = 0.0;
    shadow.Y = 0.0;
    //
    drawFaceDialLine(cr, {}, {}, false);
    drawFaceDialTicks(cr, faceDialLineTickRadius, {}, {}, false);
    //
    if (hasNumbers) {
        theFont = 'sans serif';
        theOnlyQuarters = false;
        theOthersSmall = true;
        theArabianNumbers = true;
        if (hasRomanNumbers) {
            theFont = 'serif';
            theArabianNumbers = false;
            theOthersSmall = true;
        }
        drawFaceDialNumbers (cr, faceDialLineTickRadius, null, null, false, theArabianNumbers, theOnlyQuarters, theOthersSmall, theFont);
    }
    //
    drawHand(cr, shadow, faceHourHandLineWidth, faceHourHandLineLength, faceHourHandColor, myClockData.nowHourDegrees + myClockData.nowMinuteDegrees / 12, faceHourHandTailed, faceHourHandFinned, faceHourHandEyed, faceHourHandFilled);
    drawHand(cr, shadow, faceMinuteHandLineWidth, faceMinuteHandLineLength, faceMinuteHandColor, myClockData.nowMinuteDegrees + myClockData.nowSecondDegrees / 60, faceMinuteHandTailed, faceMinuteHandFinned, faceMinuteHandEyed, faceMinuteHandFilled);
    drawHand(cr, shadow, faceSecondHandLineWidth, faceSecondHandLineLength, faceSecondHandColor, myClockData.nowSecondDegrees, faceSecondHandTailed, faceSecondHandFinned, faceSecondHandEyed, faceSecondHandFilled);
    //
    drawCenterDial(cr, {}, {}, false);
    //
    cr.restore();

    // Explicitly tell Cairo to free the context memory
    cr.$dispose();
    return true;
}

function drawRadarClock (area) {
    // Get the cairo context
    let cr = area.get_context();

    const myClockData = clockGetTime();

    const faceHourHandLineWidth = config.faceHourHandLineWidth;
    const faceHourHandLineLength = config.faceHourHandLineLength;
    const faceHourHandColor = config.faceHourHandColor;
    const faceHourHandFilled = config.faceHourHandFilled;

    const faceMinuteHandLineWidth = config.faceMinuteHandLineWidth;
    const faceMinuteHandLineLength = config.faceMinuteHandLineLength;
    const faceMinuteHandColor = config.faceMinuteHandColor;
    const faceMinuteHandFilled = config.faceMinuteHandFilled;

    const faceSecondHandLineWidth = config.faceSecondHandLineWidth;
    const faceSecondHandLineLength = config.faceSecondHandLineLength;
    const faceSecondHandColor = config.faceSecondHandColor;
    const faceSecondHandFilled = config.faceSecondHandFilled;

    let faceDialLineTickRadius = 1 - 0.05 - config.faceDialLineTickInset

    // Do some drawing with cairo
    cr.save();
    //
    drawFaceInit(cr);
    drawFaceDial(cr);
    drawFaceDialTicks(cr, faceDialLineTickRadius, {}, {}, false);
    //
    let arcOffset = -1 * ((Math.PI * 2) / 4);
    //
    // Second Hand
    cr.setLineWidth (faceSecondHandLineWidth);
    cr.setSourceRGBA (faceSecondHandColor.R, faceSecondHandColor.G, faceSecondHandColor.B, faceSecondHandColor.A);
    if (faceSecondHandFilled == true) {
        cr.moveTo (0,0);
        cr.lineTo(0, faceSecondHandLineLength);
    }
    cr.arc(0.0, 0.0, faceSecondHandLineLength, arcOffset, arcOffset + myClockData.nowSecondDegrees);
    if (faceSecondHandFilled == true) {
        cr.lineTo(0, 0);
        cr.fill();
    } else {
        cr.stroke();
    }
    //
    // Minute Hand
    cr.setLineWidth (faceMinuteHandLineWidth);
    cr.setSourceRGBA (faceMinuteHandColor.R, faceMinuteHandColor.G, faceMinuteHandColor.B, faceMinuteHandColor.A);
    if (faceMinuteHandFilled == true) {
        cr.moveTo (0,0);
        cr.lineTo(0, faceMinuteHandLineLength);
    }
    cr.arc(0.0, 0.0, faceMinuteHandLineLength, arcOffset, arcOffset + (myClockData.nowMinuteDegrees + (myClockData.nowSecondDegrees / 60.0)));
    if (faceMinuteHandFilled == true) {
        cr.lineTo(0, 0);
        cr.fill();
    } else {
        cr.stroke();
    }
    //
    // Hour Hand
    cr.setLineWidth (faceHourHandLineWidth);
    cr.setSourceRGBA (faceHourHandColor.R, faceHourHandColor.G, faceHourHandColor.B, faceHourHandColor.A);
    if (faceHourHandFilled == true) {
        cr.moveTo (0,0);
        cr.lineTo(0, faceHourHandLineLength);
    }
    cr.arc(0.0, 0.0, faceHourHandLineLength,  arcOffset, arcOffset + (myClockData.nowHourDegrees + (myClockData.nowMinuteDegrees / 12.0)));
    if (faceHourHandFilled == true) {
        cr.lineTo(0, 0);
        cr.fill();
    } else {
        cr.stroke();
    }
    //
    drawCenterDial(cr, {}, {}, false);

    //
    cr.restore();
    // Explicitly tell Cairo to free the context memory
    cr.$dispose();
    return true;
}

function drawHand(cr, center, width, length, color, degrees, hasTail, hasFin, hasEye, isFilled) {
    //
    cr.setLineWidth (width);
    cr.setSourceRGBA (color.R, color.G, color.B, color.A);
    cr.moveTo(center.X, center.Y)
    if (hasEye) {
        cr.lineTo(Math.sin(degrees) * (length / 5 * 3) + center.X, -1 * Math.cos(degrees) * (length / 5 * 3) + center.Y);
        cr.stroke();
        cr.arc(Math.sin(degrees) * ((length / 5 * 3) + 0.06) + center.X, -1 * Math.cos(degrees) * ((length / 5 * 3) + 0.06) + center.Y, 0.06, 0, 2 * Math.PI);
        if (isFilled) {
            cr.fill();
        } else {
            cr.stroke();
        }
        cr.moveTo(Math.sin(degrees) * ((length / 5 * 3) + 0.12) + center.X, -1 * Math.cos(degrees) * ((length / 5 * 3) + 0.12 ) + center.Y)
        cr.lineTo(Math.sin(degrees) * length + center.X, -1 * Math.cos(degrees) * length + center.Y);
    } else {
        cr.lineTo(Math.sin(degrees) * length + center.X, -1 * Math.cos(degrees) * length + center.Y);
    }
    cr.stroke();
    if (hasTail || hasFin) {
        let tailLength = 1;
        cr.setLineWidth (width);
        cr.moveTo(center.X, center.Y);
        cr.lineTo(-1 * Math.sin(degrees) * (tailLength / 7) + center.X, Math.cos(degrees) * (tailLength / 7) + center.Y);
        cr.stroke();
        cr.moveTo(-1 * Math.sin(degrees) * (tailLength / 7) + center.X, Math.cos(degrees) * (tailLength / 7) + center.Y);
        if (hasFin) {
            if (width > 0) {
                cr.setLineWidth (width + 0.02);
            }
            cr.lineTo(-1 * Math.sin(degrees) * (tailLength / 3) + center.X, Math.cos(degrees) * (tailLength / 3) + center.Y);
        } else {
            cr.lineTo(-1 * Math.sin(degrees) * (tailLength / 4) + center.X, Math.cos(degrees) * (tailLength / 4) + center.Y);
        }
        cr.stroke();
    } 
}

function drawFaceDialLine(cr, shadow, shadowColor, castShadow) {
    // Face Dial Line (circle)
    const faceDialLineWidth = config.faceDialLineWidth;
    const faceDialLineInset = config.faceDialLineInset;
    let faceDialLineColor = config.faceDialLineColor;
    let center = { "X": 0, "Y": 0}
    if (castShadow) {
        faceDialLineColor = shadowColor;
        center = { "X": shadow.X, "Y": shadow.Y}
    }
    let faceDialLineRadius = 1 - faceDialLineWidth - faceDialLineInset;
    cr.setLineWidth (faceDialLineWidth);
    cr.setSourceRGBA (faceDialLineColor.R, faceDialLineColor.G, faceDialLineColor.B, faceDialLineColor.A);
    cr.arc(center.X, center.Y, faceDialLineRadius, 0, 2 * Math.PI);
    cr.stroke();
}

function drawFaceDialTicks (cr, faceDialLineTickRadius, shadow, shadowColor, castShadow) {
    // Dial Ticks
    const faceMinuteTickLineWidth = config.faceMinuteTickLineWidth;
    const faceMinuteTickLineInset = config.faceMinuteTickLineInset;
    let faceMinuteTickColor = config.faceMinuteTickColor;

    const faceTickLineWidth = config.faceTickLineWidth;
    const faceTickLineInset = config.faceTickLineInset;
    let faceTickColor = config.faceTickColor;

    const faceProminentTickLineWidth = config.faceProminentTickLineWidth;
    const faceProminentTickLineInset = config.faceProminentTickLineInset;
    let faceProminentTickColor = config.faceProminentTickColor;

    let center = { "X": 0, "Y": 0}
    if (castShadow) {
        faceMinuteTickColor = shadowColor;
        faceTickColor = shadowColor;
        faceProminentTickColor = shadowColor;
        center = { "X": shadow.X, "Y": shadow.Y}
    }

    let inset;
    let i;
    for (i = 0; i < 60; i++) {
    
        if (i % 15 != 0) {
            if (i % 5 != 0) {
                // Minute Ticks
                inset = faceMinuteTickLineInset;
                cr.setSourceRGBA (faceMinuteTickColor.R, faceMinuteTickColor.G, faceMinuteTickColor.B, faceMinuteTickColor.A);
                cr.setLineWidth(faceMinuteTickLineWidth);
            } else {
                // (5er) Ticks on 5 / 10 / 20 / 25 / 35 / 40 / 50 / 55
                inset = faceTickLineInset;
                cr.setSourceRGBA (faceTickColor.R, faceTickColor.G, faceTickColor.B, faceTickColor.A);
                cr.setLineWidth(faceTickLineWidth);
            }
        } else {
            // Prominent (Quarter) Ticks on 3 / 6 / 9 / 12
            inset = faceProminentTickLineInset;
            cr.setSourceRGBA (faceProminentTickColor.R, faceProminentTickColor.G, faceProminentTickColor.B, faceProminentTickColor.A);
            cr.setLineWidth(faceProminentTickLineWidth);    
        }

        cr.moveTo((faceDialLineTickRadius - inset) * Math.cos (i * Math.PI / 30) + center.X, (faceDialLineTickRadius - inset) * Math.sin (i * Math.PI / 30) + center.Y);
        cr.lineTo(faceDialLineTickRadius * Math.cos (i * Math.PI / 30) + center.X, faceDialLineTickRadius * Math.sin (i * Math.PI / 30) + center.Y);
        cr.stroke();

    }

    if (config.faceMinuteTickCircle || config.faceMinuteTickOuterCircle) {
        cr.setSourceRGBA (faceMinuteTickColor.R, faceMinuteTickColor.G, faceMinuteTickColor.B, faceMinuteTickColor.A);
        cr.setLineWidth(faceMinuteTickLineWidth);
        if (config.faceMinuteTickCircle)
            cr.arc(center.X, center.Y, faceDialLineTickRadius - faceMinuteTickLineInset, 0, 2 * Math.PI);
        if (config.faceMinuteTickOuterCircle)
            cr.arc(center.X, center.Y, faceDialLineTickRadius, 0, 2 * Math.PI);
        cr.stroke();
    }

    if (config.faceTickCircle || config.faceTickOuterCircle) {
        cr.setSourceRGBA (faceTickColor.R, faceTickColor.G, faceTickColor.B, faceTickColor.A);
        cr.setLineWidth(faceTickLineWidth);
        if (config.faceTickCircle)
            cr.arc(center.X, center.Y, faceDialLineTickRadius - faceTickLineInset, 0, 2 * Math.PI);
        if (config.faceTickOuterCircle)
            cr.arc(center.X, center.Y, faceDialLineTickRadius, 0, 2 * Math.PI);
        cr.stroke();
    }

    if (config.faceProminentTickCircle || config.faceProminentTickOuterCircle) {
        cr.setSourceRGBA (faceProminentTickColor.R, faceProminentTickColor.G, faceProminentTickColor.B, faceProminentTickColor.A);
        cr.setLineWidth(faceProminentTickLineWidth);
        if (config.faceProminentTickCircle)
            cr.arc(center.X, center.Y, faceDialLineTickRadius - faceProminentTickLineInset, 0, 2 * Math.PI);
        if (config.faceProminentTickOuterCircle)
            cr.arc(center.X, center.Y, faceDialLineTickRadius, 0, 2 * Math.PI);
        cr.stroke();
    }

}

function drawFaceDialNumbers (cr, faceDialLineTickRadius, shadow, shadowColor, castShadow, numberArabian, onlyQuarters, othersSmall, numberFont) {

    // const numberArabian = true;
    // const numberFont = '';
    const numberNormalSize = 0.18;
    const numberSmallSize = 0.12;
    // const othersSmall = true;
    // const onlyQuarters = false;

    // Dial Numbers
    let faceTickColor = config.faceTickColor;
    let faceProminentTickColor = config.faceProminentTickColor;
    let faceProminentTickLineInset = config.faceProminentTickLineInset
    let faceTickLineInset = config.faceTickLineInset

    let center = { "X": 0, "Y": 0};
    if (castShadow) {
        faceTickColor = shadowColor;
        faceProminentTickColor = shadowColor;
        center = { "X": shadow.X, "Y": shadow.Y};
    }
    let initialCenter = center;
    let position = { "X": 0, "Y": 0};
    let adjust = { "X": 0, "Y": 0};
    let color = {R: 0, G: 0, B: 0, A: 0};
    let theNumber = 0;
    let numberSize = numberNormalSize;
    let numberString = '';
    let showThis = true;
    let inset = 0;

    for (let i = 0; i < 12; i++) {

        showThis = true;
        adjust = { "X": 0, "Y": 0};
        numberSize = numberNormalSize;

        if (numberArabian) {
            inset = numberSize / 1.5;
        } else {
            inset = numberSize / 1.5;
        }

        theNumber = ((i +3) % 12);
        if (i == 9) {
            theNumber = 12;
            adjust.X = - numberSize / 3;
        }

        if (i % 3 == 0) {
            // Quarter on 3 / 6 / 9 / 12
            color.R = faceProminentTickColor.R;
            color.G = faceProminentTickColor.G;
            color.B = faceProminentTickColor.B;
            color.A = faceProminentTickColor.A;
            inset += faceProminentTickLineInset;
        } else {
            // 5er on 5 / 10 / 20 / 25 / 35 / 40 / 50 / 55
            color.R = faceTickColor.R;
            color.G = faceTickColor.G;
            color.B = faceTickColor.B;
            color.A = faceTickColor.A;
            showThis = !onlyQuarters;
            inset += faceTickLineInset;
            if (othersSmall) {
                numberSize = numberSmallSize;
            }
        }

        if (numberArabian) {
            center = { "X": initialCenter.X + (-1 * (numberSize / 3)), "Y": initialCenter.Y + ((numberSize / 3))};
        } else {
            center = { "X": initialCenter.X + (-1 * (numberSize / 1.9)), "Y": initialCenter.Y + ((numberSize / 3))};
        }

        position.X = (faceDialLineTickRadius - inset) * Math.cos (i * Math.PI / 6) + adjust.X + center.X
        position.Y = (faceDialLineTickRadius - inset) * Math.sin (i * Math.PI / 6) + adjust.Y + center.Y;

        if (numberArabian) {
            numberString = '' + theNumber + '';
        } else {
            switch (theNumber) {
                case 1:
                    numberString = 'I';
                    break;
                case 2:
                    numberString = 'II';
                    break;
                case 3:
                    numberString = 'III';
                    break;
                case 4:
                    numberString = 'IV';
                    break;
                case 5:
                    numberString = 'V';
                    break;
                case 6:
                    numberString = 'VI';
                    break;
                case 7:
                    numberString = 'VII';
                    break;
                case 8:
                    numberString = 'VIII';
                    break;
                case 9:
                    numberString = 'IX';
                    break;
                case 10:
                    numberString = 'X';
                    break;
                case 11:
                    numberString = 'XI';
                    break;
                case 12:
                    numberString = 'XII';
                    break;                                                                                                                                                                                                                                                                                    }
        }

        if (showThis) {
            clockPrint(cr, position, color, numberFont, numberSize, false, false, numberString)
            cr.stroke();
        }

    }

}

function drawFaceInit(cr) {
    cr.translate(area.width / 2, area.height / 2);
    cr.scale(area.width / 2, area.height / 2);
}

function drawFaceDial(cr) {
    // Face Dial
    const faceDialColor = config.faceDialColor;
    cr.setSourceRGBA (faceDialColor.R, faceDialColor.G, faceDialColor.B, faceDialColor.A);
    cr.arc(0.0, 0.0, 1.0 - 0.05, 0, 2 * Math.PI);
    cr.fill();
}

function drawCenterDial(cr, shadow, shadowColor, castShadow) {
    // Center Dial
    const faceCenterDialRadius = config.faceCenterDialRadius;
    let faceCenterDialColor = config.faceCenterDialColor;
    let center = { "X": 0, "Y": 0}
    if (castShadow) {
        faceCenterDialColor = shadowColor;
        center = { "X": shadow.X, "Y": shadow.Y}
    }
    cr.setSourceRGBA (faceCenterDialColor.R, faceCenterDialColor.G, faceCenterDialColor.B, faceCenterDialColor.A);
    cr.arc(center.X, center.Y, faceCenterDialRadius, 0, 2 * Math.PI);
    cr.fill();    
}

function clockRoundRectangle (cr, position, size, lineWidth, divider, color, filled) {

    let x1 = position.X + size.width / divider;
    let x2 = position.X + (size.width - (size.width / divider));
    let x3 = position.X;
    let x4 = position.X + size.width;

    let y1 = position.Y;
    let y2 = position.Y + size.height / divider;
    let y3 = position.Y + size.height - (size.height / divider);
    let y4 = position.Y + size.height;

    cr.setSourceRGBA (color.R, color.G, color.B, color.A);
    cr.setLineWidth (lineWidth);
    cr.moveTo (x1, y1);
    cr.lineTo (x2, y1);
    cr.curveTo (x4, y1, x4, y1, x4, y2);
    cr.lineTo (x4, y3);
    cr.curveTo (x4, y4, x4, y4, x2, y4);
    cr.lineTo (x1, y4);
    cr.curveTo (x3, y4, x3, y4, x3, y3);
    cr.lineTo (x3, y2);
    cr.curveTo (x3, y1, x3, y1, x1, y1);
    if (filled) {
        cr.fill ();
    } else {
        cr.stroke ();
    }
}

function clockPrint (cr, position, color, font, size, italic, bold, text) {
    /*
      const Cairo = imports.cairo;
      Cairo.FontSlant.ITALIC
      Cairo.FontSlant.NORMAL
      Cairo.FontSlant.OBLIQUE
      Cairo.FontWeight.NORMAL
      Cairo.FontWeight.BOLD
      Standard CSS2 generic family names, ("serif", "sans-serif", "cursive", "fantasy", "monospace"), are likely to work as expected.
       Generic CSS family names
        font-family: serif;
        font-family: sans-serif;
        font-family: monospace;
        font-family: cursive;
        font-family: fantasy;
        font-family: system-ui;
        font-family: ui-serif;
        font-family: ui-sans-serif;
        font-family: ui-monospace;
        font-family: ui-rounded;
        font-family: emoji;
        font-family: math;
        font-family: fangsong;
    */
    // Depending on local availability those might also work `fc-list | sed 's/.*:\(.*,\|\s\)\(.*\):.*/\2/'`
    //
    // As of 01.2022 cr.textExtents() does not seem to be implemented in GJS...
    //
    let mySlant = Cairo.FontSlant.NORMAL;
    let myWeight = Cairo.FontWeight.NORMAL;
    if (italic) {
        mySlant = Cairo.FontSlant.ITALIC;
    }
    if (bold) {
        myWeight = Cairo.FontWeight.BOLD;
    }
    if (font == '') {
        font = 'sans-serif'
    }
    cr.moveTo(position.X, position.Y);
    cr.setSourceRGBA (color.R, color.G, color.B, color.A);
    cr.selectFontFace(font, mySlant, myWeight);
    cr.setFontSize(size);
    cr.showText('' + text + '');
    cr.stroke();

}

function clockGetTime() {
    let clockTime = {};
    let now = GLib.DateTime.new_now_local()
    //
    clockTime.nowHour = now.format("%H") % 12;
    clockTime.nowHourDegrees = clockTime.nowHour * Math.PI / 6;
    clockTime.nowMinute = now.format("%M") / 1;
    clockTime.nowMinuteDegrees = clockTime.nowMinute * Math.PI / 30;
    clockTime.nowSecond = now.format("%S") / 1;
    clockTime.nowSecondDegrees = clockTime.nowSecond * Math.PI / 30;
    Common.myDebugLog(JSON.stringify(clockTime));
    return clockTime;
}

function readSettings() {
    Common.myDebugLog('Entering readSettings()');
    let theSettings = {};
    //
    try {
        Common.myDebugLog('Reading Settings (\'' + schemaid + '\')');
        //
        if (Common.debugLogging != settings.get_boolean("debuglogging")) {
            Common.debugLogging = settings.get_boolean("debuglogging");
            let myLogging = "off!";
            if (Common.debugLogging) {
                myLogging = "on!";
            }
            Common.myLog('Debug Logging is now ' + myLogging);
        }
        //
        theSettings.clockStyle = settings.get_string("clockstyle");
        theSettings.clockPosition = settings.get_string("clockposition");
        //
        theSettings.trackFullscreen = settings.get_boolean("trackfullscreen");
        theSettings.clockWidth = settings.get_int("clockwidth");
        theSettings.clockHeight = settings.get_int("clockheight");
        theSettings.marginTop = settings.get_int("margintop");
        theSettings.marginSide = settings.get_int("marginside");
        //
        theSettings.faceDialColor = {"R": settings.get_double("facedialcolor-r"), "G": settings.get_double("facedialcolor-g"), "B": settings.get_double("facedialcolor-b"), "A": settings.get_double("facedialcolor-a")};
        //
        theSettings.faceCenterDialRadius = settings.get_double("facecenterdialradius");
        theSettings.faceCenterDialColor = {"R": settings.get_double("facecenterdialcolor-r"), "G": settings.get_double("facecenterdialcolor-g"), "B": settings.get_double("facecenterdialcolor-b"), "A": settings.get_double("facecenterdialcolor-a")};
        //
        theSettings.faceDialLineWidth = settings.get_double("facediallinewidth");
        theSettings.faceDialLineInset = settings.get_double("facediallineinset");
        theSettings.faceDialLineColor = {"R": settings.get_double("facediallinecolor-r"), "G": settings.get_double("facediallinecolor-g"), "B": settings.get_double("facediallinecolor-b"), "A": settings.get_double("facediallinecolor-a")};
        theSettings.faceDialLineTickInset = settings.get_double("facediallinetickinset");
        //
        theSettings.faceMinuteTickLineWidth = settings.get_double("faceminuteticklinewidth");
        theSettings.faceMinuteTickLineInset = settings.get_double("faceminuteticklineinset");
        theSettings.faceMinuteTickCircle = settings.get_boolean("faceminutetickcircle");
        theSettings.faceMinuteTickOuterCircle = settings.get_boolean("faceminutetickoutercircle");
        theSettings.faceMinuteTickColor = {"R": settings.get_double("faceminutetickcolor-r"), "G": settings.get_double("faceminutetickcolor-g"), "B": settings.get_double("faceminutetickcolor-b"), "A": settings.get_double("faceminutetickcolor-a")};
        //
        theSettings.faceTickLineWidth = settings.get_double("faceticklinewidth");
        theSettings.faceTickLineInset = settings.get_double("faceticklineinset");
        theSettings.faceTickCircle = settings.get_boolean("facetickcircle");
        theSettings.faceTickOuterCircle = settings.get_boolean("facetickoutercircle");
        theSettings.faceTickColor = {"R": settings.get_double("facetickcolor-r"), "G": settings.get_double("facetickcolor-g"), "B": settings.get_double("facetickcolor-b"), "A": settings.get_double("facetickcolor-a")};
        //
        theSettings.faceProminentTickLineWidth = settings.get_double("faceprominentticklinewidth");
        theSettings.faceProminentTickLineInset = settings.get_double("faceprominentticklineinset");
        theSettings.faceProminentTickCircle = settings.get_boolean("faceprominenttickcircle");
        theSettings.faceProminentTickOuterCircle = settings.get_boolean("faceprominenttickoutercircle");
        theSettings.faceProminentTickColor = {"R": settings.get_double("faceprominenttickcolor-r"), "G": settings.get_double("faceprominenttickcolor-g"), "B": settings.get_double("faceprominenttickcolor-b"), "A": settings.get_double("faceprominenttickcolor-a")};
        //
        theSettings.faceHourHandLineWidth = settings.get_double("facehourhandlinewidth");
        theSettings.faceHourHandLineLength = settings.get_double("facehourhandlinelength");
        theSettings.faceHourHandColor = {"R": settings.get_double("facehourhandcolor-r"), "G": settings.get_double("facehourhandcolor-g"), "B": settings.get_double("facehourhandcolor-b"), "A": settings.get_double("facehourhandcolor-a")};
        theSettings.faceHourHandFilled = settings.get_boolean("facehourhandfilled");
        theSettings.faceHourHandEyed = settings.get_boolean("facehourhandeyed");
        theSettings.faceHourHandTailed = settings.get_boolean("facehourhandtailed");
        theSettings.faceHourHandFinned = settings.get_boolean("facehourhandfinned");
        //
        theSettings.faceMinuteHandLineWidth = settings.get_double("faceminutehandlinewidth");
        theSettings.faceMinuteHandLineLength = settings.get_double("faceminutehandlinelength");
        theSettings.faceMinuteHandColor = {"R": settings.get_double("faceminutehandcolor-r"), "G": settings.get_double("faceminutehandcolor-g"), "B": settings.get_double("faceminutehandcolor-b"), "A": settings.get_double("faceminutehandcolor-a")};
        theSettings.faceMinuteHandFilled = settings.get_boolean("faceminutehandfilled");
        theSettings.faceMinuteHandEyed = settings.get_boolean("faceminutehandeyed");
        theSettings.faceMinuteHandTailed = settings.get_boolean("faceminutehandtailed");
        theSettings.faceMinuteHandFinned = settings.get_boolean("faceminutehandfinned");
        //
        theSettings.faceSecondHandLineWidth = settings.get_double("facesecondhandlinewidth");
        theSettings.faceSecondHandLineLength = settings.get_double("facesecondhandlinelength");
        theSettings.faceSecondHandColor = {"R": settings.get_double("facesecondhandcolor-r"), "G": settings.get_double("facesecondhandcolor-g"), "B": settings.get_double("facesecondhandcolor-b"), "A": settings.get_double("facesecondhandcolor-a")};
        theSettings.faceSecondHandFilled = settings.get_boolean("facesecondhandfilled");
        theSettings.faceSecondHandEyed = settings.get_boolean("facesecondhandeyed");
        theSettings.faceSecondHandTailed = settings.get_boolean("facesecondhandtailed");
        theSettings.faceSecondHandFinned = settings.get_boolean("facesecondhandfinned");
        //
        theSettings.faceShadowOffsetX = settings.get_double("faceshadowoffsetx");
        theSettings.faceShadowOffsetY = settings.get_double("faceshadowoffsety");
        theSettings.faceShadowHand = settings.get_boolean("faceshadowhand");
        theSettings.faceShadowTick = settings.get_boolean("faceshadowtick");
        theSettings.faceShadowNumber = settings.get_boolean("faceshadownumber");
        theSettings.faceShadowColor = {"R": settings.get_double("faceshadowcolor-r"), "G": settings.get_double("faceshadowcolor-g"), "B": settings.get_double("faceshadowcolor-b"), "A": settings.get_double("faceshadowcolor-a")};
        //
        Common.myDebugLog('readSettings - theSettings: ' + JSON.stringify(theSettings));
    } catch (e) {
        Common.myErrorLog(e, 'readSettings');
    }
    //
    Common.myDebugLog('Exiting readSettings()');
    return theSettings;
}

function test() {
    let myLayoutManager = Main.layoutManager;

    Common.myLog('Display: Test Monitor Output...');
    Common.myLog('Display: Primary Monitor ' + myLayoutManager.primaryMonitor.index);
    //Common.myLog('Display: ' + JSON.stringify(myLayoutManager.primaryMonitor, null, 2));
    Common.myLog('Display: Current Monitor ' + myLayoutManager.currentMonitor.index);
    //Common.myLog('Display: ' + JSON.stringify(myLayoutManager.currentMonitor, null, 2));
    Common.myLog('Display: Monitors');
    Common.myLog('Display: ' + JSON.stringify(myLayoutManager.monitors, null, 2));
    Common.myLog('Display: Iterating each Monitor');
    for (let myMonitor in myLayoutManager.monitors) {
        Common.myLog('Display(' + myMonitor + '): ' + JSON.stringify(myLayoutManager.monitors[myMonitor], null, 2));
    }
    Common.myLog('Display: ...');

    /*
    dbus_test();
    */

    windowTest();

}

function dbus_test() {

    const XML_INTERFACE =
        '<node>\
            <interface name="org.gnome.Mutter.DisplayConfig">\
                <method name="GetCurrentState">\
                <arg name="serial" direction="out" type="u" />\
                <arg name="monitors" direction="out" type="a((ssss)a(siiddada{sv})a{sv})" />\
                <arg name="logical_monitors" direction="out" type="a(iiduba(ssss)a{sv})" />\
                <arg name="properties" direction="out" type="a{sv}" />\
                </method>\
                <signal name="MonitorsChanged" />\
            </interface>\
        </node>';

    const ProxyWrapper = Gio.DBusProxy.makeProxyWrapper(XML_INTERFACE);
    
    let monitorsConfigProxy = ProxyWrapper(
        Gio.DBus.session,
        "org.gnome.Mutter.DisplayConfig",
        "/org/gnome/Mutter/DisplayConfig"
    );

    function resourceCallback(resource, err) {
        if (err) {
            Common.myLog('resourceCallback.err: ' + JSON.stringify(err));
            logError(err);
            return;
        }
        //Common.myLog('resourceCallback.resource: ' + JSON.stringify(resource));

        const [_serial, monitors, logicalMonitors] = resource;
        let index = 0;
        for (const monitor of monitors) {
            const [monitorSpecs, _modes, props] = monitor;
            const [connector, vendor, product, serial] = monitorSpecs;

            //
            //Common.myLog('resourceCallback.resource.monitors[' + index + ']: ' + JSON.stringify(monitor));
            //
            Common.myLog('resourceCallback.resource.monitors[' + index + '].connector: ' + JSON.stringify(connector));
            Common.myLog('resourceCallback.resource.monitors[' + index + '].vendor: ' + JSON.stringify(vendor));
            Common.myLog('resourceCallback.resource.monitors[' + index + '].product: ' + JSON.stringify(product));
            Common.myLog('resourceCallback.resource.monitors[' + index + '].serial: ' + JSON.stringify(serial));
            Common.myLog('resourceCallback.resource.monitors[' + index + '].displayName: ' + JSON.stringify(props['display-name'].unpack()));
            index++;

        }

        index = 0;
        let indey = 0;
        for (const logicalMonitor of logicalMonitors) {
            const [_x, _y, _scale, _transform, isPrimary, monitorsSpecs] =
                logicalMonitor;

            Common.myLog('resourceCallback.resource.logicalMonitors[' + index + '].isPrimary: ' + JSON.stringify(isPrimary));
            
            for (const monitorSpecs of monitorsSpecs) {
                const [connector, vendor, product, serial] = monitorSpecs;
                Common.myLog('resourceCallback.resource.logicalMonitors[' + index + '].monitorsSpecs[' + indey + '].connector: ' + JSON.stringify(connector));
                Common.myLog('resourceCallback.resource.logicalMonitors[' + index + '].monitorsSpecs[' + indey + '].vendor: ' + JSON.stringify(vendor));
                Common.myLog('resourceCallback.resource.logicalMonitors[' + index + '].monitorsSpecs[' + indey + '].product: ' + JSON.stringify(product));
                Common.myLog('resourceCallback.resource.logicalMonitors[' + index + '].monitorsSpecs[' + indey + '].serial: ' + JSON.stringify(serial));   
               indey++;
            }
            index++;

        }        

        Common.myLog('resourceCallback: ...');
    }

    monitorsConfigProxy.GetCurrentStateRemote(resourceCallback);
    Common.myLog('monitorsConfigProxy: ...');

}

function windowTest() {
    let myResult = false;
    const myMonitor = Main.layoutManager.primaryMonitor.index;
    const myWorkspace = global.workspace_manager.get_active_workspace_index();
    let windows = global.get_window_actors();

    let clockBox = { x1:0, y1:0, x2: 0, y2:0};
    clockBox.x1 = area.get_position()[0];
    clockBox.y1 = area.get_position()[1];
    clockBox.x2 = clockBox.x1 + area.width;
    clockBox.y2 = clockBox.y1 + area.height;
    let test = false;

    //Common.myLog('windowTest.windows.length: ' + windows.length);
    if (windows.length > 0) {
        for (let i = windows.length - 1; i >= 0; i--) {
            let meta_win = windows[i].get_meta_window();
            //Common.myLog('windowTest.windows[' + i + '].meta_win.get_wm_class: ' + meta_win.get_wm_class());
            if (myMonitor == meta_win.get_monitor()) {
                //Common.myLog('windowTest.windows[' + i + ']: Same as myMonitor');
                if (meta_win.get_workspace().index() == myWorkspace) {
                    //Common.myLog('windowTest.windows[' + i + ']: Same as myWorkspace');
                    switch (meta_win.get_window_type()) {
                        case 0:
                            // META_WINDOW_NORMAL
                        case 1:
                            // META_WINDOW_DESKTOP
                        case 2:
                            // META_WINDOW_DOCK
                        case 3:
                            // META_WINDOW_DIALOG
                        case 4:
                            // META_WINDOW_MODAL_DIALOG
                        case 5:
                            // META_WINDOW_TOOLBAR
                        case 6:
                            // META_WINDOW_MENU
                        case 7:
                            // META_WINDOW_UTILITY
                            //Common.myLog('windowTest.windows[' + i + ']: Should be checked for overlapping...');
                            //Common.myLog('windowTest.windows[' + i + '].meta_win.get_wm_class: ' + meta_win.get_wm_class());
                            //Common.myLog('windowTest.windows[' + i + '].meta_win.get_window_type: ' + meta_win.get_window_type());
                            let rect = meta_win.get_frame_rect();
                            //Common.myLog('windowTest.windows[' + i + '].meta_win.get_frame_rect(x,y width, height): ' + rect.x + ',' + rect.y + ',' + rect.width + ',' + rect.height);
                            test = (rect.x < clockBox.x2) &&
                                (rect.x + rect.width > clockBox.x1) &&
                                (rect.y < clockBox.y2) &&
                                (rect.y + rect.height > clockBox.y1);
                            if (test) {
                                //Common.myLog('windowTest.windows[' + i + '].meta_win.get_wm_class: ' + meta_win.get_wm_class() + ' is overlapping...');
                                myResult = true;
                            }
                            break;
                        default:
                            //Common.myLog('windowTest.windows[' + i + ']: Is irrelevant...');
                            break;
                    }

                } else {
                    //Common.myLog('windowTest.windows[' + i + ']: Is on other Workspace');
                }
            } else {
                //Common.myLog('windowTest.windows[' + i + ']: Is on other Monitor');
            }
        }
    }

    //Common.myLog('windowTest: ...');
    return myResult;
}