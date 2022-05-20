import React from 'react';

export const theme: { [key: string]: React.CSSProperties } = {
  "hljs": {
    "display": "block",
    "overflowX": "auto",
    "padding": "0.5em",
    "color": "#000",
    // "background": "#f8f8ff",
    "background": "#f7f6f6",
    //me
    "fontSize": '0.75rem',
    "lineHeight": '1rem',
    "width": 'calc(100% - 20px)',
    "marginLeft": '10px',
    "overflow": 'auto',
  },
  "hljs-comment": {
    // "color": "#408080",
    "fontStyle": "italic",
    // me
    "color": "rgb(163 0 0)",
    "background": "rgb(255 240 227)",
    "padding": "2px 0px",
  },
  "hljs-quote": {
    "color": "#408080",
    "fontStyle": "italic"
  },
  "hljs-keyword": {
    "color": "#954121"
  },
  "hljs-selector-tag": {
    "color": "#954121"
  },
  "hljs-literal": {
    "color": "#954121"
  },
  "hljs-subst": {
    "color": "#954121"
  },
  "hljs-number": {
    "color": "#40a070"
  },
  "hljs-string": {
    "color": "#219161"
  },
  "hljs-doctag": {
    "color": "#219161"
  },
  "hljs-selector-id": {
    "color": "#19469d"
  },
  "hljs-selector-class": {
    "color": "#19469d"
  },
  "hljs-section": {
    "color": "#19469d"
  },
  "hljs-type": {
    "color": "#19469d"
  },
  "hljs-params": {
    "color": "#00f"
  },
  "hljs-title": {
    "color": "#458",
    "fontWeight": "bold"
  },
  "hljs-tag": {
    "color": "#000080",
    "fontWeight": "normal"
  },
  "hljs-name": {
    "color": "#000080",
    "fontWeight": "normal"
  },
  "hljs-attribute": {
    "color": "#000080",
    "fontWeight": "normal"
  },
  "hljs-variable": {
    "color": "#008080"
  },
  "hljs-template-variable": {
    "color": "#008080"
  },
  "hljs-regexp": {
    "color": "#b68"
  },
  "hljs-link": {
    "color": "#b68"
  },
  "hljs-symbol": {
    "color": "#990073"
  },
  "hljs-bullet": {
    "color": "#990073"
  },
  "hljs-built_in": {
    "color": "#0086b3"
  },
  "hljs-builtin-name": {
    "color": "#0086b3"
  },
  "hljs-meta": {
    "color": "#999",
    "fontWeight": "bold"
  },
  "hljs-deletion": {
    "background": "#fdd"
  },
  "hljs-addition": {
    "background": "#dfd"
  },
  "hljs-emphasis": {
    "fontStyle": "italic"
  },
  "hljs-strong": {
    "fontWeight": "bold"
  }
};