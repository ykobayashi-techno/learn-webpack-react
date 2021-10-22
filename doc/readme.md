# Webpack使ってReact+TypeScriptの環境を作成する

repo https://github.com/ykobayashi-techno/learn-webpack-react

キャッチアップの為に、React+TypeScriptの環境をWebpackで構築する

これまで、create-react-appでチュートリアルをやっていたがWebpackで一から構築したことはなかったため、Webpackの使用方法について調べる

Webpackとは、jsファイルなどをモジュール式に分割して書いたものをまとめるツール

Webpack公式 https://webpack.js.org/

## 1.簡単な環境でWebpackを使用してビルドする

最初は公式の入門サイトでWebpackの環境準備を行って動作を確かめる

https://webpack.js.org/guides/getting-started/#basic-setup

チュートリアルに沿って、htmlファイル、jsファイルを準備

lodashというライブラリを npm install で入れて、出力を行う

自前でも簡単なモジュールを一つ作ってビルド。htmlを実行して問題なく動作することを確認する


簡単な構成であれば `npx webpack` を行うだけでdistフォルダにまとめたファイルが出力される

> index.js

```js
import _ from "lodash";
import { printConsoleMessage } from "./print";

function component() {
  const content = document.createElement("div");
  const message = document.createElement("div");
  message.innerHTML = _.join(["Hello", "webpack"], " ");

  const button = document.createElement("button");
  button.innerHTML = "Click Button";
  button.onclick = printConsoleMessage;

  content.appendChild(message);
  content.appendChild(button);

  return content;
}

document.body.appendChild(component());
```

> print.js

```js
export function printConsoleMessage(mes) {
  console.log("click!");
}
```

## 2.TypeScriptに対応させる

参考サイト: https://ics.media/entry/16329/

新しくwebpack.config.jsに記述が増えていくので、Webpack公式サイトで調べながら進める

index.tsとprint.tsの拡張しをtsに変更して、print.tsをすこし変更する

```ts
export function printConsoleMessage(mes: string) {
  console.log("click!" + mes);
}
```

webpack.config.jsonは以下のような形

```js
  mode: "development",

  entry: "./src/index.ts",

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js"],
  },
  ```

サイトを参考にtsconfig.jsonを作成

npm run build を行って結果が問題ないことを確認

- modeについて https://webpack.js.org/guides/development/

developmに指定することでSourceMapファイルが出力される。これでChromeでのデバッグ時にソースを見ながらデバッグできるようになるなど。productionの場合は最適化されると書いてあるがよく調べられていない

- modulesについて https://webpack.js.org/concepts/modules/
- loadersについて https://webpack.js.org/concepts/loaders/#example

testに条件を書いて、ローダーを指定する。
ts-loaderをインストールし、指定することでTypeScriptを利用できるようになる。そのほかにもCofeeScriptや、Sassなど色々とmoduleがある。

目的のアプリではts-loaderではなくbabel-loaderを使っているようなので、調べる必要がある

- resolve -> extensionsの設定について https://webpack.js.org/configuration/resolve/#resolveextensions

jsやtsの指定をしておくことで

```js
import * from 'source'
```

と拡張子を省略して表記することができるようになる

## Reactを導入する

- React https://ja.reactjs.org/

Reactのインストール

``` 
npm i -S react react-dom @types/react @types/react-dom
```

webpack.config.jsを編集する

```js
{
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
    // 拡張子を配列で指定
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  .
  .
  .
}
```

主にReact+Typescriptで表記するときに使うtsxファイルが指定されるように編集

tsconfig.jsonは目的のアプリを参考に組む。ts-loaderの場合noEmittedがtrueだとエラーが出るためコメントアウト

tsファイルを以下のようにReactを読むように変更する

main.tsx

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Print } from "./print";

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello React!</h1>
        <Print message_list={["this", "is", "React", "message"]} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector("#app"));
```

print.tsx

```tsx
import * as React from "react";
import _ from "lodash";

// Propsの型定義
interface IPrintProps {
  message_list: Array<string>;
}

interface IPrintState {
  count: number;
}

export class Print extends React.Component<IPrintProps, IPrintState> {
  constructor(props: IPrintProps) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  handleClick() {
    console.log("クリックされました");

    this.setState({
      count: this.state.count + 1,
    });
  }

  render() {
    return (
      <div>
        <h2>Print:</h2>
        <div>{this.state.count}</div>
        <p>{_.join(this.props.message_list, " ")}</p>
        <button onClick={this.handleClick.bind(this)}>Add +1</button>
      </div>
    );
  }
}
```

また、ScriptタグをHeader内に移動させてdeferを付ける

```html
<script defer type="text/javascript" src="./bundle.js"></script>
```

deferを付けると、DOMContendLoadedの直前に呼ばれる

https://developer.mozilla.org/ja/docs/Web/HTML/Element/script#attr-defer

npm buildで無事にReactの環境を構築できた

## キャッチアップのための設定

webpack.config.jsonやtsconging.jsonの設定を変更して目的の環境に近づける

- resolve -> modules https://webpack.js.org/configuration/resolve/#resolvemodules

node_modulesだけではなくsrcフォルダも対象に含める

### babel-loaderを使用する

babel-loaderに切り替える

参考 https://enjoyworks.jp/tech-blog/6889 等

- babel https://babeljs.io/

- babel-loader https://webpack.js.org/loaders/babel-loader/

```
$ npm uninstall ts-loader
$ npm install -sD @babel/core @babel/runtime @babel/plugin-transform-runtime @babel/preset-env @babel/preset-typescript babel-loader
```

webpack.config.jsのmoduleを編集

```js
{
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
}
```

babel-loaderの指定と、optionsの中にreact、typescriptのpresetを設定する

npm run buildで出力されることを確認

### HtmlWebpackPluginを設定する

index.htmlをdistに自動的に配置してくれるので設定を行う。直下にindex.htmlを移動させて指定

```js
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "index.html"),
    }),
  ],
```

### devServerの設定

webpack-dev-serverを使用することでwebpack serveコマンドが使用できるようになり、簡易的にサーバーを立てられるようになって確認しやすくなる

```
npm install -sD webpack-dev-server
```

webpack.config.jsにwebpack-dev-server用の設定を追加

```js
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    //SPA系のWebアプリケーションに必要
    historyApiFallback: true,
  },
```

package.jsonに実行用の設定を追加

```js
  "scripts": {
    .
    .
    "start": "webpack serve",
  },
```

```
npm run start
```

コマンド後、http://localhost:8080/ にアクセスすると実行結果が確認できる。ソースを更新すればその場ですぐ更新される


## まとめなど

まだ設定が足りてないので、調べながら追加する必要がある。
Webpack側も登降園のコンフィグに無い設定などたくさん有るので、もう少し把握をしたい

翻訳にDeepL(https://www.deepl.com/ja/translator)が非常に役に立った

あとReactのドキュメントの新しいものがベータとして公開されているようで、時間をつくってチェックしたい。

- https://beta.reactjs.org/learn