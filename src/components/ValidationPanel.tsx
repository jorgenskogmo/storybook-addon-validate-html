
import React, {useState, useEffect} from "react";
import { useAddonState } from "@storybook/api";
import ReactSyntaxHighlighter from 'react-syntax-highlighter';
import { docco as theme } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { format as prettierFormat } from 'prettier/standalone';
import prettierHtml from 'prettier/parser-html';

// console.log(theme)

theme['hljs'] = {
  fontSize: '0.75rem',
  lineHeight: '1rem',
  'width': 'calc(100% - 20px)',
  'marginLeft': '10px',
  overflow: 'auto',
}

theme['hljs-comment'] = {
  color: 'rgb(163 0 0)',
  background: 'rgb(255 240 227)',
  padding: '2px 0px',
}

const themeFull = JSON.parse(JSON.stringify(theme));

themeFull['hljs'] = {
  ...themeFull['hljs'],
  background: '#f7f6f6',
}

const HTMLHEAD = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>component</title>
  </head>
  <body>
`;

const HTMLFOOT = `
</body></html>`

const FETCH_CONFIG = {
  method: 'POST',
  // mode: 'cors', // no-cors, *cors, same-origin
  // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  // credentials: 'same-origin', // include, *same-origin, omit
  headers: {
    // 'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Type': 'text/html; charset=utf-8',
  },
  // redirect: 'follow', // manual, *follow, error
  // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  // body: JSON.stringify(data) // body data type must match "Content-Type" header
  // body: str
};


const prettierConfig = {
  // htmlWhitespaceSensitivity: "ignore",
  parser: 'html',
  plugins: [prettierHtml],
};

export type ValidationPanelProps = {
  html?: string,
  wrap?: boolean,
}

type messageType = {
  type?: string,
  lastLine?: number,
  lastColumn?: number,
  firstColumn?: number,
  message?: string,
}

type resultType = {
  messages?: messageType[]
}

const sortResults = (a: messageType, b: messageType): number => {
  if (!a.lastLine || !b.lastLine) {
    return 0;
  }

  if (a.lastLine < b.lastLine) {
    return -1;
  }

  if (a.lastLine > b.lastLine) {
    return 1;
  }

  return 0;
};

const cleanMessage = (msg: string) => {
  if( !msg ) return msg;
  return msg
    .replace('”', '"')
    .replace('“', '"')
    // .slice(0, -1)
}

export const ValidationPanel: React.FC<ValidationPanelProps> = (props) => {

  const {
    html: htmlProp = "<div>lorem ipsum</span>",
    wrap: wrapProp = true,
  } = props;

  // console.log('ValidationPanel props', props)

  const source = wrapProp ? `${HTMLHEAD}${htmlProp}${HTMLFOOT}` : htmlProp;

  const [resultHtml, setResultHtml] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [prevSource, setPrevSource] = useAddonState<string>('');

  useEffect( () => {
    async function fetchData() {
      console.log('checking...', source)
      setMessage('Validating...')
      setResultHtml('')


      const formattedSource = prettierFormat(source, prettierConfig);

      const op = await fetch(`https://validator.w3.org/nu/?out=json`, {...FETCH_CONFIG, body: formattedSource});
      const results = await op.json();
      setResultHtml( formatResults(formattedSource, results) );
    }

    // console.log( source, prevSource, (source === prevSource) )

    setPrevSource(source);

    if(source !== prevSource){
      fetchData();
    }
  }, [source]);

  const formatResults = (source:string, results:resultType) => {
    // console.log('validator results:', results)

    const linesOffset = 1;
    const unwrapped = source;
    // const linesOffset = HTMLHEAD.split("\n").length;
    // const unwrapped = source.replace(HTMLHEAD, '').replace(HTMLFOOT, '');
    
    const sourceLines = unwrapped.split("\n");
    const messages = results.messages?.sort(sortResults);

    const numErrors = messages?.length || 0;
    setMessage(`Found ${numErrors} validation errors`);

    let htmlLines = [''];
    sourceLines.forEach( (line, index) => {
      htmlLines.push(line);

      messages?.forEach( (msg:messageType) => {
        const messageLine = msg.lastLine ?  msg.lastLine - linesOffset : -1;
        if( msg.type === 'error' && messageLine === index ){
          htmlLines.push(`<!-- ${msg.type}: ${cleanMessage(msg.message || '')} -->`);
        }
      });
    });

    const html = htmlLines.join("\n").trim()

    console.log( 'r1', htmlLines )
    console.log( 'r2', html )

    return html;
  }

  return (
    <div>
      <ReactSyntaxHighlighter style={theme}>
        {message}
      </ReactSyntaxHighlighter>

      <ReactSyntaxHighlighter style={themeFull}>
        {resultHtml}
      </ReactSyntaxHighlighter>
    </div>
  )
};

