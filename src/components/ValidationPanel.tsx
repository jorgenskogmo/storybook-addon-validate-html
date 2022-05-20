
import React, {useState, useEffect} from "react";
import { useAddonState } from "@storybook/api";
import ReactSyntaxHighlighter from 'react-syntax-highlighter';
import {theme} from '../theme-docco';
import { format as prettierFormat } from 'prettier/standalone';
import prettierHtml from 'prettier/parser-html';

// console.log(theme)

const HTMLHEAD = (compname:string) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${compname}</title>
  </head>
  <body>
`;

const HTMLFOOT = `
</body></html>`

const FETCH_CONFIG = {
  method: 'POST',
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
  },
};


const prettierConfig = {
  // htmlWhitespaceSensitivity: "ignore",
  parser: 'html',
  plugins: [prettierHtml],
};

export type ValidationPanelProps = {
  html?: string,
  wrap?: boolean,
  active?: boolean;
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
    .replace(/”/g, '"')
    .replace(/“/g, '"')
    // .slice(0, -1)
}

export const ValidationPanel: React.FC<ValidationPanelProps> = (props) => {

  const {
    html: htmlProp = "<div>lorem ipsum</span>",
    wrap: wrapProp = true,
    active: activeProp = false,
  } = props;

  if( !activeProp || htmlProp === ''){
    return (<></>)
  }


  const compname: string = (window.location.search || window.location.href).split('/story/').pop();
  const source = wrapProp ? `${HTMLHEAD(compname)}${htmlProp}${HTMLFOOT}` : htmlProp;

  const [resultHtml, setResultHtml] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [prevSource, setPrevSource] = useAddonState<string>('');

  useEffect( () => {
    async function fetchData() {
      // console.log('checking...', source)
      setMessage('Validating...')
      setResultHtml('')


      const formattedSource = prettierFormat(source, prettierConfig);

      const op = await fetch(`https://validator.w3.org/nu/?out=json`, {...FETCH_CONFIG, body: formattedSource});
      const results = await op.json();
      setResultHtml( formatResults(formattedSource, results) );
    }

    setPrevSource(source);

    if(source !== prevSource){
      // wait a bit, so the DOM can populate <Portal>'s and the likes
      setTimeout(() => {
        if (activeProp && htmlProp !== '' ){
          fetchData();
        }
      }, 1000);
      // fetchData();
    }
  }, [source]);

  const formatResults = (source:string, results:resultType) => {
    console.log('validator results:', results)

    const linesOffset = 1;
    const unwrapped = source;
    // const linesOffset = HTMLHEAD.split("\n").length;
    // const unwrapped = source.replace(HTMLHEAD, '').replace(HTMLFOOT, '');
    
    const sourceLines = unwrapped.split("\n");
    const messages = results.messages?.sort(sortResults);

    const numErrors = messages?.length || 0;
    setMessage(`Found ${numErrors} validation issues`);

    let htmlLines = [''];
    sourceLines.forEach( (line, index) => {
      htmlLines.push(line);

      messages?.forEach( (msg:messageType) => {
        const messageLine = msg.lastLine ?  msg.lastLine - linesOffset : -1;
        if( messageLine === index ){
          htmlLines.push(`<!-- ${msg.type}: ${cleanMessage(msg.message || '')} -->`);
        }
      });
    });

    const html = htmlLines.join("\n").trim()

    // console.log( 'r1', htmlLines )
    // console.log( 'r2', html )

    return html;
  }

  return (
    <div>
      <ReactSyntaxHighlighter style={theme}>
        {message}
      </ReactSyntaxHighlighter>

      <ReactSyntaxHighlighter style={theme}>
        {resultHtml}
      </ReactSyntaxHighlighter>
    </div>
  )
};

