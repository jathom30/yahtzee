import { useEffect, useState } from "react";
import {
  createProposals,
  defaultDice,
  defaultScore,
  getRandomSide,
  getUpperScore,
  TScoreKey,
} from "./utils";

export const useDice = () => {
  const [dice, setDice] = useState(defaultDice);
  const [rollCount, setRollCount] = useState(0);
  const [score, setScore] = useState(defaultScore);
  const [propsals, setProposals] =
    useState<Partial<Record<TScoreKey, number>>>();

  const endOfTurn = rollCount > 2;
  const handleLock = (dieId: string) => {
    setDice((prev) => {
      return prev.map((die) => {
        if (dieId === die.id) {
          return {
            ...die,
            locked: !die.locked,
          };
        }
        return die;
      });
    });
  };

  const onReset = () => {
    setProposals(undefined);
    setRollCount(0);
    setDice(defaultDice);
  };

  const handleRoll = () => {
    if (endOfTurn) {
      return onReset();
    }
    const newDice = dice.map((die) => {
      if (die.locked) {
        return die;
      }
      return {
        ...die,
        side: getRandomSide(),
      };
    });
    setDice(newDice);
    const nextRoll = rollCount + 1;
    setRollCount(nextRoll);
    setProposals(createProposals(newDice, score));
  };

  const handleSetScore = (key: TScoreKey) => {
    setScore((prev) => {
      const newScore = {
        ...prev,
        [key]: propsals?.[key],
      };
      return {
        ...newScore,
        upper_bonus: getUpperScore(newScore) > 63 ? 35 : undefined,
      };
    });
    onReset();
  };

  const handleScratch = (key: TScoreKey) => {
    setScore((prev) => {
      return { ...prev, [key]: 0 };
    });
    onReset();
  };

  const handleNewGame = () => {
    setScore(defaultScore);
    onReset();
  };

  useEffect(() => {
    const handleKeyPress = (dieId: string) => {
      const dice = ["1", "2", "3", "4", "5"];
      if (!dice.includes(dieId)) return;
      setDice((prev) => {
        return prev.map((die) => {
          if (die.id === dieId) {
            return {
              ...die,
              locked: !die.locked,
            };
          }
          return die;
        });
      });
    };
    document.addEventListener("keyup", (e) => {
      handleKeyPress(e.key);
    });
    return () => {
      document.removeEventListener("keyup", (e) => handleKeyPress(e.key));
    };
  }, []);

  return {
    score,
    dice,
    propsals,
    rollCount,
    endOfTurn,
    handleLock,
    handleRoll,
    handleSetScore,
    handleScratch,
    handleNewGame,
  };
};
