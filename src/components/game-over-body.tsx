import { Button } from "./ui/button";

export const GameOverBody = ({
  score,
  onClick,
}: {
  score: number;
  onClick: () => void;
}) => {
  return (
    <div className="space-y-1 text-center">
      <p className="text-2xl">Congrats</p>
      <p>You scored {score}!</p>
      <Button onClick={onClick}>Play again?</Button>
    </div>
  );
};
