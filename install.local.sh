#!/bin/bash
#
#* 
#* Visit https://github.com/Zappo-II/WhatWatch for 
#* LICENSE and documentation
#* 
#

installPath="$(echo ~/.local/share/gnome-shell/extensions/)"
installDir="$(grep "uuid" metadata.json | cut -f 4 -d '"')/"

echo " "
echo "Install this gnome-shell-extension to ${installPath}${installDir}"
echo " "

if [ ! -d "${installPath}${installDir}" ]; then
    echo "Create: ${installPath}${installDir}"
    mkdir -p "${installPath}${installDir}"
else
    echo "Remove: ${installPath}${installDir}*"
    rm -r "${installPath}${installDir}*" > /dev/null 2>&1
fi

theDirs="schemas"
for myDir in ${theDirs}; do
    echo "CopyDir: ${myDir} to ${installPath}${installDir}"
    cp -r ${myDir} "${installPath}${installDir}"
done

theFiles="common.js extension.js LICENSE metadata.json prefs.js stylesheet.css"
for myFile in ${theFiles}; do
    echo "CopyFile: ${myFile} to ${installPath}${installDir}"
    cp ${myFile} "${installPath}${installDir}"
done

echo "Done."