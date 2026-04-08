module.exports = function (api) {
  const platform = api.caller((c) => c?.platform);
  const isWeb = platform === 'web';

  api.cache.using(() => `babel-${platform}`);

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          reanimated: isWeb ? false : undefined,
        },
      ],
    ],
    plugins: isWeb ? [] : ['react-native-reanimated/plugin'],
  };
};
