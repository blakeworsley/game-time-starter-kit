function Collision(surfer) {
  this.surfer = surfer;
}

Collision.prototype.checkForCollision = function(obstacles) {
  return obstacles.find(function(obstacle) {
    return this.isCollision(obstacle);
  }, this);
};

Collision.prototype.frontColliding = function (obstacle) {
  return obstacle.x < this.surfer.right;
};

Collision.prototype.backColliding = function (obstacle) {
  return obstacle.right > this.surfer.x;
};

Collision.prototype.surferBottomCollidingWithObstacleTop = function (obstacle) {
  return obstacle.y < this.surfer.bottom;
};

Collision.prototype.isCollision = function(obstacle) {
  return this.frontColliding(obstacle) && this.backColliding(obstacle) && this.surferBottomCollidingWithObstacleTop(obstacle);
};

module.exports = Collision;
