let nextID = 0;

class RigidBody extends GameObject {
  constructor(x, y, size, tags = []) {
    super(nextID);
    this.position = createVector(x, y);
    this.size = size;
    this.tags = tags;

    this.id = nextID++;
  }

  hadCollideWith(other) {
    return checkCollision(other, this.position, this.size);
  }

  onCollision(other) {}
}
