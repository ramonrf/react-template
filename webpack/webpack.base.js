/* eslint-disable comma-dangle */

const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const postCssImport = require('postcss-import');
const postCssCssNext = require('postcss-cssnext');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const enableWebpackBundlerAnalyzer = process.env.ENABLE_BUNDLE_ANALYZER ? 'server' : 'disabled';

const extractCss = process.env.NODE_ENV !== 'development';
const minimizeCss = process.env.NODE_ENV !== 'development';

const ExtractTextWebpackPluginInstance = new ExtractTextWebpackPlugin({
  filename: 'bundle__[contenthash:7].css',
  disable: !extractCss
});

const config = {
  entry: './src/index.jsx',
  output: {
    filename: 'bundle__[hash:7].js',
    path: path.resolve('dist'),
    publicPath: '/'
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
      {
        test: /\.css$/,
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
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [
                  postCssImport(),
                  postCssCssNext()
                ]
              }
            }
          ]
        }),
        include: path.resolve('src')
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]__[hash:7].[ext]'
            }
          },
        ],
        include: path.resolve('src')
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]__[hash:7].[ext]'
            }
          },
        ],
        include: path.resolve('src')
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
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
