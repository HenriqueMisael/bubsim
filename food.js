class Food extends RigidBody {
  constructor(x, y) {
    super(x, y, random(1, 4), ['food']);
  }

  draw() {
    strokeWeight(this.size);
    stroke(color(255));
    point(this.position.x, this.position.y);
  }

  onCollision(other) {
    if (other.tags.includes('bub')) {
      this.size = 0;
    }
  }
}
