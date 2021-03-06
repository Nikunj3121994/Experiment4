import webpack from 'webpack';

import defaultConfig from './default';

export default {
  ...defaultConfig,
  plugins: [
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
    }),
  ],
};
