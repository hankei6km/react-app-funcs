import React, { useEffect, useState } from 'react';
// import url from 'url';
import './App.css';

// const { PUBLIC_URL = '/' } = process.env;
// const apiUrl = url.resolve(PUBLIC_URL + (PUBLIC_URL.slice(-1) === '/' ? '' : '/'), 'api/format/pad');
const apiUrl = 'api/format/pad';

function App() {
  const [cnt, setCnt] = useState(0);
  const [label, setLabel] = useState('000000');

  useEffect(() => {
    // https://stackoverflow.com/questions/31061838/how-do-i-cancel-an-http-fetch-request
    const controller = new AbortController()
    const signal = controller.signal
    let done = false;

    const formatFunc = async () => {
      const params = new URLSearchParams('');
      params.append('value', `${cnt}`)
      try {
        const res = await fetch(`${apiUrl}?${params.toString()}`, {
          signal: signal,
        });
        if (res.ok) {
          setLabel((await res.json()).value);
        } else {
          if (res.status === 500) {
            setLabel((await res.json()).message);
          } else {
            setLabel(`error: status=${res.status}`);
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          throw (err); //useEffect の中で throw するとどうなる?
        }
      } finally {
        done = true;
      }
    }
    formatFunc();

    return () => {
      if (!done && !signal.aborted) {
        controller.abort();
      }
    }
  }, [cnt]);

  return (
    <div className="App">
      <div>{cnt}</div>
      <div>{label}</div>
      <div><button onClick={(e) => setCnt(cnt + 1)}>add</button></div>
      <div><a href="credits.txt">credits</a></div>
    </div>
  );
}

export default App;
