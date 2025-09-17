const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const version = pkg.version;

// === ANDROID ===
try {
  const gradlePath = path.join(__dirname, '../android/app/build.gradle');
  let gradle = fs.readFileSync(gradlePath, 'utf8');
  gradle = gradle.replace(/versionName ".*"/, `versionName "${version}"`);
  fs.writeFileSync(gradlePath, gradle, 'utf8');
  console.log(`✔ Android versionName ustawione na ${version}`);
} catch (err) {
  console.warn("⚠ Nie udało się zaktualizować Android build.gradle:", err.message);
}

// === iOS ===
try {
  const plistPath = path.join(__dirname, '../ios/App/App/Info.plist');
  let plist = fs.readFileSync(plistPath, 'utf8');
  plist = plist.replace(
    /<key>CFBundleShortVersionString<\/key>\s*<string>.*<\/string>/,
    `<key>CFBundleShortVersionString</key><string>${version}</string>`
  );
  fs.writeFileSync(plistPath, plist, 'utf8');
  console.log(`✔ iOS CFBundleShortVersionString ustawione na ${version}`);
} catch (err) {
  console.warn("⚠ Nie udało się zaktualizować iOS Info.plist:", err.message);
}
