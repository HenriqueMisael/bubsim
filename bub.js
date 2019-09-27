class Bub extends RigidBody {
  constructor(
    x,
    y,
    color,
    size = random(5, 10),
    accelerationOptions = [
      p5.Vector.random2D(),
      p5.Vector.random2D(),
      p5.Vector.random2D(),
      p5.Vector.random2D(),
    ],
    maxSpeed = random(1, 4),
    lineOfSight = random(20, 40),
    agility = random(1, 3)
  ) {
    super(x, y, size, ['bub']);
    this.color = color;
    this.accelerationOptions = accelerationOptions;
    this.acceleration = createVector();
    this.velocity = p5.Vector.random2D();
    this.maxSpeed = maxSpeed;
    this.lineOfSight = lineOfSight;
    this.agility = agility;
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

  preventCollisions(population) {
    const steering = createVector();
    let total = 0;

    for (let other of population) {
      if (this.willCollideWith(other)) {
        let diff = p5.Vector.sub(this.position, other.position);
        steering.add(diff);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.agility);
    }

    this.acceleration.add(steering);
  }

  willCollideWith(other) {
    return checkCollision(other, this.position, this.size + this.lineOfSight);
  }

  update() {
    this.acceleration.add(this.accelerationOptions[0]);
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);
  }

  draw() {
    strokeWeight(this.size * 2);
    stroke(this.color);
    point(this.position.x, this.position.y);
  }
}
