import React, { useEffect, useState } from "react";

const NotificationBox = ({ message, type, duration = 0 }) => {
  // We store the timeout so we can stop it from execution when we need it.
  const [timeoutHideBox, setTimeoutHideBox] = useState(null);

  // set style values for hide state
  const [divState, setDivState] = useState({
    opacity: "0",
    width: "10px",
  });
  const [pState, setPState] = useState({
    opacity: "0",
    textWrap: "nowrap",
  });

  // set default styling
  let divStyle = { color: "black", backgroundColor: "white" };

  // set styling base on message type
  switch (type) {
    case "default":
      divStyle = {
        color: "black",
        backgroundColor: "white",
      };
      break;

    case "error":
      divStyle = {
        color: "white",
        backgroundColor: "red",
      };
      break;
  }

  // modify style values to create show NotificationBox animation
  const showBox = () => {
    setDivState({ opacity: "1", width: "10px" });

    setTimeout(() => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Apply font style
      context.font = "1rem Arial";

      // Measure the text
      const metrics = context.measureText(message);

      setDivState({
        opacity: "1",
        width: `${metrics.width + 40}px`,
      });
    }, 100);

    setTimeout(() => {
      setPState({ opacity: "1", whiteSpace: "nowrap" });
    }, 500);
  };

  // modify style values to create hide NotificationBox animation
  const hideBox = () => {
    setPState({ opacity: "0", whiteSpace: "nowrap" });

    setTimeout(() => {
      setDivState({
        opacity: "1",
        width: "10px",
      });
    }, 400);

    setTimeout(() => {
      setDivState({ opacity: "0", width: "10px" });
    }, 500);
  };

  useEffect(() => {
    if (message) {
      showBox();
    }

    // stop stored timeout (if any) if duration is 0
    // That way the NotificationBox dont close itself
    if (duration <= 0) {
      clearTimeout(timeoutHideBox);
      return;
    }

    // Store timeout if duration is greater than 0
    // That way the NotificationBox closes itself
    setTimeoutHideBox(setTimeout(() => hideBox(), duration));

    // clear any timeouts stored on cleanup function
    return () => {
      clearTimeout(timeoutHideBox);
    };
  }, [message]);

  return (
    <div
      style={{
        padding: "5px 10px",
        borderRadius: "20px",
        boxShadow: "0px 2px 3px #a0a0a0",
        transition: "all ease 500ms",
        ...divStyle,
        ...divState,
      }}
    >
      <p
        style={{
          transition: "all ease 300ms",
          textAlign: "center",
          ...pState,
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default NotificationBox;
