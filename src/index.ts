import { printConsoleMessage } from "./print";

function component() {
  const content = document.createElement("div");
  const message = document.createElement("div");
  const button = document.createElement("button");
  // Lodash, currently included via a script, is required for this line to work
  message.innerHTML = ["Hello", "webpack"].join(" ");

  button.innerHTML = "Click Button";
  button.onclick = () => printConsoleMessage("click!");

  content.appendChild(message);
  content.appendChild(button);

  return content;
}

document.body.appendChild(component());
