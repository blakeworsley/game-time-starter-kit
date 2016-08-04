/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const canvas = document.getElementById('surfer-game');
	const Game = __webpack_require__(1);
	const KEYS = __webpack_require__(7);

	var game = new Game(canvas);

	document.addEventListener('keydown', function (e) {
	  if (e.keyCode === KEYS.spacebar) {
	    if (game.world.surfer.bottom > 189 && game.active) {
	      game.world.surfer.velocity = -13;
	    }
	    if (!game.active) {
	      game = new Game(canvas);
	    }
	  }
	});

	requestAnimationFrame(function gameLoop() {
	  if (game.active) {
	    game.cycle();
	  }
	  requestAnimationFrame(gameLoop);
	});

	module.exports = canvas;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Rock = __webpack_require__(2);
	const World = __webpack_require__(3);
	const Surfer = __webpack_require__(4);
	const Collision = __webpack_require__(5);
	const FONTS = __webpack_require__(6);
	const canvas = document.getElementById('surfer-game');

	function Game() {
	  this.canvas = canvas;
	  this.context = this.canvas.getContext('2d');
	  this.floor = this.canvas.height - 10;
	  this.surfer = new Surfer({});
	  this.rocks = this.createRocks();
	  this.world = new World(this.canvas.width, this.canvas.height, this.floor, this.surfer, this.rocks);
	  this.collision = new Collision(this.surfer);
	  this.tick = 0;
	  this.score = 0;
	  this.active = true;
	}

	Game.prototype.cycle = function () {
	  this.renderWorld(this.context, this.world);
	  this.animateSurfer();
	  if (this.collision.checkForCollision(this.rocks)) {
	    this.gameOver();
	  }
	  this.rocks.forEach(function (rock) {
	    rock.moveLeft();
	  });
	  this.world.surfer.jump();
	  this.tick++;
	  if (this.tick % 5 === 0) {
	    this.score++;
	  }
	  this.speedUpRock();
	};

	Game.prototype.renderWorld = function () {
	  this.context.clearRect(0, 0, this.world.width, this.world.height);
	  this.rocks.forEach(function (rock) {
	    if (rock.size === 'small') {
	      this.context.drawImage(rock.image, 0, 0, 25, 25, rock.x, rock.y, 25, 25);
	    }
	    if (rock.size === 'medium') {
	      this.context.drawImage(rock.image, 0, 0, 35, 35, rock.x, rock.y, 35, 35);
	    }
	    if (rock.size === 'large') {
	      this.context.drawImage(rock.image, 0, 0, 40, 40, rock.x, rock.y, 40, 40);
	    }
	  }.bind(this));
	  this.context.font = FONTS.main;
	  this.context.fillText('Score: ' + this.score, 425, 40);
	};

	Game.prototype.createRocks = function () {
	  return [new Rock({ game: this }).small(), new Rock({ game: this }).medium(), new Rock({ game: this }).large()];
	};

	Game.prototype.speedUpRock = function () {
	  if (this.score % 101 === 0) {
	    return this.rocks.forEach(function (rock) {
	      return rock.speed += 0.05;
	    });
	  }
	};

	Game.prototype.gameOver = function () {
	  this.context.font = FONTS.large;
	  this.context.fillText('Game Over', 160, 105);
	  this.active = false;
	};

	// ANIMATING THE SURFER

	Game.prototype.animateSurfer = function () {
	  if (this.firstThird()) {
	    this.context.drawImage(this.world.surfer.image, 0, 0, 50, 60, this.world.surfer.x, this.world.surfer.y, 50, 60);
	  } else if (this.secondThird()) {
	    this.context.drawImage(this.world.surfer.image, 50, 0, 50, 60, this.world.surfer.x, this.world.surfer.y, 50, 60);
	  } else {
	    this.context.drawImage(this.world.surfer.image, 100, 0, 50, 60, this.world.surfer.x, this.world.surfer.y, 50, 60);
	  }
	  this.resetTick();
	};

	Game.prototype.resetTick = function () {
	  if (this.tick >= 60) {
	    this.tick = 0;
	  }
	};

	Game.prototype.firstThird = function () {
	  return this.tick > 0 && this.tick < 20;
	};

	Game.prototype.secondThird = function () {
	  return this.tick > 20 && this.tick < 40;
	};

	module.exports = Game;

