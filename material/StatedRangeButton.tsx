import Button from "./Button";
import React from "react";

interface IStatedRangeButton {
  state: [number, React.Dispatch<React.SetStateAction<number>>];
}

export default function StatedRangeButton({
  state,
}: IStatedRangeButton): JSX.Element {
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      state[1](value);
    }
  };

  return (
    <div className="flex border border-[#ffffffaa] rounded-md">
      <button
        className={`hover:bg-white hover:text-black duration-200 bg-transparent text-[#ffffffaa] rounded-md w-full h-9`}
        onClick={e => state[1](state[0] - 1)}
      >
        -
      </button>
      <input
        className="focus:text-white text-center duration-200 bg-transparent text-[#ffffffaa] rounded-md w-full h-9"
        type="text"
        pattern="[0-9]+"
        onChange={handleInputChange}
        value={state[0]}
      />
      <button
        className={` hover:bg-white hover:text-black duration-200 bg-transparent text-[#ffffffaa] rounded-md w-full h-9`}
        onClick={e => state[1](state[0] + 1)}
      >
        +
      </button>
    </div>
  );
}
