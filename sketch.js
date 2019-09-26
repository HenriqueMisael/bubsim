const populations = [];

const createObjectFactory = basis =>
  function() {
    const [r, g, b] = [random(0, basis * 27), random(0, basis * 29), random(0, basis * 31)];
    populations.push(new Bub(basis * 20, 0, color(r, g, b)));
  };

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < 1; i++) {
    setTimeout(createObjectFactory(i), i * 1000);
  }
}

function draw() {
  background(51);
  populations.forEach(bub => {
    bub.update();
    bub.edges();
    bub.draw();
  });
}