/***/ },
/* 2 */
/***/ function(module, exports) {

	function Rock(options) {
	  this.width = options.width || 25;
	  this.height = options.height || 25;
	  this.x = this.placeRock();
	  this.y = options.y || 190 - this.height;
	  this.bottom = this.y + this.height;
	  this.right = this.x + this.width;
	  this.offset = 150;
	  this.speed = 6;
	}

	Rock.prototype.isOffScreenLeft = function () {
	  return this.x < 0 - this.width;
	};

	Rock.prototype.moveLeft = function () {
	  if (this.isOffScreenLeft()) {
	    this.placeRock();
	    return;
	  }
	  this.x = this.x - this.speed;
	  this.right = this.x + this.width;
	  return this;
	};

	Rock.prototype.small = function () {
	  this.y = 165;
	  this.width = 25;
	  this.height = 25;
	  this.image = new Image();
	  this.image.src = `./img/small-rock.png`;
	  this.size = 'small';
	  return this;
	};

	Rock.prototype.medium = function () {
	  this.y = 155;
	  this.width = 35;
	  this.height = 35;
	  this.image = new Image();
	  this.image.src = `./img/medium-rock.png`;
	  this.size = 'medium';
	  return this;
	};

	Rock.prototype.large = function () {
	  this.y = 150;
	  this.width = 40;
	  this.height = 40;
	  this.image = new Image();
	  this.image.src = `./img/large-rock.png`;
	  this.size = 'large';
	  return this;
	};

	Rock.prototype.randomXGenerator = function () {
	  return Math.floor(Math.random() * (3000 - 600)) + 600;
	};

	Rock.prototype.placeRock = function () {
	  this.x = this.randomXGenerator();
	  return this.x;
	};

	module.exports = Rock;

/***/ },
/* 3 */
/***/ function(module, exports) {

	function World(width, height, floor, surfer, rocks) {
	  this.width = width || 600;
	  this.height = height || 200;
	  this.surfer = surfer;
	  this.rocks = rocks;
	  this.floor = floor;
	}

	module.exports = World;

/***/ },
/* 4 */
/***/ function(module, exports) {

	function Surfer(options) {
	  this.x = options.x || 20;
	  this.y = options.y || 130;
	  this.width = 50;
	  this.height = 60;
	  this.right = this.x + this.width;
	  this.gravity = 1;
	  this.velocity = 0;
	  this.bottom = this.y + this.height || 190;
	  this.image = new Image();
	  this.image.src = `./img/surfer.png`;
	}

	Surfer.prototype.jump = function () {
	  if (this.belowGround()) {
	    // If so, move us back to ground level and set velocity to zero
	    this.resetAtGround();
	  } else {
	    // Otherwise, move what is indicated by velocity
	    this.up();
	  }
	};

	Surfer.prototype.belowGround = function () {
	  return this.y + this.velocity + this.height > 190;
	};

	Surfer.prototype.up = function () {
	  this.velocity += this.gravity;
	  this.y += this.velocity - this.gravity;
	  this.bottom = this.y + this.height;
	};

	Surfer.prototype.resetAtGround = function () {
	  this.velocity = 0;
	  this.y = 190 - this.height;
	  this.bottom = this.y + this.height;
	};

	module.exports = Surfer;

/***/ },
/* 5 */
/***/ function(module, exports) {

	function Collision(surfer) {
	  this.surfer = surfer;
	}

	Collision.prototype.checkForCollision = function (obstacles) {
	  return obstacles.find(function (obstacle) {
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

	Collision.prototype.isCollision = function (obstacle) {
	  return this.frontColliding(obstacle) && this.backColliding(obstacle) && this.surferBottomCollidingWithObstacleTop(obstacle);
	};

	module.exports = Collision;

/***/ },
/* 6 */
/***/ function(module, exports) {

	const FONTS = {
	  main: '40px Covered By Your Grace',
	  large: '70px Covered By Your Grace'
	};

	module.exports = FONTS;

/***/ },
/* 7 */
/***/ function(module, exports) {

	const KEYS = {
	  spacebar: 32
	};

	module.exports = KEYS;

/***/ }
/******/ ]);