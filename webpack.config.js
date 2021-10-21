const path = require("path");

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "development",

  entry: "./src/main.tsx",

  module: {
    rules: [
      {
        // 拡張子 .ts, .tsx を変換する
        test: /\.tsx?$/,
        // TypeScript をコンパイルする
        use: "ts-loader",
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
};
