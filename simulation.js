class Simulation {
  /*
   *
   * @param {Array} population
   * @param {FoodReplenishRule} foodReplenishRule
   */
  constructor(population, foodReplenishRule) {
    this.population = population;
    this.foodReplenishRule = foodReplenishRule;
    this.food = [];
    this.turn = 1;
  }

  draw(turnsToRun = 1) {
    while (turnsToRun--) {
      if (this.turn++ >= 250) return false;
      background(51);

      if (this.foodReplenishRule.shouldReplenish(this.turn)) {
        this.foodReplenishRule.replenish(this.food);
      }

      this.food.forEach(food => food.draw());

      this.population.forEach(bub => {
        bub.edges();
        bub.preventCollisions(this.population);
        bub.checkFoodNearby(this.food);
        bub.update();
        bub.draw();
        const collided = this.population.find(other => other.id !== bub.id && bub.hadCollideWith(other));
        if (collided) {
          bub.onCollision(collided);
          collided.onCollision(bub);
        } else {
          const foodFound = this.food.find(food => bub.hadCollideWith(food));
          if (foodFound) {
            bub.onCollision(foodFound);
            foodFound.onCollision(bub);
          }
        }
      });
    }

    return this.turn;
  }
}
