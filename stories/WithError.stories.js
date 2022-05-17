import React from "react";

export default {
  title: 'Example/Errors',
  // component: ErrorTwo,
};

export const DivInsideSpan = (_args) => (
  <span><div>ErrorOne</div></span>
)

export const ButtonInsideInput = (_args) => (
  <input>ErrorTwo: Button inside input<button>button</button></input>
)


