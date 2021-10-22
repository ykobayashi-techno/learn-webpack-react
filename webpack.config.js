const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development",
  // tsファイルをChromeのDevToolsでデバッグするための指定
  devtool: "inline-source-map",
  entry: "./src/main.tsx",

  module: {
    rules: [
      {
        // 拡張子 .ts, .tsx を変換する
        test: /\.tsx?$/,
        // TypeScript をコンパイルする
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
              plugins: ["@babel/plugin-transform-runtime"],
            },
          },
        ],
      },
    ],
  },

  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    // 拡張子を配列で指定。import時拡張子を省略できる
    extensions: [".ts", ".tsx", ".js", ".json"],
  },

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
    }),
  ],
};
