#!/bin/bash
#
#* 
#* Visit https://github.com/Zappo-II/WhatWatch for 
#* LICENSE and documentation
#* 
#
installPath="$(echo ~/.local/share/gnome-shell/extensions/)"
installDir="$(grep "uuid" metadata.json | cut -f 4 -d '"')"
theVersion="$(echo $(grep '"version"' metadata.json | cut -f 2 -d ':' | cut -f 1 -d ','))"
theZip="${installDir}.V.${theVersion}.zip"
gettextDomain="$(grep "gettext-domain" metadata.json | cut -f 4 -d '"')"
settingsSchema="$(grep "settings-schema" metadata.json | cut -f 4 -d '"')"

echo " "
echo "Pack for release and install this gnome-shell-extension to ${installPath}${installDir}"
echo " "

if [ ! -e "$(which xgettext)" ]; then
  echo "WARNING: xgettext not found - Unable to create po/${gettextDomain}.pot"
else
  echo "Create: po/${gettextDomain}.pot"
  xgettext --from-code=UTF-8 --output="po/${gettextDomain}.pot" *.js
fi

if [ -f "${installDir}.shell-extension.zip" ]; then
	rm -f "${installDir}.shell-extension.zip"
fi

echo "Create: gnome-extensions pack ${gettextDomain}"
#gnome-extensions pack --force --podir="./po" --gettext-domain="${gettextDomain}" --schema="./schemas/${settingsSchema}.gschema.xml" --extra-source=common.js .
gnome-extensions pack --force --podir="./po" --gettext-domain="${gettextDomain}" --schema="./schemas/gschemas.compiled" --extra-source=common.js .

if [ ! -f "${installDir}.shell-extension.zip" ]; then
	echo "PANIC: gnome-extension pack failed..."
	exit 2
fi

if [ -d "${installPath}${installDir}" ]; then
    echo "Remove: ${installPath}${installDir}"
    rm -r "${installPath}${installDir}" > /dev/null 2>&1
fi

echo "Install: ${installPath}${installDir}"
unzip ${installDir}.shell-extension.zip -d ${installPath}${installDir}

if [ -f "${theZip}" ]; then
    echo "Remove: Old ${theZip}"
    rm "${theZip}"
fi

echo "Create: Release ${theZip} for this gnome-shell-extension..."
cp "${installDir}.shell-extension.zip" "${theZip}"

echo "Complete: ${installPath}${installDir}"
find ${installPath}${installDir} -type f

echo "Done."
