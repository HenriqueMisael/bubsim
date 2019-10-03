function tryMutateColor(originalColor) {
  if (random() <= BubBuilder.mutationRate) {
    const [r, g, b] = originalColor.levels;

    return color(tryMutate(r), tryMutate(g), tryMutate(b));
  }
  return originalColor;
}

function tryMutate(number) {
  if (random() <= BubBuilder) {
    return random(number * (1 - BubBuilder.mutationRange), number * (1 + BubBuilder.mutationRange));
  }
  return number;
}

class BubBuilder {
  static mutationRate = 0.1;
  static mutationRange = 0.5;

  constructor(
    color = color(int(random(0, 255)), int(random(0, 255)), int(random(0, 255))),
    size = random(5, 10),
    maxSpeed = random(1, 4),
    lineOfSight = random(20, 40),
    agility = random(1, 3),
    energy = 1000,
    metabolismEffectiveness = random(0, 10),
    accelerationOptions = [new AccelerationOption()]
  ) {
    this.color = color;
    this.size = size;
    this.maxSpeed = maxSpeed;
    this.lineOfSight = lineOfSight;
    this.agility = agility;
    this.energy = energy;
    this.metabolismEffectiveness = metabolismEffectiveness;
    this.accelerationOptions = accelerationOptions;
  }

  mutate() {
    this.color = tryMutateColor(this.color);
    this.size = tryMutate(this.size);
    this.maxSpeed = tryMutate(this.maxSpeed);
    this.lineOfSight = tryMutate(this.lineOfSight);
    this.agility = tryMutate(this.agility);
    this.energy = tryMutate(this.energy);
    this.metabolismEffectiveness = tryMutate(this.metabolismEffectiveness);
    this.accelerationOptions = tryMutate(this.accelerationOptions);

    return this;
  }

  build(x, y) {
    return new Bub(
      x,
      y,
      this.color,
      this.size,
      this.maxSpeed,
      this.lineOfSight,
      this.agility,
      this.energy,
      this.metabolismEffectiveness,
      this.accelerationOptions
    );
  }
}
