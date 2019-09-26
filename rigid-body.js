let nextID = 0;

class RigidBody {
    constructor(
        x,
        y,
        size,
        tags = []
    ) {
        this.position = createVector(x, y);
        this.size = size;
        this.tags = tags;

        this.id = nextID++;
    }

    hadCollideWith(other) {
        return checkCollision(other, this.position, this.size);
    }
}
