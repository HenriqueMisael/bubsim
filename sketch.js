let simulation;
let input;
let turn;
let turnsByFrameInput;
let turnsByFrame;
let buttonConfirmTurnsByFrame;

function add(population, bub) {
  bub.addListener('destroy', ({ dispatcher }) => {
    population.splice(population.indexOf(dispatcher), 1);
  });
  population.push(bub);
  setFrameRate(60);
}

function setup() {
  input = createInput();
  input.position(0, 0);
  turnsByFrameInput = createInput();
  turnsByFrameInput.position(200, 0);
  buttonConfirmTurnsByFrame = createButton('Change turns by frame');
  buttonConfirmTurnsByFrame.position(310, 0);
  buttonConfirmTurnsByFrame.mousePressed(() => (turnsByFrame = turnsByFrameInput.value()));
  createCanvas(800, 600);

  simulation = setupSimulation();
  turnsByFrame = 1;
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
  return new Simulation(populationFactory(), {
    shouldReplenish: turn => turn % 100 === 0,
    replenish: replenishFood,
  });
}

function draw() {
  const turn = simulation.draw(turnsByFrame);
  if (turn) input.value(`Turn: ${turn}`);
  else simulation = setupSimulation();
}

function replenishFood(food) {
  for (let i = 0; i < 10; i++) {
    const newFood = new Food(int(random(0, width)), int(random(0, height)));

    newFood.addListener('destroy', ({ dispatcher }) => food.splice(food.indexOf(dispatcher), 1));

    food.push(newFood);
  }
}
