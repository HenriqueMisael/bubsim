class Food extends RigidBody {
  constructor(x, y, size = random(1, 4)) {
    super(x, y, size, ['food']);
  }

  draw() {
    strokeWeight(this.size);
    stroke(color(255));
    point(this.position.x, this.position.y);
  }

  onCollision(other) {
    if (other.tags.includes('bub')) {
      this.dispatch('destroy');
    }
  }
}
