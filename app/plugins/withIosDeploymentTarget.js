// Force every CocoaPods target — including resource-bundle sub-targets that
// keep their podspec's old minimum (e.g. RNSVG-RNSVGFilters at 12.4,
// RNCAsyncStorage_resources at 13.4) — up to a deployment target the current
// Xcode SDK accepts. expo-build-properties sets the app + Podfile platform, but
// not these generated bundle targets, so xcodebuild rejects them.
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const TARGET = '16.4';
const MARKER = 'post_install do |installer|';
const GUARD = 'KISLINGS_MIN_IOS';

module.exports = function withIosDeploymentTarget(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfile = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfile, 'utf8');

      if (contents.includes(MARKER) && !contents.includes(GUARD)) {
        const inject =
          `${MARKER}\n` +
          `    # ${GUARD}: bump every pod (incl. resource bundles) to a supported min\n` +
          `    installer.pods_project.targets.each do |t|\n` +
          `      t.build_configurations.each do |bc|\n` +
          `        bc.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${TARGET}'\n` +
          `      end\n` +
          `    end`;
        contents = contents.replace(MARKER, inject);
        fs.writeFileSync(podfile, contents);
      }
      return cfg;
    },
  ]);
};
