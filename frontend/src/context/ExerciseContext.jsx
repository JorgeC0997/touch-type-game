import axios from "axios";
import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { ScoreContext } from "./ScoreContext";

export const ExerciseContext = createContext();

export const ExerciseContextProvider = ({ children }) => {
  const scoreContext = useContext(ScoreContext);
  // RoomData will contain the following data (id, level, exercise_number, content and char_length)
  const [roomData, setRoomData] = useState(null);
  const [exerciseIds, setExerciseIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Get a single exercise data selected by the user.
  const getExercise = async (exerciseId, controller) => {
    if (!exerciseId) {
      navigate("/");
      return;
    }
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/exercises/${exerciseId}`,
        {
          withCredentials: true,
          signal: controller.signal,
        }
      );
      if (data) {
        setRoomData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Return available exercises based on user account's level
  const getExerciseIds = async (level, controller) => {
    if (!level) {
      navigate("/");
      return;
    }
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/exercises/getIds/${level}`,
        {
          withCredentials: true,
          signal: controller.signal,
        }
      );
      return data ? data : [];
    } catch (error) {
      console.log(error);
    }
  };

  const generateExerciseList = async (level, controller) => {
    setIsLoading(true);
    // total exercises by level
    let exerciseCount = 10;
    // Exercise list
    let exercises = [];

    // The next two for loops will help generate an exercise list with the following structure
    // [
    //   {
    //     level: 1,
    //     isUnlocked: true,
    //     exerciseList: [
    //       { id: "1Tes112-1", level: 1, exerciseNumber: 1, wpm_score: 48 },
    //       { etc... }
    //     ]
    //   },
    //   {
    //      etc...
    //   }
    // ]

    // We loop 3 times due to the number of levels in this app
    for (let i = 0; i < 3; i++) {
      // Generate a new level object
      // if i is less than current user's level, we set isUnlocked to true
      // create an empty exerciseList
      let newLevel = {
        level: i + 1,
        isUnlocked: i < level ? true : false,
        exerciseList: [],
      };

      // we add this if statement to change the count on j to 8
      // because the 3rd (position "i + 1" counting from 0) level only have 8 exercises unlike levles 1 & 2
      if (i === 2) exerciseCount = 8;

      // Loop through exercise count [10, 10, 8]
      for (let j = 0; j < exerciseCount; j++) {
        // Generate a new exercise
        // Initialize every id by concatenating i + j (this is temporal until we get the reachable exercises ids)
        // Set the level to which the exercise belongs
        // Set the exercises number following the sequence of "j"
        // Initialize every wpm_score to null (this is temporal until we get the completed scores for that particular exercise)
        let newExercise = {
          id: `${i}${j}`,
          level: i + 1,
          exerciseNumber: j + 1,
          wpm_score: null,
        };

        // Append the new exercise to newLevel's exerciseList
        newLevel.exerciseList.push(newExercise);
      }

      // Append newLevel to exercises array
      exercises.push(newLevel);
    }

    try {
      // Get the reachable exercises ids to use in the URL path for PracticeRoom
      const unlockedExercises = await getExerciseIds(level, controller);

      if (unlockedExercises.length > 0) {
        // Loop through retrieved unlocked exercises and replace the temporal ids previously generated
        // with the real exercise id form db
        for (let unlockedExercise of unlockedExercises) {
          exercises[unlockedExercise.level - 1].exerciseList[
            unlockedExercise.exercise_number - 1
          ].id = unlockedExercise.id;
        }
      }

      // User has some completed exercises, loop through the scores retrieved and replace the temporal
      // wpm_score (null) for the score from db
      if (scoreContext.scoresByAccount) {
        scoreContext.scoresByAccount.forEach((score) => {
          exercises[score.level - 1].exerciseList[
            score.exercise_number - 1
          ].wpm_score = score.wpm_record;
        });
      }

      // Save the final exercises list structure.
      setExerciseIds(exercises);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const values = {
    roomData,
    exerciseIds,
    isLoading,
    getExercise,
    generateExerciseList,
  };
  return (
    <ExerciseContext.Provider value={values}>
      {children}
    </ExerciseContext.Provider>
  );
};
