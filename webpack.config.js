const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");


module.exports = {
  entry: "./src/client/js/main.js",
  plugins: [new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }
  )],
  mode: "development",
  watch: true,
  output: {
    filename: "js/main.js",
    path: path.resolve(__dirname, "assets")
  },
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            targets: "defaults",
            presets: [
              ['@babel/preset-env']
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  }
};
