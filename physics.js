function checkCollision(object, areaCenter, areaRadius) {
    return Math.pow(object.position.x - areaCenter.x, 2) + Math.pow(areaCenter.y - object.position.y, 2) <= Math.pow(areaRadius + object.size, 2);
}
