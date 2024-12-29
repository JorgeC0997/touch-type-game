import React, { useState, useContext, useEffect } from "react";
import RoomItem from "../components/ui/RoomItem.jsx";
import { AccountContext } from "../context/AccountContext.jsx";
import { ExerciseContext } from "../context/ExerciseContext.jsx";
import { ScoreContext } from "../context/ScoreContext.jsx";
import RibbonSign from "../components/ui/RibbonSign.jsx";

const RoomMenu = () => {
  const accountContext = useContext(AccountContext);
  const exerciseContext = useContext(ExerciseContext);
  const scoreContext = useContext(ScoreContext);

  useEffect(() => {
    const controller = new AbortController();
    if (accountContext.accountData) {
      exerciseContext.generateExerciseList(
        accountContext.accountData.level,
        controller
      );
    }

    () => {
      controller.abort();
    };
  }, [accountContext.accountData, scoreContext.scoresByAccount]);

  if (exerciseContext.isLoading)
    return (
      <div className="py-20 flex flex-col justify-center items-center">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="py-20 flex flex-col justify-center items-center">
      <ul className="p-5 bg-base-neutral rounded-xl">
        {exerciseContext.exerciseIds.length > 0 &&
          exerciseContext.exerciseIds.map((level) => {
            return (
              <div key={level.level}>
                <h1
                  className={`text-4xl font-bold ${
                    level.isUnlocked === false && "opacity-40"
                  }`}
                >
                  Level: {level.level}
                </h1>
                <ul className="p-5 grid grid-cols-5 gap-y-4 items-center bg-base-neutral rounded-xl">
                  {level.exerciseList.map((exercise) => {
                    return level.exerciseList[level.exerciseList.length - 1]
                      .id === exercise.id ? (
                      <RoomItem
                        key={exercise.id}
                        room={exercise}
                        arrow={false}
                        isUnlocked={level.isUnlocked}
                      />
                    ) : (
                      <RoomItem
                        key={exercise.id}
                        room={exercise}
                        isUnlocked={level.isUnlocked}
                      />
                    );
                  })}
                </ul>
              </div>
            );
          })}
      </ul>
    </div>
  );
};

export default RoomMenu;
