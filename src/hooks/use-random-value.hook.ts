import { useEffect, useRef, useState } from "react";

export const useRandomValue = () => {
  const intervalRef = useRef<number | undefined>(undefined);
  const [value, setValue] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setValue(Math.ceil(Math.random() * 100000) - 10000);
    }, 2000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return value;
};
