const consistencyFactory = (init, end) => () => int(random(init, end));

class RigidBody {
  static planPath(velocityOptions, consistency) {
    console.log(`Planning path for ${consistency} moves`);

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
    this.position = createVector(x, y);
    this.size = size;
    this.color = color;
    this.velocityOptions = velocityOptions;
    this.consistency = consistency;
    this.velocities = RigidBody.planPath(velocityOptions, consistency());

    console.log(consistency);
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
      this.velocities = RigidBody.planPath(this.velocityOptions, this.consistency());
    else this.position.add(this.velocities.pop());
  }

  draw() {
    strokeWeight(this.size);
    stroke(this.color);
    point(this.position.x, this.position.y);
  }
}
