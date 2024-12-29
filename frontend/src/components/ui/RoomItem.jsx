import React from "react";
import arrowLogo from "../../assets/arrow_right.svg";
import { Link } from "react-router";
import WPM from "./WPM";

const RoomItem = ({ room, arrow = true, isUnlocked }) => {
  return (
    <li className={`flex items-center ${isUnlocked === false && "opacity-40"}`}>
      {isUnlocked ? (
        <Link
          to={`/room/${room.id}`}
          className={`px-6 py-4 bg-base-dark text-center rounded-xl h-fit ${
            room.wpm_score && "border-4 border-lime-500/60"
          }`}
        >
          <h1 className="text-6xl">{room.exerciseNumber}</h1>
          {room.wpm_score && <WPM totalWPM={room.wpm_score} size="sm" />}
          {room.wpm_score && (
            <span className="text-xs text-lime-500">Completed</span>
          )}
        </Link>
      ) : (
        <span
          className={`px-6 py-4 bg-base-dark text-center rounded-xl pointer-events-none`}
        >
          <h1 className="text-6xl">{room.exerciseNumber}</h1>
        </span>
      )}

      {arrow && <img src={arrowLogo} className="flex-grow w-20" />}
    </li>
  );
};

export default RoomItem;
