import React, { useReducer } from "react";

type Action = { type: "Add" } | { type: "Subtract" };

interface CounterProps {
  initialState?: number;
}

const Counter: React.FC<CounterProps> = ({ initialState = 0 }) => {
  const [count, dispatch] = useReducer((state: number, action: Action) => {
    switch (action.type) {
      case "Add":
        return state + 1;
      case "Subtract":
        return state - 1;
    }
  }, initialState);

  return (
    <div className="w-3/4 h-[250px] flex flex-col">
      {count}
      <div className="flex flex-row justify-around">
        <button onClick={() => dispatch({ type: "Add" })}>+</button>
        <button onClick={() => dispatch({ type: "Subtract" })}>-</button>
      </div>
    </div>
  );
};

export default Counter;
