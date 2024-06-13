import { useState, useEffect, useRef, useMemo } from "react";

const useTimer = ({
  initialMinutes = 0,
  autoStart = false,
  onEnd = () => {},
}) => {
  const initialDuration = initialMinutes * 60;
  const [duration, setDuration] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(autoStart);

  const intervalRef = useRef(null);

  const { minutes, seconds } = useMemo(() => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return { minutes, seconds };
  }, [duration]);

  const start = (initialMinutes) => {
    if (!isRunning) {
      setDuration(initialMinutes * 60);
      setIsRunning(true);
    }
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setDuration(initialDuration);
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setDuration((prevDuration) => {
          if (prevDuration > 0) {
            return prevDuration - 1;
          } else {
            clearInterval(intervalRef.current);
            onEnd();
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, onEnd]);

  useEffect(() => {
    if (autoStart) {
      start();
    }
  }, [autoStart]);

  return { minutes, seconds, start, stop, reset };
};

export default useTimer;
