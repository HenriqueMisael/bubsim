class Bub extends RigidBody {
  constructor(
    x,
    y,
    color,
    size,
    maxSpeed,
    lineOfSight,
    agility,
    metabolismEffectiveness,
    energy,
    accelerationOptions
  ) {
    super(x, y, size, ['bub']);
    this.color = color;
    this.accelerationOptions = accelerationOptions;
    this.acceleration = createVector();
    this.velocity = p5.Vector.random2D();
    this.maxSpeed = maxSpeed;
    this.lineOfSight = lineOfSight;
    this.agility = agility;
    this.energy = energy;
    this.metabolismEffectiveness = metabolismEffectiveness;
    this.age = 0;
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
      if (other.size >= this.size && this.isOnLineOfSight(other)) {
        let diff = p5.Vector.sub(this.position, other.position);
        steering.add(diff);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.limit(this.agility);
      this.accelerationOptions.unshift(new AccelerationOption(steering));
    }

    this.acceleration.add(steering);
  }

  checkFoodNearby(food) {
    if (this.target) return;

    for (let other of food) {
      if (this.isOnLineOfSight(other)) {
        other.addListener('destroy', () => delete this.target);
        this.target = other;
        return;
      }
    }
  }

  isOnLineOfSight(other) {
    return checkCollision(other, this.position, this.size + this.lineOfSight);
  }

  chooseAcceleration() {
    const total = this.accelerationOptions.reduce(
      (acc, accelerationOption) => acc + accelerationOption.probability,
      0
    );
    let randomNumber = random(0, total);

    let i = 0;
    for (let option of this.accelerationOptions) {
      if (option.probability >= randomNumber) {
        return option.vector;
      }
      i++;
      randomNumber -= option.probability;
    }
  }

  calculateEnergyCost(velocity) {
    return (abs(velocity.x) + abs(velocity.y)) * 0.1 * this.size + this.size * 0.1;
  }

  consumeEnergy(amount) {
    if (amount >= this.energy) this.dispatch('destroy');

    this.energy -= amount;
  }

  update() {
    if (this.target) {
      const acceleration = this.target.position.copy();
      acceleration.sub(this.position);
      acceleration.setMag(this.maxSpeed);
      this.acceleration.add(acceleration);
    } else if (this.acceleration.x === 0 && this.acceleration.y === 0) {
      this.acceleration.add(this.chooseAcceleration());
    }

    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);

    this.consumeEnergy(this.calculateEnergyCost(this.acceleration));
    this.acceleration.mult(0);
    this.age++;
  }

  draw() {
    strokeWeight(this.size * 2);
    stroke(this.color);
    point(this.position.x, this.position.y);
  }

  onCollision(other) {
    if (other.tags.includes('bub')) {
      const power = this.energy * this.size;
      const otherPower = other.energy * other.size;
      if (otherPower >= power) this.dispatch('destroy');
      else {
        this.energy -= otherPower / this.size;
      }
    }

    if (other.tags.includes('food')) {
      this.energy += other.size * this.metabolismEffectiveness;
    }
  }

  breed(other) {
    const position = p5.Vector.lerp(this.position, other.position, 0.5);
    return new BubBuilder(
      lerpColor(this.color, other.color, 0.5),
      lerp(this.size, other.size, 0.5),
      lerp(this.maxSpeed, other.maxSpeed, 0.5),
      lerp(this.lineOfSight, other.lineOfSight, 0.5),
      lerp(this.agility, other.agility, 0.5),
      lerp(this.metabolismEffectiveness, other.metabolismEffectiveness, 0.5)
    )
      .mutate()
      .build(position.x, position.y);
  }
}
