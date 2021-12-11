const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// consts
const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;
// utils
const getFileName = (ext) => isProd ? `bundle.[contenthash].${ext}` : `bundle.${ext}`;
function jsLoaders() {
  const loaders = [
    {
      loader: "babel-loader",
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ];

  if (isDev) {
    loaders[1] = "eslint-loader";
  }
  return loaders;
}

module.exports = {
  context: path.resolve(__dirname, "src"),

  mode: "development",

  entry: ["@babel/polyfill", "./index.js"],

  resolve: {
    extensions: [".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@core": path.resolve(__dirname, "src/core")
    },
  },

  output: {
    filename: getFileName("js"),
    path: path.resolve(__dirname, 'dist'),
  },

  devtool: isDev && "source-map",

  devServer: {
    port: 3000,
    hot: isDev,
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      template: "index.html",
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),

    new CopyPlugin({
      patterns: [
        { context: "", from: path.resolve(__dirname, "src", "favicon.ico"), to: path.resolve(__dirname, "dist") }
      ],
    }),

    new MiniCssExtractPlugin({
      filename: getFileName("css"),
    }),
  ],

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};
