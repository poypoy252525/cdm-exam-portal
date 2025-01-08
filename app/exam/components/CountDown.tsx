"use client";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

interface Props {
  minutes: number;
}

const CountDown = ({ minutes }: Props) => {
  const [seconds, setSeconds] = useState<number>(minutes * 60);
  const setSuccess = useStore((state) => state.setSuccess);

  useEffect(() => {
    if (seconds <= 0) {
      setSuccess(true);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [seconds, setSuccess]);

  return (
    <div className="fixed top-16 right-16 bg-slate-500 text-white px-2 rounded text-5xl">
      {`${Math.floor(seconds / 60)} : ${(seconds % 60)
        .toString()
        .padStart(2, "0")}`}
    </div>
  );
};

export default CountDown;
