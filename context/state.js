import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [sharedState, updateSharedState] = useState("hello world");

  return (
    <AppContext.Provider value={{ sharedState, updateSharedState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
