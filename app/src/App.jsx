import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    let isRegistered = false;

    async function registerGlobalShortcutSecurely() {
      if (isRegistered) return;

      await unregisterAll();
      await register("CommandOrControl+Shift+V", (e) => {
        if (e.state === "Released") {
          return;
        }
        console.log("Shortcut triggered");
      });
      isRegistered = true;
    }

    registerGlobalShortcutSecurely();

    return () => {
      isRegistered = false;
      unregisterAll();
    };
  }, []);

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  return <div className="bg-black">damn son</div>;
}

export default App;
