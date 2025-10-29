// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  // indicates which module webpack should use to begin building out its internal
  entry: "./src/index.js",
  // tells webpack where to emit the bundles it creates and how to name these files
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    clean: true,
  },
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./src/template.html"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};