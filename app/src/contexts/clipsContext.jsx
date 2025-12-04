import { createContext, useState } from "react";

export const ClipsContext = createContext({
  clips: [],
  setClips: () => {},
});

export function ClipsContextProvider({ children }) {
  const [clips, setClips] = useState([]);

  return <ClipsContext.Provider value={{ clips, setClips }}>{children}</ClipsContext.Provider>;
}
