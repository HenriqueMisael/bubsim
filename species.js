const species = {
  ['RED']: (x, y) => new BubBuilder(color(255, 2, 2), 10, 2, 20, 1).mutate().build(x, y),
  ['BLUE']: (x, y) => new BubBuilder(color(2, 2, 255), 7, 2, 40, 2).mutate().build(x, y),
  ['GREEN']: (x, y) => new BubBuilder(color(2, 255, 2), 5, 4, 40, 2).mutate().build(x, y),
};
