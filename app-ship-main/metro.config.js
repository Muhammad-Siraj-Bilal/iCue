// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);
config.resolver.sourceExts.push('cjs');
// Expo Go + Firebase Auth can resolve the wrong export target when package
// exports are enabled, which leads to "Component auth has not been registered yet".
config.resolver.unstable_enablePackageExports = false;

// Optional lightningcss platform binaries not installed on Windows crash Metro's watcher
const lightningcssPlatformBlock = /node_modules[\\/]lightningcss-(darwin|linux|freebsd|android)-/;
const existingBlockList = config.resolver.blockList;
config.resolver.blockList = Array.isArray(existingBlockList)
  ? [...existingBlockList, lightningcssPlatformBlock]
  : existingBlockList
    ? [existingBlockList, lightningcssPlatformBlock]
    : [lightningcssPlatformBlock];

module.exports = config;
