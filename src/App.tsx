import "./App.css";
import { Button } from "./components/ui/button";
import { Lock, Unlock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import {
  getLowerScore,
  getUpperScore,
  lowerSection,
  upperSection,
} from "./utils";
import { Section } from "./components/section";
import { Die } from "./components/die";
import { useDice } from "./use-dice";

function App() {
  const {
    score,
    dice,
    rollCount,
    endOfTurn,
    handleLock,
    handleNewGame,
    handleRoll,
    handleScratch,
    handleSetScore,
    propsals,
  } = useDice();
  const scoreTotal = Object.values(score).reduce(
    (total, val) => (total || 0) + (val || 0),
    0,
  );

  const isGameOver = Object.entries(score)
    .filter(
      ([key]) =>
        !["bonus_yahtzee_1", "bonus_yahtzee_2", "upper_bonus"].includes(key),
    )
    .every(([, value]) => typeof value === "number");

  return (
    <div className="p-4 flex flex-col items-center gap-2">
      <Card className="sticky top-4 p-2 bg-card space-y-2">
        {!isGameOver ? (
          <>
            <div className="flex flex-wrap justify-center gap-1">
              {dice.map((die) => (
                <button
                  key={die.id}
                  onClick={() => handleLock(die.id)}
                  className={`bg-card p-0 relative ${
                    die.locked ? "opacity-65" : ""
                  }`}
                  disabled={!rollCount}
                >
                  {rollCount > 0 ? (
                    <div className="absolute bg-card p-1 rounded-full border -top-1 -left-1">
                      {die.locked ? <Lock size={10} /> : <Unlock size={10} />}
                    </div>
                  ) : null}
                  <Die side={die.side} />
                </button>
              ))}
            </div>
            {!endOfTurn ? (
              <CardFooter className="p-0">
                <Button size="lg" onClick={handleRoll}>
                  {rollCount === 0 ? "Roll" : "Reroll"}
                </Button>
              </CardFooter>
            ) : null}
          </>
        ) : (
          <div className="space-y-2 text-center">
            <p className="text-2xl">Game Over!</p>
            <Button onClick={handleNewGame}>Play again?</Button>
          </div>
        )}
      </Card>
      <Card className="w-full">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>Yahtzee Score Card</CardTitle>
            <span className="text-lg font-bold">{scoreTotal}</span>
          </div>
        </CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription>Upper Section</CardDescription>
                <span>{getUpperScore(score)}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {upperSection.map((item) => {
                return (
                  <Section
                    key={item.id}
                    item={item}
                    score={score}
                    scoreProposals={propsals}
                    onAcceptScore={handleSetScore}
                    onScratch={handleScratch}
                    isLastRoll={endOfTurn}
                  />
                );
              })}
            </CardContent>
          </div>
          <div className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardDescription>Lower Section</CardDescription>
                <span>{getLowerScore(score)}</span>
              </div>
            </CardHeader>
            <CardContent>
              {lowerSection.map((item) => {
                return (
                  <Section
                    key={item.id}
                    item={item}
                    score={score}
                    scoreProposals={propsals}
                    onAcceptScore={handleSetScore}
                    onScratch={handleScratch}
                    isLastRoll={endOfTurn}
                  />
                );
              })}
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default App;
