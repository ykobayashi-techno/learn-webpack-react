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
