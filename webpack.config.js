const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require('glob');

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: './assets/js/bundle/bundle.js', // 스크립트 파일 경로
  },
  resolve: {
    alias: {
      "@scss": path.resolve(__dirname, "./resources/scss"),
      "@js": path.resolve(__dirname, "./resources/js"),
    }
  },
  stats: {
    children: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        exclude: /node_modules/,
        include: path.resolve(__dirname, "./resources/scss"),
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: false,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        exclude: /node_modules/,
        include: path.resolve(__dirname, "./resources/fonts"),
        generator: {
          filename: "./resources/fonts/[name][ext]"
        }
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./html/guide/index.html",
      // filename: './html/guide/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: './resources/css/guide_css.css'
    }),
    ...glob.sync('./html/guide/layout/*.html').map((filePath) => {
      return new HtmlWebpackPlugin({
        template: filePath,
        filename: path.basename(filePath), // 파일명을 기반으로 설정
      });
    }),
    
  ],
  optimization: {
    minimize: false,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 9000,
    open: true,
  },
};
