import React, {useState, useEffect} from "react";
import { useAddonState } from "@storybook/api";
import { SyntaxHighlighter } from '@storybook/components';

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

      const op = await fetch(`https://validator.w3.org/nu/?out=json`, {...FETCH_CONFIG, body: source});
      const results = await op.json();
      setResultHtml( formatResults(source, results) );
    }

    setPrevSource(source);

    if(source !== prevSource){
      // wait a bit, so the DOM can populate <Portal>'s and the likes
      setTimeout(() => {
        if (activeProp && htmlProp !== '' ){
          fetchData();
        }
      }, 1000);
    }
  }, [source]);

  const formatResults = (source:string, results:resultType) => {
    console.log('validator results:', results)

    const linesOffset = 1;
    const sourceLines = source.split("\n");
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

    return htmlLines.join("\n").trim();
  }

  return (
    <div>
      <SyntaxHighlighter>
        {message}
      </SyntaxHighlighter>
      <br />
      <SyntaxHighlighter language="html">
        {resultHtml}
      </SyntaxHighlighter>
    </div>
  )
};

