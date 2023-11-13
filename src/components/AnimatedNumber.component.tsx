import React, { useEffect, useRef, useState } from "react";
import "./animated-number.style.css";

interface Props {
  value: number;
}

type AnimationStatus = "animate-in" | "animate-out";
type Direction = "up" | "down";

interface Element {
  position: number;
  value: string;
  status: AnimationStatus;
  direction: Direction;
}

export const AnimatedNumber: React.FC<Props> = ({ value }) => {
  const debounced = useRef<number | undefined>(undefined);
  const isAnimating = useRef(false);
  const previousValue = useRef(0);
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => {
    /**
     * Function that animates in-and out the digits separately
     * and calls itself if debounced during animation
     */
    const animateTo = (newValue: number) => {
      isAnimating.current = true;

      let direction: Direction = "up";

      if (previousValue.current !== undefined) {
        direction = previousValue.current <= newValue ? "up" : "down";
      }
      previousValue.current = newValue;

      setElements((prev) => {
        const newElementsBase = newValue.toLocaleString("en-US").split("");
        const newElements: typeof prev = [];

        newElementsBase.forEach((e, i) => {
          // --------------------------
          // Element exists in position:
          if (prev[i]) {
            // -------------------------
            // Case 1: It has same value
            // -> leave it alone
            if (prev[i].value === e) {
              newElements.push(prev[i]);
            } else {
              // -------------------------------
              // Case 2: It has different value:
              // -> animate out the previous number element and animate in the new one
              const modifiedElement = { ...prev[i], direction };
              newElements.push({
                ...modifiedElement,
                status: "animate-out",
              });
              newElements.push({
                ...modifiedElement,
                value: e,
                status: "animate-in",
              });
            }
          } else {
            // -----------------
            // New element case:
            // Add it to the elements array with animate-in status
            newElements.push({
              position: i,
              status: "animate-in",
              value: e,
              direction,
            });
          }
        });

        // ----------------------------------------
        // The previous number has more digits case:
        // -> Animate out those elements
        if (prev.length > newElementsBase.length) {
          newElements.push(
            ...prev.slice(newElementsBase.length).map((e) => ({
              ...e,
              status: "animate-out" as const,
              direction,
            }))
          );
        }

        return newElements;
      });

      setTimeout(() => {
        // Filter 'out-animated' elements because they're not visible anymore
        setElements((prev) => {
          return prev.filter((e) => e.status !== "animate-out");
        });

        isAnimating.current = false;

        // If there was a debounced value -> animate to that value
        if (debounced.current) {
          const debouncedValue = debounced.current;
          debounced.current = undefined;
          animateTo(debouncedValue);
        }
      }, 500);
    };

    if (!isAnimating.current) {
      animateTo(value);
    } else {
      debounced.current = value;
    }
  }, [value]);

  return (
    <div
      className="animated-number-container"
      style={{
        width: elements.filter((e) => e.status === "animate-in").length * 9,
      }}
    >
      {elements.map((p) => (
        <p
          className={
            `animated-number ` +
            (p.status === "animate-in"
              ? `animate-in-${p.direction}`
              : `animate-out-${p.direction}`)
          }
          style={{
            animationDelay: `${p.position * 0.015}s, ${p.position * 0.015}s`,
            left: p.position * 9,
            opacity: p.status === "animate-in" ? 0 : 1,
          }}
          key={p.position.toString() + "_" + p.value}
        >
          {p.value}
        </p>
      ))}
    </div>
  );
};
