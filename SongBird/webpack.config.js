const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'production',
  entry: {
    main: './index.js',
    // game: './gamePage.js',
    // results: './results.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
  },
  optimization: {
    minimize: !isDev,
    minimizer: [new CssMinimizerPlugin()],
  },
  devServer: {
    port: 4200,
    hot: false,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['main'],
    }),
    // new HtmlWebpackPlugin({
    //   filename: 'results.html',
    //   template: './results.html',
    //   chunks: ['results'],
    // }),
    // new HtmlWebpackPlugin({
    //   filename: 'gamePage.html',
    //   template: './gamePage.html',
    //   chunks: ['game'],
    // }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets'),
          to: path.resolve(__dirname, 'dist/assets'),
          noErrorOnMissing: true,
        },
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', 'postcss-loader'] //MiniCssExtractPlugin.loader
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.mp3$/,
        use: 'file-loader'
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
      // {
      //   test: /\.(ttf|woff|woff2|eot)$/,
      //   use: ['file-loader']
      // }
    ],
  }
};