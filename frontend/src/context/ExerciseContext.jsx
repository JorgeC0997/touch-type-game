import axios from 'axios';
import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { ScoreContext } from './ScoreContext';

export const ExerciseContext = createContext();

export const ExerciseContextProvider = ({ children }) => {
  const scoreContext = useContext(ScoreContext);
  const [roomData, setRoomData] = useState(null);
  const [exerciseIds, setExerciseIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getExercise = async (exerciseId, controller) => {
    if (!exerciseId) {
      navigate('/');
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

  const getExerciseIds = async (level, controller) => {
    if (!level) {
      navigate('/');
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
    let exerciseCount = 10;
    let exercises = [];
    for (let i = 0; i < 3; i++) {
      let newLevel = {
        level: i + 1,
        isUnlocked: i < level ? true : false,
        exerciseList: [],
      };
      if (i === 2) exerciseCount = 8;
      for (let j = 0; j < exerciseCount; j++) {
        let newExercise = {
          id: `${i}${j}`,
          level: i + 1,
          exerciseNumber: j + 1,
          wpm_score: null,
        };
        newLevel.exerciseList.push(newExercise);
      }
      exercises.push(newLevel);
    }
    try {
      const unlockedExercises = await getExerciseIds(level, controller);
      if (unlockedExercises.length > 0) {
        for (let unlockedExercise of unlockedExercises) {
          exercises[unlockedExercise.level - 1].exerciseList[
            unlockedExercise.exercise_number - 1
          ].id = unlockedExercise.id;
        }
      }

      if (scoreContext.scoresByAccount) {
        scoreContext.scoresByAccount.forEach((score) => {
          exercises[score.level - 1].exerciseList[
            score.exercise_number - 1
          ].wpm_score = score.wpm_record;
        });
      }
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
