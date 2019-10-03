let simulation;
let input;
let turn;
let turnsByFrameInput;
let turnsByFrame;
let buttonMinus;
let buttonReset;
let buttonConfirmTurnsByFrame;
let buttonPlus;
let gen;
let initialTurnsByFrame = 1;

let nextFoodStock = [];

function add(population, bub) {
  bub.addListener('destroy', ({ dispatcher }) => {
    population.splice(population.indexOf(dispatcher), 1);
    nextFoodStock.push(new Food(dispatcher.position.x, dispatcher.position.y, dispatcher.size));
  });
  population.push(bub);
  setFrameRate(60);
}

function setTurnsByFrame(newValue) {
  newValue = max(0, newValue);
  turnsByFrame = newValue;
  turnsByFrameInput.value(turnsByFrame);
}

function setup() {
  input = createInput();
  input.position(0, 0);

  turnsByFrameInput = createInput();
  turnsByFrameInput.position(200, 0);

  buttonMinus = createButton('<<');
  buttonMinus.position(250, 0);
  buttonMinus.mousePressed(() => setTurnsByFrame(turnsByFrame - 1));

  buttonConfirmTurnsByFrame = createButton('Change turns by frame');
  buttonConfirmTurnsByFrame.position(280, 0);
  buttonConfirmTurnsByFrame.mousePressed(() => setTurnsByFrame(turnsByFrameInput.value()));

  buttonReset = createButton('Reset');
  buttonReset.position(330, 20);
  buttonReset.mousePressed(() => setTurnsByFrame(initialTurnsByFrame));

  buttonPlus = createButton('>>');
  buttonPlus.position(430, 0);
  buttonPlus.mousePressed(() => setTurnsByFrame(turnsByFrame + 1));

  createCanvas(800, 600);

  simulation = setupSimulation();
  setTurnsByFrame(initialTurnsByFrame);
  gen = 0;
}

function setupSimulation(
  populationFactory = () => {
    const population = [];
    for (let i = 0; i < 8; i++) {
      add(population, species.RED(i * 100, 200));
      add(population, species.GREEN(i * 100, 400));
      add(population, species.BLUE(i * 100, 0));
      add(population, species.RED(i * 100, 100));
      add(population, species.GREEN(i * 100, 300));
      add(population, species.BLUE(i * 100, 500));
    }
    return population;
  }
) {
  gen++;
  return new Simulation(populationFactory(), {
    shouldReplenish: turn => turn === 1 || turn % 100 === 0,
    replenish: replenishFood,
  });
}

function breedCouple(first, second) {
  return first.breed(second);
}

function breedPopulation(population) {
  const newPopulation = [];

  population.forEach(bub => delete bub.target);

  if (population.length % 2 !== 0) {
    newPopulation.push(population.shift());
  }

  while (population.length >= 2) {
    const [first, second] = [population.shift(), population.shift()];

    add(newPopulation, breedCouple(first, second));
    add(newPopulation, first);
    add(newPopulation, second);
  }

  return newPopulation;
}

function draw() {
  const turn = simulation.draw(turnsByFrame);
  if (turn) input.value(`Gen. ${gen} Turn: ${turn}`);
  else simulation = setupSimulation(() => breedPopulation(simulation.population));
}

function replenishFood(food) {
  for (let i = 0; i < 50; i++) {
    nextFoodStock.push(new Food(int(random(0, width)), int(random(0, height))));
  }

  while (nextFoodStock.length > 0) {
    const nextFood = nextFoodStock.shift();

    nextFood.addListener('destroy', ({ dispatcher }) => food.splice(food.indexOf(dispatcher), 1));

    food.push(nextFood);
  }
}
