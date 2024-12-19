export const Die = ({ side }: { side: number }) => {
  const sideDots = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  }[side];
  return (
    <div className="die">
      {Array.from({ length: 9 }, (_, i) => (
        <div
          key={i}
          className={`die__dot ${
            sideDots?.includes(i) ? "die__dot--show" : "die__dot--hide"
          }`}
        />
      ))}
    </div>
  );
};
