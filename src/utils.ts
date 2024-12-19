export const defaultDice = [
  { side: 1, locked: false, id: "1" },
  { side: 1, locked: false, id: "2" },
  { side: 1, locked: false, id: "3" },
  { side: 1, locked: false, id: "4" },
  { side: 1, locked: false, id: "5" },
];

export type TScoreKey =
  | "aces"
  | "twos"
  | "threes"
  | "fours"
  | "fives"
  | "sixes"
  | "upper_bonus"
  | "three_of_a_kind"
  | "four_of_a_kind"
  | "full_house"
  | "sm_straight"
  | "lg_straight"
  | "yahtzee"
  | "chance"
  | "bonus_yahtzee_1"
  | "bonus_yahtzee_2";

export const defaultScore: Record<TScoreKey, number | undefined> = {
  aces: undefined,
  twos: undefined,
  threes: undefined,
  fours: undefined,
  fives: undefined,
  sixes: undefined,
  upper_bonus: undefined,
  three_of_a_kind: undefined,
  four_of_a_kind: undefined,
  full_house: undefined,
  sm_straight: undefined,
  lg_straight: undefined,
  yahtzee: undefined,
  chance: undefined,
  bonus_yahtzee_1: undefined,
  bonus_yahtzee_2: undefined,
};

export type TDie = (typeof defaultDice)[number];

export const upperSection: {
  id: TScoreKey;
  label: string;
  value: number;
  explanation: string;
}[] = [
  {
    id: "aces",
    label: "Aces",
    value: 1,
    explanation: "Count and Add only Aces",
  },
  {
    id: "twos",
    label: "Twos",
    value: 2,
    explanation: "Count and Add only Twos",
  },
  {
    id: "threes",
    label: "Threes",
    value: 3,
    explanation: "Count and Add only Threes",
  },
  {
    id: "fours",
    label: "Fours",
    value: 4,
    explanation: "Count and Add only Fours",
  },
  {
    id: "fives",
    label: "Fives",
    value: 5,
    explanation: "Count and Add only Fives",
  },
  {
    id: "sixes",
    label: "Sixes",
    value: 6,
    explanation: "Count and Add only Sixes",
  },
  {
    id: "upper_bonus",
    label: "Bonus",
    value: 0,
    explanation: "If total upper score is 63 or over",
  },
];

export const lowerSection: {
  id: TScoreKey;
  label: string;
  value: number;
  explanation: string;
}[] = [
  {
    id: "three_of_a_kind",
    label: "3 of a Kind",
    value: 1,
    explanation: "Add total of all dice",
  },
  {
    id: "four_of_a_kind",
    label: "4 of a Kind",
    value: 1,
    explanation: "Add total of all dice",
  },
  {
    id: "full_house",
    label: "full house",
    value: 25,
    explanation: "3 of a kind and a pair",
  },
  {
    id: "sm_straight",
    label: "Small Straight",
    value: 30,
    explanation: "Sequence of 4",
  },
  {
    id: "lg_straight",
    label: "Large Straight",
    value: 40,
    explanation: "Sequence of 5",
  },
  {
    id: "yahtzee",
    label: "Yahtzee",
    value: 50,
    explanation: "5 of a kind",
  },
  {
    id: "chance",
    label: "Chance",
    value: 1,
    explanation: "Total of all 5 dice",
  },
  {
    id: "bonus_yahtzee_1",
    label: "Bonus Yahtzee",
    value: 100,
    explanation: "100 per bonus yahtzee",
  },
  {
    id: "bonus_yahtzee_2",
    label: "Bonus Yahtzee",
    value: 100,
    explanation: "100 per bonus yahtzee",
  },
];

export const getRandomSide = () => Math.floor(Math.random() * 6) + 1;

const getTotalOfSide = (dice: TDie[], side: number) => {
  return (
    dice.reduce(
      (total, die) => (die.side === side ? total + die.side : total),
      0,
    ) || undefined
  );
};

const getTotalOfDice = (dice: TDie[]) =>
  dice.reduce((total, die) => total + die.side, 0);

const getSideCounts = (dice: TDie[]) => {
  const sideCounts = dice.reduce((acc, die) => {
    return {
      ...acc,
      [die.side]: [...(acc?.[die.side] || []), die.id],
    };
  }, {} as Record<number, string[]>);
  return sideCounts;
};

const isOfKind = (dice: TDie[], quantity: number) => {
  const totals = getSideCounts(dice);
  return Boolean(
    Object.values(totals).find((total) => total.length >= quantity),
  );
};

const isFullHouse = (dice: TDie[]) => {
  const totals = getSideCounts(dice);
  const trioSide = Object.entries(totals).find(
    ([, value]) => value.length >= 3,
  )?.[0];
  const duoSide = Object.entries(totals).find(
    ([key, value]) => value.length >= 2 && key !== trioSide,
  )?.[0];
  return trioSide && duoSide;
};

const straights = {
  sm: [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],
  ],
  lg: [
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6],
  ],
};

const isStraight = (dice: TDie[], size: "sm" | "lg") => {
  const sides = dice.map((die) => die.side).sort();
  return straights[size].some((straight) =>
    straight.every((item) => sides.includes(item)),
  );
};

export const getUpperScore = (score: Partial<Record<TScoreKey, number>>) => {
  const upperKeys = upperSection.map((section) => section.id);
  return upperKeys.reduce((total, key) => total + (score[key] || 0), 0);
};

export const getLowerScore = (score: Partial<Record<TScoreKey, number>>) => {
  const lowerKeys = lowerSection.map((section) => section.id);
  return lowerKeys.reduce((total, key) => total + (score[key] || 0), 0);
};

export const createProposals = (
  dice: TDie[],
  score: Partial<Record<TScoreKey, number>>,
): Partial<Record<TScoreKey, number | undefined>> => {
  return {
    aces: getTotalOfSide(dice, 1),
    twos: getTotalOfSide(dice, 2),
    threes: getTotalOfSide(dice, 3),
    fours: getTotalOfSide(dice, 4),
    fives: getTotalOfSide(dice, 5),
    sixes: getTotalOfSide(dice, 6),
    three_of_a_kind: isOfKind(dice, 3) ? getTotalOfDice(dice) : undefined,
    four_of_a_kind: isOfKind(dice, 4) ? getTotalOfDice(dice) : undefined,
    full_house: isFullHouse(dice) ? 25 : undefined,
    sm_straight: isStraight(dice, "sm") ? 30 : undefined,
    lg_straight: isStraight(dice, "lg") ? 40 : undefined,
    yahtzee: isOfKind(dice, 5) ? 50 : undefined,
    chance: getTotalOfDice(dice),
    bonus_yahtzee_1: score.yahtzee && isOfKind(dice, 5) ? 100 : undefined,
    bonus_yahtzee_2: score.yahtzee && isOfKind(dice, 5) ? 100 : undefined,
  };
};
