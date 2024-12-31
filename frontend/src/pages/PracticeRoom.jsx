import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import Char from '../lib/Char.js';
import { ExerciseContext } from '../context/ExerciseContext';
import { ModalContext } from '../context/ModalContext.jsx';
import { AccountContext } from '../context/AccountContext.jsx';
import { ScoreContext } from '../context/ScoreContext.jsx';
import RoundedBadge from '../components/ui/RoundedBadge.jsx';
import WPMBanner from '../components/ui/WPMBanner.jsx';
import { excludedKeys } from '../lib/excludedKeys.js';

const PracticeRoom = () => {
  const modalContext = useContext(ModalContext);
  const exerciseContext = useContext(ExerciseContext);
  const accountContext = useContext(AccountContext);
  const scoreContext = useContext(ScoreContext);
  const { roomId } = useParams();
  const [pointer, setPointer] = useState(0);
  const [goods, setGoods] = useState(0);
  const [bads, setBads] = useState(0);
  const [history, setHistory] = useState([]);
  const [isGameEnded, setIsGameEnded] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState([0, 0]);
  const [charArray, setCharArray] = useState([]);

  const [wpmArray, setWpmArray] = useState([]);
  const [contentIndex, setContentIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    exerciseContext.getExercise(roomId, controller);

    () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (exerciseContext.roomData) {
      generateCharArray(contentIndex);
    }
  }, [exerciseContext.roomData, history, contentIndex]);

  const generateCharArray = (contentIndex) => {
    setCharArray([]);
    const str_array = exerciseContext.roomData.content[contentIndex].split('');

    let tempCharArray = [];
    str_array.forEach((character, index) => {
      let newChar = new Char(character, history[index]);
      tempCharArray.push(newChar);
    });

    setCharArray(tempCharArray);
  };

  useEffect(() => {
    const controller = new AbortController();
    const storeGameData = async () => {
      if (timeElapsed[0] > 0) {
        let minutes = (timeElapsed[1] - timeElapsed[0]) / 60;
        let totalWords = charArray.length / 5;
        const WPM = Math.round(totalWords / minutes);
        setWpmArray((prev) => {
          return [...prev, WPM];
        });
        setTimeElapsed([0, 0]);
        setHistory([]);
        setPointer(0);
        // let totalWords = 112 / 5;
      }

      if (isGameEnded) {
        let totalWPM = 0;
        wpmArray.forEach((wpm) => {
          totalWPM += wpm;
        });

        totalWPM = Math.round(
          totalWPM / exerciseContext.roomData.content.length
        );

        // const isNewRecord = await scoreContext.checkNewScore(
        //   accountContext.accountData.id,
        //   exerciseContext.roomData.id,
        //   totalWPM,
        //   controller
        // );

        accountContext.levelUp(scoreContext.scoresByAccount);

        modalContext.activateModal(() => {
          return (
            <div className='w-full'>
              <div className='py-4 bg-base-neutral w-full flex flex-col justify-center items-center gap-y-2 text-base-light rounded-tl-2xl rounded-tr-2xl'>
                <div className='flex gap-2'>
                  <h1 className='text-4xl'>Exercise:</h1>
                  <RoundedBadge
                    badgeContent={exerciseContext.roomData?.exercise_number}
                    size='lg'
                  />
                </div>

                <WPMBanner totalWPM={totalWPM} size='lg' />
                {/* <p className="text-xl">Words per minute</p>
                <p className="text-4xl font-semibold">{totalWPM}</p> */}
              </div>
              <div className='py-4 bg-black/10 w-full flex flex-col justify-center items-center rounded-bl-2xl rounded-br-2xl'>
                <p>{`Goods: ${goods}`}</p>
                <p>{`Bads: ${bads}`}</p>
              </div>
            </div>
          );
        }, '/');
      }
    };

    storeGameData();

    return () => {
      controller.abort();
    };
  }, [isGameEnded, contentIndex]);

  useEffect(() => {
    const handleKeyPressed = (event) => {
      if (timeElapsed[0] === 0) {
        setTimeElapsed((prev) => {
          let newTime = [...prev];
          newTime[0] = Math.floor(Date.now() / 1000);
          return newTime;
        });
      }
      if (isGameEnded == false) {
        if (event.key == 'Backspace') {
          if (pointer > 0) {
            if (history[pointer - 1]) {
              setGoods((prev) => (prev -= 1));
            } else {
              setBads((prev) => (prev -= 1));
            }
            const newHistoryArray = [...history];
            newHistoryArray.pop();
            setHistory(newHistoryArray);
            setPointer((prev) => (prev -= 1));
          }
        } else {
          if (pointer < charArray.length) {
            if (excludedKeys.includes(event.key)) return;

            if (event.key == charArray[pointer].character) {
              setHistory((prev) => [...prev, true]);
              setGoods((prev) => (prev += 1));
            } else {
              setHistory((prev) => [...prev, false]);
              setBads((prev) => (prev += 1));
            }
            setPointer((prev) => (prev += 1));
          } else {
            setTimeElapsed((prev) => {
              let newTime = [...prev];
              newTime[1] = Math.floor(Date.now() / 1000);
              return newTime;
            });
            if (contentIndex < exerciseContext.roomData.content.length - 1) {
              setContentIndex(contentIndex + 1);
              setIsGameEnded(false);
            } else {
              setIsGameEnded(true);
            }
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyPressed);

    return () => {
      document.removeEventListener('keydown', handleKeyPressed);
    };
  }, [pointer, charArray]);

  return (
    <div className='px-20 h-screen flex justify-center items-center'>
      <p className='text-2xl text-justify'>
        {charArray.map((charObj, index) => {
          return (
            <span key={index} style={charArray[index].getStyle(pointer, index)}>
              {charObj.character}
            </span>
          );
        })}
      </p>
    </div>
  );
};

export default PracticeRoom;
