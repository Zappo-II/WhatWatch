#!/bin/bash
#
#* 
#* Visit https://github.com/Zappo-II/WhatWatch for 
#* LICENSE and documentation
#* 
#
theVersion="$(echo $(grep '"version"' metadata.json | cut -f 2 -d ':' | cut -f 1 -d ','))"
theZip="$(grep "uuid" metadata.json | cut -f 4 -d '"').V.${theVersion}.zip"

echo " "
echo "Create ${theZip} for this gnome-shell-extension..."
echo " "

if [ -f "${theZip}" ]; then
    echo "Remove: ${theZip}"
    rm "${theZip}"
fi

theDirs="schemas"
theFiles="common.js extension.js LICENSE metadata.json prefs.js stylesheet.css"
zip -r ${theZip} ${theDirs} ${theFiles}

zip -Tv ${theZip}

echo "Done."