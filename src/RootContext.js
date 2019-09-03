import React, { useEffect, useState } from "react";
export const RootContext = React.createContext();

export default ({ children }) => {
  const prevAuthToken = window.localStorage.getItem("authToken") || "";
  const [authToken, setAuthToken] = useState(prevAuthToken);

  // update localStorage anytime authenticated or authToken change
  useEffect(() => {
    window.localStorage.setItem("authToken", authToken);
  }, [authToken]);
  const defaultContext = {
    authToken,
    setAuthToken
  };
  return (
    <RootContext.Provider value={defaultContext}>
      {children}
    </RootContext.Provider>
  );
};
