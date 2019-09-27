class Bub extends RigidBody {
  constructor(
    x,
    y,
    color,
    size = random(5, 10),
    maxSpeed = random(1, 4),
    lineOfSight = random(20, 40),
    agility = random(1, 3),
    energy = 1000,
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
    if(this.target) return;

    const nearbyFoods = [];

    for (let other of food) {
      if (this.isOnLineOfSight(other)) {
        const position = other.position;
        const cost = this.calculateEnergyCost(other.position * dist(this.position, position));
        const size = other.size;
        nearbyFoods.push({cost, size, position});
      }
    }

    if (nearbyFoods.length > 0) {
      const betterOption = nearbyFoods.sort((a, b) => b.size / b.cost - a.size / a.cost)[0];
      this.target = betterOption;
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

    this.energy -= this.calculateEnergyCost(this.acceleration);
    this.acceleration.mult(0);
  }

  draw() {
    strokeWeight(this.size * 2);
    stroke(this.color);
    point(this.position.x, this.position.y);
  }

  onCollision(other) {
    if (other.tags.includes('bub') && other.size >= this.size) {
      this.energy = 0;
    }

    if (other.tags.includes('food')) {
      this.energy += other.size * this.metabolismEffectiveness;
      delete this.target;
    }
  }
}
