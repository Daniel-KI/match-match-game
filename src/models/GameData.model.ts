type LevelModel = {
  name: string;
  cardPairs: number;
};
type ThemeModel = {
  name: string;
  cards: {
    name: string;
    image: string;
  }[];
};
type CardModel = {
  name: string;
  image: string;
};

export { LevelModel, ThemeModel, CardModel };
