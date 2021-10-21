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
