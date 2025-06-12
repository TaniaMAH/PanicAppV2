const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration para PanicApp con soporte Web3
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    alias: {
      'crypto': 'react-native-crypto',
      'stream': 'stream-browserify',
      'buffer': 'buffer',
    },
    // Soporte para dependencias de node
    extraNodeModules: {
      'crypto': require.resolve('react-native-crypto'),
      'stream': require.resolve('stream-browserify'),
      'buffer': require.resolve('buffer'),
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);