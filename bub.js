class Bub extends RigidBody {

  static baseEnergy = 1000;

  constructor(
    x,
    y,
    color,
    size = random(5, 10),
    maxSpeed = random(1, 4),
    lineOfSight = random(20, 40),
    agility = random(1, 3),
    energy = Bub.baseEnergy,
    metabolismEffectiveness = random(0, 10),
    accelerationOptions = [new AccelerationOption()]
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
        other.addListener("destroy", () => delete this.target);
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
    return (abs(velocity.x) + abs(velocity.y)) * 0.05 * this.size + this.size * 0.03;
  }

  consumeEnergy(amount) {
    if (amount >= this.energy) this.dispatch("destroy");

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

    this.consumeEnergy(this.calculateEnergyCost(this.acceleration))
    this.acceleration.mult(0);
  }

  draw() {
    strokeWeight(this.size * 2);
    stroke(this.color);
    point(this.position.x, this.position.y);
  }

  onCollision(other) {
    if (other.tags.includes('bub') && other.size >= this.size) {
      this.dispatch("destroy");
    }

    if (other.tags.includes('food')) {
      this.energy += other.size * this.metabolismEffectiveness;
    }
  }

  breed(couple) {

    const thisEnergy = this.energy / 3;
    this.energy -= thisEnergy;

    const coupleEnergy = couple.energy / 3;
    couple.energy -= coupleEnergy;

    return new Bub(0, 0,
      lerpColor(this.color, couple.color, 0.5),
      (this.size + couple.size) / 2,
      (this.maxSpeed + couple.maxSpeed) / 2,
      (this.lineOfSight + couple.lineOfSight) / 2,
      (this.agility + couple.agility) / 2,
      thisEnergy + coupleEnergy,
      (this.metabolismEffectiveness + couple.metabolismEffectiveness) / 2,
      this.accelerationOptions.concat(couple.accelerationOptions)
    );
  }
}
