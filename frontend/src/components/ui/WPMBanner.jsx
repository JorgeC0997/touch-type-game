import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../context/AccountContext";
import { ExerciseContext } from "../../context/ExerciseContext";
import { ScoreContext } from "../../context/ScoreContext";
import RibbonSign from "./RibbonSign";
import WPM from "./WPM";

const WPMBanner = ({ totalWPM = 0 }) => {
  const accountContext = useContext(AccountContext);
  const exerciseContext = useContext(ExerciseContext);
  const scoreContext = useContext(ScoreContext);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Trigger this effect every time totalWPM changes
  useEffect(() => {
    if (totalWPM === 0) return;

    const controller = new AbortController();

    // Set new record if totalWPM is greater than the current higest score in db
    const checkNewRecord = async () => {
      const newRecord = await scoreContext.checkNewScore(
        accountContext.accountData.id,
        exerciseContext.roomData.id,
        totalWPM,
        controller
      );
      setIsNewRecord(newRecord);
    };

    checkNewRecord(controller);

    return () => {
      controller.abort();
    };
  }, [totalWPM]);

  // Show new record ribbon component if new record
  if (isNewRecord) {
    return <RibbonSign score={totalWPM} />;
  }

  return <WPM totalWPM={totalWPM} size="xl" />;
};

export default WPMBanner;
