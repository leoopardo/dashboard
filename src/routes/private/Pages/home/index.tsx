import React from "react";
import { useAuth } from "../../../../contexts/AuthContext";

export const Home = () => {
  const { signOut } = useAuth();
  return (
    <div>
      Home
      <button onClick={signOut}>logout</button>
    </div>
  );
};
