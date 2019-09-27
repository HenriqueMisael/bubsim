let population = [];
let markedDeletion = [];

const createObjectFactory = basis =>
  function() {
    const [r, g, b] = [random(0, basis * 27), random(0, basis * 29), random(0, basis * 31)];
    population.push(new Bub(10 + basis * 20, 10, color(r, g, b)));
  };

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < 40; i++) {
    setTimeout(createObjectFactory(i), i * 1000);
  }
}

function draw() {
  background(51);
  population.forEach(bub => {
    bub.edges();
    bub.preventCollisions(population);
    bub.update();
    bub.draw();
    const collided = population.find(other => other.id !== bub.id && bub.hadCollideWith(other));
    if (collided) {
      markedDeletion.push(collided);
      markedDeletion.push(bub);
    }
  });

  population = population.filter(bub => !markedDeletion.includes(bub));
  markedDeletion = [];
}
