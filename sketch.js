let population = [];
let dead = [];

let food = [];

let input;
let turn;

function add(bub) {
  bub.addListener("destroy", ({dispatcher}) => {
    population.splice(population.indexOf(dispatcher), 1);
    dead.push(dispatcher);
  });
  population.push(bub);
}

function setup() {
  input = createInput();
  input.position(0, 0);
  createCanvas(800, 600);
  for (let i = 0; i < 8; i++) {
    add(species.RED(i * 100, 200));
    add(species.GREEN(i * 100, 400));
    add(species.BLUE(i * 100, 0));
    add(species.RED(i * 100, 100));
    add(species.GREEN(i * 100, 300));
    add(species.BLUE(i * 100, 500));
  }
  turn = 0;
}

function draw() {
  background(51);

  if (turn++ % 100 === 0) {
    replenishFood(food);
  }

  input.value(`Turn: ${turn}`);

  food.forEach(food => food.draw());

  population.forEach(bub => {
    bub.edges();
    bub.preventCollisions(population);
    bub.checkFoodNearby(food);
    bub.update();
    bub.draw();
    const collided = population.find(other => other.id !== bub.id && bub.hadCollideWith(other));
    if (collided) {
      bub.onCollision(collided);
      collided.onCollision(bub);
    } else {
      const foodFound = food.find(food => bub.hadCollideWith(food));
      if (foodFound) {
        bub.onCollision(foodFound);
        foodFound.onCollision(bub);
      }
    }
  });
}

function replenishFood(food) {
  for (let i = 0; i < 100; i++) {
    const newFood = new Food(int(random(0, width)), int(random(0, height)));

    newFood.addListener("destroy", ({dispatcher}) => food.splice(food.indexOf(dispatcher), 1));

    food.push(newFood);
  }
}
