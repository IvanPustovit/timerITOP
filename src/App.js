import React from "react";
import { useEffect, useState } from "react";
import { Subject, interval } from "rxjs";
import { buffer, debounceTime, filter, takeUntil, take } from "rxjs/operators";
import "./App.css";

function App() {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState("stop");
  let [doubleClicks, setDoubleClicks] = useState(0);

  useEffect(() => {
    const unsubscribe$ = new Subject();
    interval(1000)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        if (status === "run") {
          setSec((val) => val + 1000);
        }
      });
    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, [status]);

  const start = () => {
    if (status === "run") {
      setStatus("stop");
      setSec(0);
    } else {
      setStatus("run");
    }
  };

  const reset = () => {
    setSec(0);
  };
  const wait = (e) => {
    setDoubleClicks(doubleClicks++);
    const click$ = new Subject();
    click$
      .pipe(buffer(click$.pipe(debounceTime(300))), take(doubleClicks === 2))
      .subscribe(() => {
        setStatus("wait");
        setDoubleClicks(0);
      });

    return click$.next();
  };
  return (
    <div className="App">
      <h1>Timer</h1>
      <span> {new Date(sec).toISOString().slice(11, 19)}</span>
      <div>
        <button onClick={start}>Start/Stop</button>
        <button onClick={wait}>Wait</button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

export default App;
