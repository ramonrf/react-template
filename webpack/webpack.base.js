/* eslint-disable comma-dangle */

const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

const enableWebpackBundlerAnalyzer = process.env.ENABLE_BUNDLE_ANALYZER ? 'server' : 'disabled';

const extractCss = process.env.NODE_ENV !== 'development';
const minimizeCss = process.env.NODE_ENV !== 'development';

const ExtractTextWebpackPluginInstance = new ExtractTextWebpackPlugin({
  filename: 'bundle__[md5:contenthash:hex:7].css',
  disable: !extractCss
});

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    sourceMap: true,
    plugins: () => [
      autoprefixer
    ]
  }
};

const config = {
  entry: {
    bundle: './src/index.jsx',
  },
  output: {
    filename: '[name]__[chunkhash:7].js',
    chunkFilename: '[name]__[chunkhash:7].js',
    path: path.resolve('dist'),
    publicPath: '/'
  },
  optimization: {
    runtimeChunk: true,
    // splitChunks: {
    //   chunks: 'all'
    // }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: path.resolve('src')
      },
      {
        test: /\.jsx$/,
        use: 'babel-loader',
        include: path.resolve('src')
      },
      // Loads all CSS related to components. Uses CSS Modules
      {
        test: /\.scss$/,
        use: ExtractTextWebpackPluginInstance.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
                sourceMap: true,
                minimize: minimizeCss,
                localIdentName: '[name]--[local]'
              }
            },
            postcssLoader,
            {
              loader: 'resolve-url-loader'
            },
            {
              loader: 'sass-loader?sourceMap'
            }
          ]
        }),
        include: path.resolve('src'),
        exclude: path.resolve('src', 'styles')
      },
      // Loads all Bootstrap CSS. Disabled CSS Modules
      {
        test: /\.scss$/,
        use: ExtractTextWebpackPluginInstance.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: false,
                sourceMap: true,
                minimize: minimizeCss,
              }
            },
            postcssLoader,
            {
              loader: 'sass-loader'
            }
          ]
        }),
        include: path.resolve('src', 'styles')
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body'
    }),
    ExtractTextWebpackPluginInstance,
    new BundleAnalyzerPlugin({
      analyzerMode: enableWebpackBundlerAnalyzer
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    symlinks: false
  }
};

module.exports = config;
