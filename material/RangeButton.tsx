import React from "react";
import IRangeButton from "@/interfaces/RangeButton";

export default function RangeButton({
  databaseValue,
  onIncrease,
  onDecrease,
  onClick,
  state,
  setState,
  index,
  updateData,
}: any): JSX.Element {
  const [count, setCount] = React.useState<number>(databaseValue || 0);

  let time: NodeJS.Timer;
  const handleInputChange = (event: any) => {
    const newState = [...state];
    newState[index].jumlah = event.target.value;
    setState(newState);

    const action = (): void => {
      console.log(
        "sending data...",
        state[index]._id,
        state[index].jumlah,
        state[index].harga * state[index].jumlah
      );
      updateData(
        state[index]._id,
        state[index].jumlah,
        state[index].harga * state[index].jumlah
      );
      clearTimeout(time);
    };

    const resetTimer = (): void => {
      clearTimeout(time);
      time = setTimeout(action, 1000);
    };

    resetTimer();
  };

  return (
    <div className="w-auto flex items-center justify-center">
      <div className="flex border border-[#ffffff6f] rounded-md">
        <button
          onClick={(e: any) => {
            if (count > 1) {
              setCount(count - 1);
              const stateCopy = [...state];
              stateCopy[index].jumlah--;
              setState(stateCopy);
              // console.log("FROM RANGE BUTTON: ", state);
              onClick(e);
            }
          }}
          className="px-2 text-center rounded-md duration-200 hover:bg-white hover:text-black"
        >
          -
        </button>
        <input
          type="text"
          className="text-center bg-transparent outline-none focus:outline-none border-0"
          value={state[index].jumlah}
          onChange={handleInputChange}
          style={{
            width: "30px",
          }}
        />
        <button
          onClick={(e: any) => {
            onClick(e);
            setCount(count + 1);
            const stateCopy = [...state];
            stateCopy[index].jumlah++;
            setState(stateCopy);
            // console.log("FROM RANGE BUTTON: ", state);
          }}
          className="px-2 text-center rounded-md duration-200 hover:bg-white hover:text-black"
        >
          +
        </button>
      </div>
    </div>
  );
}
