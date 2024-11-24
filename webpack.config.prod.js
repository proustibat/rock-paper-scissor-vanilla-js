const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: false
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: 'img', to: 'img' },
        { from: 'css', to: 'css' },
        { from: 'fonts', to: 'fonts' },
        { from: 'js/vendor', to: 'js/vendor' },
        { from: 'apple-touch-icon.png', to: 'apple-touch-icon.png' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'favicon-16x16.png', to: 'favicon-16x16.png' },
        { from: 'favicon-32x32.png', to: 'favicon-32x32.png' },
        { from: 'rock-paper-scissors.png', to: 'rock-paper-scissors.png' },
        { from: 'robots.txt', to: 'robots.txt' },
        { from: '404.html', to: '404.html' },
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'js/serviceworker.js', to: 'js/serviceworker.js' },
        { from: 'js/utils.js', to: 'js/utils.js' },
        { from: 'js/refs.js', to: 'js/refs.js' },
        { from: 'js/pwa-installation.js', to: 'js/pwa-installation.js' },
      ],
    }),
  ],
});
