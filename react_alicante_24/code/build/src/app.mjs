// Generated by Melange

import * as Caml_option from "melange.js/caml_option.mjs";
import * as Stdlib__Option from "melange/option.mjs";
import * as React from "react";
import * as Client from "react-dom/client";
import * as JsxRuntime from "react/jsx-runtime";

function App$Say_hello(Props) {
  let name = Props.name;
  return JsxRuntime.jsx("div", {
    children: "Hello, " + (name + "!"),
  });
}

function App$App(Props) {
  return JsxRuntime.jsx("body", {
    children: JsxRuntime.jsx(App$Say_hello, {
      name: "React Alicante",
    }),
  });
}

function main(param) {
  const root = Client.createRoot(
    Stdlib__Option.get(
      Caml_option.nullable_to_opt(document.querySelector("#root")),
    ),
  );
  root.render(
    JsxRuntime.jsx(React.StrictMode, {
      children: JsxRuntime.jsx(App$App, {}),
    }),
  );
}

main(undefined);

export { Say_hello, App, main };
/*  Not a pure module */
