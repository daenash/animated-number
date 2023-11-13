import React from "react";
import { AnimatedNumber } from "./components/AnimatedNumber.component";
import { useRandomValue } from "./hooks/use-random-value.hook";
import "./app.style.css";

export const App: React.FC = () => {
  const value = useRandomValue();

  return (
    <>
      <div className="box">
        <AnimatedNumber value={value}></AnimatedNumber>
        <p className="currency">$</p>
      </div>
      <div className="loader-container">
        <div className="loader" />
      </div>
    </>
  );
};
