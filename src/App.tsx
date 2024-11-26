import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useServiceWorker } from "./useServeciWorker";

console.log("App started ver 16");

function App() {
  const { isServiceWorkerUpdated, reloadPage } = useServiceWorker();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          PWA update ver 16 <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {isServiceWorkerUpdated && (
          <p>
            <button
              onClick={() => {
                console.log("reload page start button click event");
                reloadPage();
              }}
            >
              click for update app
            </button>
          </p>
        )}
      </header>
      {isServiceWorkerUpdated && <CountToCallback callback={reloadPage} />}
    </div>
  );
}

const CountToCallback: React.FC<{
  callback: () => void;
}> = ({ callback }) => {
  const [count, setCount] = useState(10);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prev) => --prev);
    }, 1 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (count === 1) {
    console.log("reload callback");
    callback();
    return <></>;
  }

  return <></>;
};

export default App;
