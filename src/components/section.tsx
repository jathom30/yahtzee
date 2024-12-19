import { TScoreKey } from "../utils";
import { Button } from "./ui/button";

export const Section = ({
  item,
  score,
  scoreProposals,
  onAcceptScore,
  onScratch,
  isLastRoll,
}: {
  item: {
    id: TScoreKey;
    label: string;
    value: number;
    explanation: string;
  };
  score: Record<TScoreKey, number | undefined>;
  scoreProposals?: Partial<Record<TScoreKey, number>>;
  onAcceptScore: (itemId: TScoreKey) => void;
  onScratch: (itemId: TScoreKey) => void;
  isLastRoll: boolean;
}) => {
  const isProposedScore = Boolean(
    typeof score[item.id] !== "number" && scoreProposals?.[item.id],
  );
  return (
    <div>
      <div className="flex gap-2 items-end">
        <h6 className="text-lg min-w-max font-bold">{item.label}</h6>
        <div className="border-b border-dotted w-full" />
        <p
          className={`text-lg min-w-max font-bold ${
            isProposedScore ? "text-blue-500" : ""
          }`}
        >
          {typeof score[item.id] === "number"
            ? score[item.id] === 0
              ? "X"
              : score[item.id]
            : scoreProposals?.[item.id]
            ? scoreProposals[item.id]
            : "--"}
        </p>
      </div>
      <div className="flex gap-2 items-center justify-between">
        <p className="text-sm text-muted-foreground">{item.explanation}</p>
        {typeof score[item.id] === "number" ? null : scoreProposals?.[
            item.id
          ] ? (
          <Button onClick={() => onAcceptScore(item.id)}>Accept Score</Button>
        ) : isLastRoll &&
          !["upper_bonus", "bonus_yahtzee_1", "bonus_yahtzee_2"].includes(
            item.id,
          ) ? (
          <Button variant="outline" onClick={() => onScratch(item.id)}>
            Scratch
          </Button>
        ) : null}
      </div>
    </div>
  );
};