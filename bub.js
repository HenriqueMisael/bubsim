const consistencyFactory = (init, end) => () => int(random(init, end));

class Bub extends RigidBody {
  static planPath(velocityOptions, consistency) {
    const velocities = [];
    const chosen = int(random(0, velocityOptions.length - 1));
    for (let i = consistency; i > 0; i--) velocities.push(velocityOptions[chosen]);
    return velocities;
  }

  constructor(
    x,
    y,
    color,
    size = random(10, 20),
    velocityOptions = [
      p5.Vector.random2D(),
      p5.Vector.random2D(),
      p5.Vector.random2D(),
      p5.Vector.random2D(),
    ],
    consistency = consistencyFactory(int(random(1, 10)), int(random(1, 30)))
  ) {
    super(x, y, size);
    this.color = color;
    this.velocityOptions = velocityOptions;
    this.consistency = consistency;
    this.velocities = [];
  }

  edges() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = height;
    }
  }

  update() {
    if (this.velocities.length === 0)
      this.velocities = Bub.planPath(this.velocityOptions, this.consistency());
    else this.position.add(this.velocities.pop());
  }

  draw() {
    strokeWeight(this.size);
    stroke(this.color);
    point(this.position.x, this.position.y);
  }
}
