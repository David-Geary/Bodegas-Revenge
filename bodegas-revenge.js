var BodegasRevenge = function () {
   this.CLOCKWISE = 0;
   this.COUNTER_CLOCKWISE = 1;

   this.canvas = document.getElementById('game-canvas');
   this.context = this.canvas.getContext('2d');

   // Ruler canvas and its context......................................

   this.rulerCanvas = document.getElementById('ruler-canvas');
   this.rulerContext = this.rulerCanvas.getContext('2d');

   // Bullet canvas and its context......................................

   this.bulletCanvas = document.getElementById('bullet-canvas');
   this.bulletContext = this.bulletCanvas.getContext('2d');

   this.initialCursor = this.rulerCanvas.style.cursor;

   // Score.............................................................

   this.score = 0;

   // High scores.......................................................

   this.highScoreElement = 
      document.getElementById('high-score-toast');

   this.highScoreListElement = 
      document.getElementById('high-score-list');

   this.highScoreNameElement = 
      document.getElementById('high-score-name');

   this.highScoreNewGameElement = 
      document.getElementById('high-score-new-game');

   this.highScoreAddScoreElement = 
      document.getElementById('high-score-add-score');

   this.highScorePending = false;
   this.highScoresVisible = false;

   this.HIGH_SCORE_TRANSITION_DURATION = 1000;

   // Time..............................................................

   this.timeSystem = new TimeSystem(); // See js/timeSystem.js

   this.timeRate = 1.0; // 1.0 is normal speed, 0.5 is 1/2 speed, etc.
   this.SHORT_DELAY = 50; // milliseconds
   this.TIME_RATE_DURING_TRANSITIONS = 0.2;
   this.NORMAL_TIME_RATE = 1.0;
   this.MAX_TIME_RATE = 2.0;

   this.RUNNER_LEFT = 50,
   this.STARTING_RUNNER_TRACK = 1,

   // Pixels and meters.................................................

   this.CANVAS_WIDTH_IN_METERS = 13;  // Proportional to sprite sizes

   this.PIXELS_PER_METER = this.canvas.width / 
                           this.CANVAS_WIDTH_IN_METERS;

   // Gravity...........................................................

   this.GRAVITY_FORCE = 9.81; // m/s/s

   // Smoking holes.....................................................
   
   this.showSmokingHoles = true;

   // Music.............................................................

   this.musicElement = document.getElementById('music');
   this.musicElement.volume = 0.05;

   this.musicCheckboxElement = 
      document.getElementById('music-checkbox');

   this.musicOn = this.musicCheckboxElement.checked;

   // Sound effects.....................................................

   this.soundCheckboxElement = 
      document.getElementById('sound-checkbox');

   this.soundOn = this.soundCheckboxElement.checked;

   // Sounds............................................................

   this.turretFiringSound = {
      position: 8.0, // seconds
      duration: 161, // milliseconds
      volume: 0.1,      
   };

   this.explosionSound = {
      position: 3.28, // seconds
      duration: 891, // milliseconds
      volume: 0.1,      
   };

   this.audioChannels = [ // 4 channels (see createAudioChannels())
      { playing: false, audio: null, },
      { playing: false, audio: null, },
      { playing: false, audio: null, }
   ];

   this.audioSpriteCountdown = this.audioChannels.length;

   // Constants.........................................................

   this.LEFT = 1,
   this.RIGHT = 2,

   this.SHORT_DELAY = 50; // milliseconds

   this.TRANSPARENT = 0,
   this.OPAQUE = 1.0,

   this.BACKGROUND_VELOCITY = 42,

   // Background width and height.......................................

   this.BACKGROUND_WIDTH = 1102;
   this.BACKGROUND_HEIGHT = 400;

   // Running slowly warning............................................

   this.FPS_SLOW_CHECK_INTERVAL = 2000; // Only check every 2 seconds
   this.DEFAULT_RUNNING_SLOWLY_THRESHOLD = 30; // fps
   this.MAX_RUNNING_SLOWLY_THRESHOLD = 60; // fps
   this.RUNNING_SLOWLY_FADE_DURATION = 2000; // seconds

   this.runningSlowlyElement = 
      document.getElementById('running-slowly');

   this.slowlyOkayElement = 
      document.getElementById('slowly-okay');

   this.slowlyDontShowElement = 
      document.getElementById('slowly-dont-show');

   this.slowlyWarningElement = 
      document.getElementById('slowly-warning');

   this.runningSlowlyThreshold = this.DEFAULT_RUNNING_SLOWLY_THRESHOLD;

   // Slow fps detection and warning....................................

   this.lastSlowWarningTime = 0;
   this.showSlowWarning = false;
   
   this.speedSamples = [60,60,60,60,60,60,60,60,60,60];
   this.speedSamplesIndex = 0;

   this.NUM_SPEED_SAMPLES = this.speedSamples.length;

   // Credits...........................................................

   this.creditsElement = document.getElementById('credits');
   this.newGameLink = document.getElementById('new-game-link');

   // Loading screen....................................................

   this.loadingElement = document.getElementById('loading');
   this.loadingTitleElement = document.getElementById('loading-title');
   this.runnerAnimatedGIFElement = 
      document.getElementById('loading-animated-gif');

   // Welcome screen....................................................

   this.welcomeElement = document.getElementById('welcome');
   this.startLink = document.getElementById('start');

   this.STARTING_BACKGROUND_VELOCITY = 0,

   this.STARTING_BACKGROUND_OFFSET = 0,
   this.STARTING_SPRITE_OFFSET = 0,

   // States............................................................

   this.paused = false;
   this.PAUSED_CHECK_INTERVAL = 200;
   this.windowHasFocus = true;
   this.countdownInProgress = false;
   this.gameStarted = false;
   this.playing = false;
   this.stalled = false;

   // Images............................................................
   
   this.spritesheet = new Image(),

   // Time..............................................................
   
   this.lastAnimationFrameTime = 0,
   this.lastFpsUpdateTime = 0,
   this.fps = 60,

   // Toast.............................................................

   this.toastElement = document.getElementById('toast'),

   // Instructions......................................................

   this.instructionsElement = document.getElementById('instructions');

   // Copyright.........................................................

   this.copyrightElement = document.getElementById('copyright');

   // Score.............................................................

   this.scoreElement = document.getElementById('score'),

   // Sound and music...................................................

   this.soundAndMusicElement = document.getElementById('sound-and-music');

   // Tweet score.......................................................

   this.tweetElement = document.getElementById('tweet');

   TWEET_PREAMBLE = 'https://twitter.com/intent/tweet?text=I scored ';
   TWEET_PROLOGUE = ' playing an HTML5 Canvas game: ' +
                    'http://bit.ly/1lLvuld &hashtags=html5';

   // Translation offsets...............................................
   
   this.backgroundOffset = this.STARTING_BACKGROUND_OFFSET,
   this.spriteOffset = this.STARTING_SPRITE_OFFSET;
   
   // Velocities........................................................

   this.bgVelocity = this.STARTING_BACKGROUND_VELOCITY;
   this.platformVelocity;

   // Sprites...........................................................

   this.sprites = [];
   this.turretCell = [
      {left: 12,  top: 120, width: 68, height: 40},
   ];

   this.turretFiringCells = [
      {left: 91,  top: 120, width: 68, height: 40},
      {left: 170, top: 121, width: 68, height: 40},
      {left: 250, top: 122, width: 68, height: 40},
      {left: 329, top: 123, width: 68, height: 40},
   ];

   this.turretData = { left: 50, top: 180 };

   this.turretRotation = 0;

   this.TURRET_WIDTH  = 68;
   this.TURRET_HEIGHT = 40;

   this.TURRET_CENTER_X = 20;
   this.TURRET_CENTER_Y = 20;

   this.TURRET_CYCLE_DURATION = 10;

   this.TURRET_FIRING_DURATION = this.TURRET_CYCLE_DURATION * 
                                 this.turretFiringCells.length;

   this.TURRET_SHOT_INTERVAL = this.TURRET_FIRING_DURATION * 1.5;

   this.EXPLOSION_CELL_HEIGHT = 62;

   this.explosionCells = [
      { left: 12,  top: 177, width: 50, height: this.EXPLOSION_CELL_HEIGHT },
      { left: 84,  top: 177, width: 68, height: this.EXPLOSION_CELL_HEIGHT },
      { left: 164, top: 177, width: 68, height: this.EXPLOSION_CELL_HEIGHT }, 
      { left: 242, top: 177, width: 68, height: this.EXPLOSION_CELL_HEIGHT }, 
      { left: 318, top: 177, width: 68, height: this.EXPLOSION_CELL_HEIGHT },
      { left: 395, top: 177, width: 68, height: this.EXPLOSION_CELL_HEIGHT },
      { left: 475, top: 177, width: 68, height: this.EXPLOSION_CELL_HEIGHT },
      { left: 555, top: 177, width: 68, height: this.EXPLOSION_CELL_HEIGHT },
      { left: 635, top: 177, width: 68, height: this.EXPLOSION_CELL_HEIGHT }
   ];

   this.EXPLOSION_CYCLE_DURATION = 50;

   this.EXPLOSION_DURATION = 
      this.EXPLOSION_CYCLE_DURATION * this.explosionCells.length;

   this.NUM_BULLETS      = 20;
   this.BULLET_WIDTH     = 11;
   this.BULLET_HEIGHT    = 11;
   this.BULLET_CELL_LEFT = 18;
   this.BULLET_CELL_TOP  = 4;

   this.bulletCell = { 
      left:   this.BULLET_CELL_LEFT, 
      top:    this.BULLET_CELL_TOP, 
      width:  this.BULLET_WIDTH, 
      height: this.BULLET_HEIGHT 
   };

   this.NUM_BIRDS = 12;
   this.BIRD_CYCLE_RATE_BASE = 50;
   this.BIRD_CYCLE_RATE_MAX_ADDITION = 150;

   this.BIRD_WIDTH  = 40;
   this.BIRD_HEIGHT = 40;

   this.BIRD_LEFT_BASE         = 800;
   this.BIRD_LEFT_MAX_ADDITION = 800;

   this.BIRD_TOP_BASE         = 35;
   this.BIRD_TOP_MAX_ADDITION = 330;

   this.BIRD_VELOCITY_BASE         = 50;
   this.BIRD_VELOCITY_MAX_ADDITION = 50;

   this.BIRD_VALUE = 50;

   this.BIRD_EXPLOSION_TOP_DELTA  = 20;
   this.BIRD_EXPLOSION_LEFT_DELTA = 20;

   this.birdCells = [  
      { 
         left:   9,
         top:    20, 
         width:  this.BIRD_WIDTH, 
         height: this.BIRD_HEIGHT 
      },

      { 
         left:   49,
         top:    30, 
         width:  this.BIRD_WIDTH, 
         height: this.BIRD_HEIGHT 
      }, 

      { 
         left:   89,
         top:    15, 
         width:  this.BIRD_WIDTH, 
         height: this.BIRD_HEIGHT 
      } 
   ];
};

BodegasRevenge.prototype = {
   polarToCartesian: function (px, py, r, angle) {
      var x = px + r * Math.cos(angle),
          y = py + r * Math.sin(angle);

      return { left: x, top: y };
   },

   createSprites: function () {
      this.createTurret();
      this.createBullets();
      this.createBirds();
   },

   createTurret: function () {
      this.turret = new Sprite('turret',
                       this.createTurretArtist(),
                       [ this.createTurretRotateBehavior(),
                         this.createTurretBarrelFireBehavior(),
                         this.createTurretShootBehavior(),
                         new CycleBehavior(this.TURRET_CYCLE_DURATION)
                       ]);

      this.turret.left   = this.turretData.left;
      this.turret.top    = this.turretData.top;
      this.turret.width  = this.TURRET_WIDTH;
      this.turret.height = this.TURRET_HEIGHT;
      this.turret.radius = this.TURRET_WIDTH - this.TURRET_CENTER_X;
   },

   createTurretArtist: function () {
      var turretArtist = new SpriteSheetArtist(this.spritesheet,
                                this.turretCell);

      // Override turret artist's draw method to rotate the turret
      // before drawing it

      turretArtist.draw = function (sprite, context) {
         context.translate(sprite.left + game.TURRET_CENTER_X, 
                           sprite.top  + game.TURRET_CENTER_Y);

         context.rotate(game.turretRotation);

         context.drawImage(this.spritesheet, // image
                           this.cells[this.cellIndex].left, // source x
                           this.cells[this.cellIndex].top,  // source y
                           game.TURRET_WIDTH,     // source width 
                           game.TURRET_HEIGHT,    // source height 
                           -game.TURRET_CENTER_X, // destination x
                           -game.TURRET_CENTER_Y, // destination y
                           game.TURRET_WIDTH,     // destination width
                           game.TURRET_HEIGHT);   // destination height
      };

      return turretArtist;
   },

   createTurretRotateBehavior: function () {
      return {
         execute: function (sprite, now, fps, context,
                            lastAnimationFrameTime) {
            var ROTATE_INCREMENT = Math.PI/100;

            if(sprite.rotating) {
               if (sprite.direction === game.CLOCKWISE) {
                  game.turretRotation -= ROTATE_INCREMENT;
               }
               else if (sprite.direction === game.COUNTER_CLOCKWISE) {
                  game.turretRotation += ROTATE_INCREMENT;
               }
            }
         }
      };
   },

   createExplosionBehavior: function () {
      return new CellSwitchBehavior(
         game.explosionCells,
         game.EXPLOSION_DURATION,
                      
         function (sprite, now, fps, lastAnimationFrameTime) { // trigger
            return sprite.exploding;
         },

         function (sprite) { // callback
            game.initializeBirdProperties(sprite);
         }
      );
   },

   createTurretBarrelFireBehavior: function () {
      return new CellSwitchBehavior(
         game.turretFiringCells,
         game.TURRET_FIRING_DURATION,
                      
         function (sprite, now, fps, lastAnimationFrameTime) { // trigger
            return sprite.shooting;
         },

         function (sprite) { // callback
            sprite.shooting = false;
         }
      );
   },

   createTurretShootBehavior: function () {
      return {
         lastTimeShotFired: 0,

         getBullet: function () {
            var bullet,
                i;

            for (i=0; i < game.lostBulletIndex; ++i) {
               bullet = game.bullets[i];

               if (!bullet.visible) {
                  return bullet;
               }
            } 

            return null;
         },

         execute: function (sprite, now, fps, context,
                            lastAnimationFrameTime) {
            var elapsed = now - this.lastTimeShotFired;

            if(sprite.shooting && elapsed > game.TURRET_SHOT_INTERVAL) {
               bullet = this.getBullet();

               if (bullet) {
                  bullet.visible = true;
                  bullet.trajectory = game.turretRotation;
                  bullet.distanceAlongTrajectory = game.turret.radius; 

                  this.lastTimeShotFired = now;

                  game.playSound(game.turretFiringSound);
               }
            }
         }
      };
   },

   createBird: function () {
      var cycleRate = (game.BIRD_CYCLE_RATE_BASE +
                       game.BIRD_CYCLE_RATE_MAX_ADDITION 
                       * Math.random()).toFixed(0),

           bird = new Sprite('bird', 
                        new SpriteSheetArtist(game.spritesheet, 
                                              game.birdCells),
                          [ 
                             this.createExplosionBehavior(),
                             this.createBirdMoveBehavior(),
                             this.createBirdCollideBehavior(),
                             new CycleBehavior(cycleRate)
                           ]);
      return bird;
   },

   createBirds: function () {
      var i;

      this.birds = [];

      for (i=0; i < this.NUM_BIRDS; ++i) {
         this.birds[i] = this.createBird();
         this.initializeBirdProperties(this.birds[i]);
      }
   },
         
   initializeBirdProperties: function (bird) {
      bird.width   = this.BIRD_WIDTH; 
      bird.height  = this.BIRD_HEIGHT;
      bird.visible = true;

      bird.left = this.BIRD_LEFT_BASE + 
                  this.BIRD_LEFT_MAX_ADDITION * Math.random();

      bird.top  = this.BIRD_TOP_BASE  + 
                  this.BIRD_TOP_MAX_ADDITION  * Math.random();

      bird.velocity = this.BIRD_VELOCITY_BASE + 
                      this.BIRD_VELOCITY_MAX_ADDITION * Math.random();

      bird.value = this.BIRD_VALUE;

      bird.flying = false;
      bird.exploding = false;
   },

   createBirdCollideBehavior: function () {
      return {
         isBulletInsideBird: function (context, bullet, bird) {
            context.beginPath();

            context.rect(bird.left,  bird.top, 
                         bird.width, bird.height);

            return context.isPointInPath(bullet.left + bullet.width/2,
                                         bullet.top + bullet.height/2);
         },

         execute: function (sprite, now, fps, context,
                            lastAnimationFrameTime) {
            var bullet,
                i;

            for (i=0; i < game.lostBulletIndex; ++i) {
               bullet = game.bullets[i];

               if (bullet.visible && !sprite.exploding) {
                  if (this.isBulletInsideBird(context, 
                                              bullet, 
                                              sprite)) {
                     sprite.left -= game.BIRD_EXPLOSION_LEFT_DELTA;
                     sprite.top  -= game.BIRD_EXPLOSION_TOP_DELTA;

                     game.explode(sprite);

                     bullet.visible = false;

                     game.score += sprite.value;
                     game.updateScoreElement();

                     break;
                  }
               }
            }
         }
      };
   },

   loseOneBullet: function () {
      if (this.lostBulletIndex === 0) {
         this.gameOver();
      }
      else {
         this.lostBulletIndex--;
      } 

      this.eraseBulletCanvas();
      this.drawBulletCanvas();
   },

   createBirdMoveBehavior: function () {
      return {
         execute: function (sprite, now, fps, context,
                            lastAnimationFrameTime) {
            if (!sprite.exploding) {
               sprite.left -= sprite.velocity * 
                              (now - lastAnimationFrameTime) / 1000;

               if (sprite.left + sprite.width < 0) {
                  sprite.left = game.canvas.width - sprite.width;
                  game.loseOneBullet();
               }
            }
         }
      }
   },

   createBullet: function (artist, moveBehavior) {
      bullet = new Sprite('bullet', 
                          artist, 
                          [ moveBehavior ]);

      bullet.width   = this.BULLET_WIDTH; 
      bullet.height  = this.BULLET_HEIGHT;
      bullet.visible = false;

      return bullet;
   },

   createBullets: function () {
      var artist = this.createBulletArtist(this.bulletCell, 
                   this.BULLET_WIDTH, this.BULLET_HEIGHT),

          moveBehavior = this.createBulletMoveBehavior(),
          bullet,
          i;

      this.bullets = [];

      for (i=0; i < this.NUM_BULLETS; ++i) {
         this.bullets[i] = this.createBullet(artist, moveBehavior);
      }

      this.lostBulletIndex = this.bullets.length;
   },

   createBulletArtist: function (bulletCell) {
      return {
         draw: function (sprite, context) {
            context.translate(game.turret.left + game.TURRET_CENTER_X,
                              game.turret.top  + game.TURRET_CENTER_Y);

            context.rotate(sprite.trajectory);

            context.drawImage(game.spritesheet, 
               bulletCell.left, bulletCell.top,  // sourcex, sourcey
               sprite.width, sprite.height,       // sourcew, sourceh
               sprite.distanceAlongTrajectory, 0, // destx, desty
               sprite.width, sprite.height);      // destw, desth
         }
      };
   },

   createBulletMoveBehavior: function () {
      return {
         getBulletLocation: function (bullet) {
            return game.polarToCartesian(
                game.turret.left + game.TURRET_CENTER_X, // x
                game.turret.top  + game.TURRET_CENTER_Y, // y
                bullet.distanceAlongTrajectory,          // radius
                bullet.trajectory);                      // angle
         },

         isBulletOutOfPlay: function (location) {
            return location.left < 0                 || 
                   location.left > game.canvas.width ||
                   location.top  < 0                 || 
                   location.top  > game.canvas.height;
         },

         execute: function (sprite, now, fps, context,
                            lastAnimationFrameTime) {
            var location,
                BULLET_VELOCITY = 450; // pixels / second

            sprite.distanceAlongTrajectory += 
               BULLET_VELOCITY * (now - lastAnimationFrameTime) / 1000;

            location = this.getBulletLocation(sprite);

            if (this.isBulletOutOfPlay(location)) {
               sprite.visible = false;
            }
            else {
               sprite.left = location.left;
               sprite.top  = location.top;
            }
         }
      };
   },

   addSpritesToSpriteArray: function () {
      for (var i = 0; i < this.bullets.length; ++i) {
         this.sprites.push(this.bullets[i]);
      }

      for (var i = 0; i < this.birds.length; ++i) {
         this.sprites.push(this.birds[i]);
      }

      this.sprites.push(this.turret);
   },

   positionSprites: function (sprites, spriteData) {
      var sprite;

      for (var i = 0; i < sprites.length; ++i) {
         sprite = sprites[i];

         if (spriteData[i].platformIndex) { 
            this.putSpriteOnPlatform(sprite,
               this.platforms[spriteData[i].platformIndex]);
         }
         else {
            sprite.top  = spriteData[i].top;
            sprite.left = spriteData[i].left;
         }
      }
   },

   setTimeRate: function (rate) {
      this.timeRate = rate;

      this.timeRateReadoutElement.innerHTML = 
         (this.timeRate * 100).toFixed(0);

      this.timeRateSlider.knobPercent = 
         this.timeRate / this.MAX_TIME_RATE;
     
      if (this.developerBackdoorVisible) {
         this.timeRateSlider.erase();
         this.timeRateSlider.draw(this.timeRate / 
                                    this.MAX_TIME_RATE);
      }

      this.timeSystem.setTransducer( function (percent) {
         return percent * game.timeRate;
      });      
   },

   isSpriteInView: function(sprite) {
      return sprite.left + sprite.width > sprite.hOffset &&
             sprite.left < sprite.hOffset + this.canvas.width;
   },

   updateSprites: function (now) {
      for (var i=0; i < this.sprites.length; ++i) {
         this.sprites[i].update(now, 
             this.fps, 
             this.context,
             this.lastAnimationFrameTime);
      }
   },

   drawSprites: function() {
      var sprite;

      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];
         
         if (sprite.visible && this.isSpriteInView(sprite)) {
            this.context.translate(-sprite.hOffset, 0);
            sprite.draw(this.context);
            this.context.translate(sprite.hOffset, 0);
         }
      }
   },

   eraseBulletCanvas: function () {
      this.bulletContext.clearRect(
         0,0,this.bulletCanvas.width,this.bulletCanvas.height);
   },

   drawBulletCanvas: function () {
      var context = this.bulletContext,
          firstBullet = game.bullets[0],
          TOP_EDGE = 0,
          LEFT_EDGE = 6,
          HORIZONTAL_SPACING = 16,
          VERTICAL_SPACING = 16,
          row = 0,
          col = 0,
          i;

      for (i=0; i < game.lostBulletIndex; ++i) {
         context.drawImage(game.spritesheet, 
            game.bulletCell.left,                   // sourcex
            game.bulletCell.top,                    // sourcey
            firstBullet.width, firstBullet.height,  // sourcew, sourceh
            LEFT_EDGE + HORIZONTAL_SPACING*col,     // destx
            TOP_EDGE  + VERTICAL_SPACING*row,       // destx
            firstBullet.width, firstBullet.height); // destw, desth

         if (i === game.bullets.length / 2 - 1) { // middle
            col = 0;
            row++;
         }
         else {
            col++;
         }
      }
   },

   draw: function (now) {
      this.setPlatformVelocity();
      this.setOffsets(now);

      this.drawBackground();
      this.updateSprites(now);
      this.drawSprites();
   },

   setPlatformVelocity: function () {
      this.platformVelocity = this.bgVelocity * 
      this.PLATFORM_VELOCITY_MULTIPLIER; 
   },

   setOffsets: function (now) {
      this.setBackgroundOffset(now);
      this.setSpriteOffsets(now);
   },

   setBackgroundOffset: function (now) {
      this.backgroundOffset +=
      this.bgVelocity * (now - this.lastAnimationFrameTime) / 1000;

      if (this.backgroundOffset < 0 || 
        this.backgroundOffset > this.BACKGROUND_WIDTH) {
         this.backgroundOffset = 0;
      }
   },

   setSpriteOffsets: function (now) {
      var sprite;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];
      }
   },

   drawBackground: function () {
      var BACKGROUND_TOP_IN_SPRITESHEET = 268;

      this.context.translate(-this.backgroundOffset, 0);

      this.context.drawImage(
         this.spritesheet, 0, BACKGROUND_TOP_IN_SPRITESHEET, 
         this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT,
         0, 0,
         this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT);

      this.context.drawImage(
         this.spritesheet, 0, BACKGROUND_TOP_IN_SPRITESHEET, 
         this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT,
         this.BACKGROUND_WIDTH, 0,
         this.BACKGROUND_WIDTH, this.BACKGROUND_HEIGHT);

      this.context.translate(this.backgroundOffset, 0);
   },

   calculateFps: function (now) {
      var fps = 1 / (now - this.lastAnimationFrameTime) * 
                1000 * this.timeRate;

      if (now - this.lastFpsUpdateTime > 1000) {
         this.lastFpsUpdateTime = now;
      }
      return fps; 
   },
   
   // Frame rate monitoring.............................................

   checkFps: function (now) {
      var averageSpeed;

      this.updateSpeedSamples(game.fps);

      averageSpeed = this.calculateAverageSpeed();

      if (averageSpeed < this.runningSlowlyThreshold) {
         this.revealRunningSlowlyWarning(now, averageSpeed);
      }
   },

   updateSpeedSamples: function (fps) {
      this.speedSamples[this.speedSamplesIndex] = fps;

      if (this.speedSamplesIndex !== this.NUM_SPEED_SAMPLES-1) {
         this.speedSamplesIndex++;
      }
      else {
         this.speedSamplesIndex = 0;
      }
   },

   calculateAverageSpeed: function () {
      var i,
          total = 0;

      for (i=0; i < this.NUM_SPEED_SAMPLES; i++) {
         total += this.speedSamples[i];
      }

      return total/this.NUM_SPEED_SAMPLES;
   },
   
   revealRunningSlowlyWarning: function (now, averageSpeed) {
      this.slowlyWarningElement.innerHTML =
         "The game is running at <i><b>"   +
         averageSpeed.toFixed(0) + "</i></b>"             +
         " frames/second (fps), but it needs more than " +
         this.runningSlowlyThreshold                     +
         " fps to work correctly."

      this.fadeInElements(this.runningSlowlyElement);
      this.lastSlowWarningTime = now;
   },

   fadeInElements: function () {
      var args = arguments;

      for (var i=0; i < args.length; ++i) {
         args[i].style.display = 'block';
      }

      setTimeout( function () {
         for (var i=0; i < args.length; ++i) {
            args[i].style.opacity = game.OPAQUE;
         }
      }, this.SHORT_DELAY);
   },

   fadeOutElements: function () {
      var args = arguments,
          fadeDuration = args[args.length-1]; // Last argument

          for (var i=0; i < args.length-1; ++i) {
            args[i].style.opacity = this.TRANSPARENT;
         }

         setTimeout(function() {
            for (var i=0; i < args.length-1; ++i) {
               args[i].style.display = 'none';
            }
         }, fadeDuration);
      },

   hideToast: function () {
      var TOAST_TRANSITION_DURATION = 450;

      this.fadeOutElements(this.toastElement, 
         TOAST_TRANSITION_DURATION); 
   },

   startToastTransition: function (text, duration) {
      this.toastElement.innerHTML = text;
      this.fadeInElements(this.toastElement);
   },

   revealToast: function (text, duration) {
      var DEFAULT_TOAST_DURATION = 1000;

      duration = duration || DEFAULT_TOAST_DURATION;

      this.startToastTransition(text, duration);

      setTimeout( function (e) {
         game.hideToast();
      }, duration);
   },

   hideCredits: function () {
      var CREDITS_REVEAL_DELAY = 2000;
      this.creditsElement.style.opacity = this.TRANSPARENT;

      setTimeout( function (e) {
         game.creditsElement.style.display = 'none';
      }, this.CREDITS_REVEAL_DELAY);
   },

   revealCredits: function () {
      this.fadeInElements(this.creditsElement);
      this.tweetElement.href = TWEET_PREAMBLE + this.score +
                               TWEET_PROLOGUE;
   },

   // On the server.....................................................  
   
   revealHighScores: function () {
      var HIGH_SCORES_REVEAL_DELAY = 2000;

      this.highScoreElement.style.display = 'block';
      this.highScoreNameElement.value = '';
      this.highScoreNameElement.focus();
      this.highScoresVisible = true;

      setTimeout( function () {
         game.highScoreElement.style.opacity = game.OPAQUE;
      }, HIGH_SCORES_REVEAL_DELAY);
   },

   hideHighScores: function () {
      game.highScoreElement.style.opacity = game.TRANSPARENT;

      setTimeout( function () {
         game.highScoreElement.style.display = 'none';
         game.highScoresVisible = false;
      }, game.HIGH_SCORE_TRANSITION_DURATION);
   },

   checkHighScores: function () {
      this.serverSocket.emit('get high score');
   },

   // Effects..........................................................

   explode: function (sprite) {
      if ( ! sprite.exploding) {
         if (sprite.runAnimationRate === 0) {
            sprite.runAnimationRate = this.RUN_ANIMATION_RATE;
         }

         sprite.exploding = true;
         this.playSound(this.explosionSound);
      }
   },

   revealWinningAnimation: function () {
      var WINNING_ANIMATION_FADE_TIME = 5000,
          SEMI_TRANSPARENT = 0.25;

      this.bgVelocity = 0;
      this.playing = false;
      this.loadingTitleElement.style.display = 'none';

      this.fadeInElements(this.runnerAnimatedGIFElement,
                          this.loadingElement);

      this.scoreElement.innerHTML = 'Winner!';
      this.canvas.style.opacity = SEMI_TRANSPARENT;

      setTimeout( function () {
         game.runnerAnimatedGIFElement.style.display = 'none';
         game.restartGame();
      }, WINNING_ANIMATION_FADE_TIME);
   },

   // Animation.........................................................

   animate: function (now) { 
      // Replace the time passed to this method by the browser
      // with the time from the game's time system

      now = game.timeSystem.calculateGameTime();

      if (game.paused) {
         setTimeout( function () {
            requestNextAnimationFrame(game.animate);
         }, game.PAUSED_CHECK_INTERVAL);
      }
      else {
         game.fps = game.calculateFps(now);

         if (game.windowHasFocus && game.playing && 
             game.showSlowWarning &&
             now - game.lastSlowWarningTime > 
             game.FPS_SLOW_CHECK_INTERVAL) {

            game.checkFps(now); 

         }

         game.draw(now);
         game.lastAnimationFrameTime = now;
         requestNextAnimationFrame(game.animate);
      }
   },

   togglePausedStateOfAllBehaviors: function (now) {
      var behavior;
   
      for (var i=0; i < this.sprites.length; ++i) {
         sprite = this.sprites[i];

         for (var j=0; j < sprite.behaviors.length; ++j) {
            behavior = sprite.behaviors[j];

            if (this.paused) {
               if (behavior.pause) {
                  behavior.pause(sprite, now);
               }
            }
            else {
               if (behavior.unpause) {
                  behavior.unpause(sprite, now);
               }
            }
         }
      }
   },

   togglePaused: function (showPausedToast) {
      var now = this.timeSystem.calculateGameTime(),
          PAUSE_MESSAGE_DURATION = 500;

      this.paused = !this.paused;

      this.togglePausedStateOfAllBehaviors(now);

      if (this.paused) {
         this.pauseStartTime = now;
      }
      else {
         this.lastAnimationFrameTime += (now - this.pauseStartTime);
      }

      if (this.musicOn) {
         if (this.paused) {
            this.musicElement.pause(); 
         }
         else {
            this.playMusic();
         }
      }
   },

   // ------------------------- INITIALIZATION ----------------------------

   backgroundLoaded: function () {
      var LOADING_SCREEN_TRANSITION_DURATION = 2000,
          WELCOME_PAUSE_DURATION = 1000;

      this.fadeOutElements(this.loadingElement, 
         LOADING_SCREEN_TRANSITION_DURATION);


      setTimeout ( function () {
         game.startGame();

         setTimeout ( function () {
            game.togglePaused();
            game.revealWelcome();
         }, WELCOME_PAUSE_DURATION);
      }, LOADING_SCREEN_TRANSITION_DURATION);
   },

   revealWelcome: function () {
      var REVEAL_DELAY = 1000;

      setTimeout ( function () {
         game.fadeInElements(game.welcomeElement);
      }, REVEAL_DELAY);
   },

   loadingAnimationLoaded: function () {
      if (!this.gameStarted) {
         this.fadeInElements(this.runnerAnimatedGIFElement,
          this.loadingTitleElement);
      }
   },

   initializeImages: function () {
      this.spritesheet.src = 'images/spritesheet.png';
      this.runnerAnimatedGIFElement.src = 'images/turret.gif';

      this.spritesheet.onload = function (e) {
         game.backgroundLoaded();
      };

      this.runnerAnimatedGIFElement.onload = function () {
         game.loadingAnimationLoaded();
      };
   },

   // Sounds............................................................

   createAudioChannels: function () {
      var audioSprites = document.getElementById('audio-sprites'),
          channel;

      for (var i=0; i < this.audioChannels.length; ++i) {
         channel = this.audioChannels[i];

         channel.audio = document.createElement('audio');
         channel.audio.src = audioSprites.currentSrc;
         channel.audio.autobuffer = true;

         channel.audio.addEventListener('loadeddata', 
                                      this.soundLoaded, 
                                      false);
      }

      this.audioChannels.push( 
         { playing: false, audio: audioSprites }
      );
   },

   seekAudio: function (sound, audio) {
      try {
         audio.pause();
         audio.currentTime = sound.position;
      }
      catch (e) {
         console.error('Cannot seek audio');
      }
   },

   playAudio: function (audio, channel) {
      audio.play();
      channel.playing = true;
   },

   soundLoaded: function () {
      game.audioSpriteCountdown--;

      if (game.audioSpriteCountdown === 0) {
         if (!game.gameStarted && game.spritesheetLoaded) {
            game.startGame();
         }
      }
   },

   getFirstAvailableAudioChannel: function (sound) {
      for (var i=0; i < this.audioChannels.length; ++i) {
         if (!this.audioChannels[i].playing) {
            return this.audioChannels[i];
         }
      }

      return null;
   },
               
   playSound: function (sound) {
      var channel = this.getFirstAvailableAudioChannel(),
          audio;

      if (this.soundOn) {
         if (!channel) {
            console.warn('All audio channels are busy. ' +
                         'Cannot play sound');
         }
         else { 
            audio = channel.audio;
            audio.volume = sound.volume;

            this.seekAudio(sound, audio);
            this.playAudio(audio, channel);

            setTimeout(function () {
               channel.playing = false;
               game.seekAudio(sound, audio);
            }, sound.duration);
         }
      }
   },

   dimControls: function () {
      FINAL_OPACITY = 0.5;

      game.instructionsElement.style.opacity = FINAL_OPACITY;
      game.soundAndMusicElement.style.opacity = FINAL_OPACITY;
   },

   revealCanvas: function () {
      this.fadeInElements(this.canvas);
   },

   revealTopChrome: function () {
      this.fadeInElements(this.scoreElement, this.bulletCanvas);
   },

   revealTopChromeDimmed: function () {
      var DIM = 0.25;

      this.scoreElement.style.display = 'block';
      this.bulletCanvas.style.display = 'block';

      setTimeout( function () {
         game.scoreElement.style.opacity = DIM;
         game.bulletCanvas.style.opacity = DIM;
      }, this.SHORT_DELAY);
   },

   revealBottomChrome: function () {
      this.fadeInElements(this.soundAndMusicElement,
       this.instructionsElement,
       this.copyrightElement);
   },

   revealGame: function () {
      var DIM_CONTROLS_DELAY = 5000;

      this.revealTopChromeDimmed();
      this.revealCanvas();
      this.revealBottomChrome();

      setTimeout( function () {
         game.dimControls();
         game.revealTopChrome();
      }, DIM_CONTROLS_DELAY);
   },   
  
   updateScoreElement: function () {
      this.scoreElement.innerHTML = this.score;
   },

   playMusic: function () {
      var SOUNDTRACK_LENGTH = 132000; // milliseconds

      this.musicElement.play();

      setTimeout( function () {
         if (game.musicOn && ! game.paused) {
            game.playMusic();
         }
      }, SOUNDTRACK_LENGTH);
   },

   startMusic: function () {
      var MUSIC_DELAY = 1000;

      setTimeout( function () {
         if (game.musicOn && !game.paused) {
            game.playMusic();
         }
      }, MUSIC_DELAY);
   },

   startGame: function () {
      this.revealGame();

      this.drawBulletCanvas();

      this.startMusic();
      this.timeSystem.start();

      this.gameStarted = true;
      this.playing = false;
      this.showSlowWarning = true;

      requestNextAnimationFrame(this.animate);
   },

   resetBirds: function () {
      var BIRD_LEFT_BASE = 800,
          BIRD_LEFT_MAX_ADDITION = 800,

          BIRD_TOP_BASE  = 35,
          BIRD_TOP_MAX_ADDITION = 330,

          bird,
          i;

      for (i=0; i < this.birds.length; ++i) {
         bird = this.birds[i];

         bird.left = BIRD_LEFT_BASE + 
                     BIRD_LEFT_MAX_ADDITION * Math.random();

         bird.top  = BIRD_TOP_BASE + 
                     BIRD_TOP_MAX_ADDITION  * Math.random();

      }
   },

   resetBullets: function () {
      var bullet,
          i;

      for (i=0; i < this.bullets.length; ++i) {
         bullet = this.bullets[i];
         bullet.visible = false;
      }

      this.lostBulletIndex = this.bullets.length;
   },

   restartGame: function () {
      this.hideCredits();
      this.resetScore();
      this.resetBullets();
      this.resetBirds();
      this.revealTopChrome();
      this.dimControls();

      this.restartLevel();
   },
  
   restartLevel: function () {
      this.resetOffsets();
      this.playing = true;
   },

   resetOffsets: function () {
      this.bgVelocity       = 0;
      this.backgroundOffset = 0;
      this.platformOffset   = 0;
      this.spriteOffset     = 0;
   },

   resetScore: function () {
      this.score = 0;
      this.updateScoreElement();
   },

   gameOver: function () {
      this.scoreElement.style.opacity = 0.2;
      this.instructionsElement.style.opacity = 0.2; 
      this.soundAndMusicElement.style.opacity = 0.2;
      this.bgVelocity = this.BACKGROUND_VELOCITY / 20;
      this.playing = false;

      this.revealCredits();
   },

   getViewportSize: function () {
      return { 
        width: Math.max(document.documentElement.clientWidth ||
               window.innerWidth || 0),  
               
        height: Math.max(document.documentElement.clientHeight ||
                window.innerHeight || 0)
      };
   },

   detectMobile: function () {
      game.mobile = 'ontouchstart' in window;
   },

   resizeElement: function (element, w, h) {
      element.style.width  = w + 'px';
      element.style.height = h + 'px';
   },

   resizeElementsToFitScreen: function (arenaWidth, arenaHeight) {
      game.resizeElement(
         document.getElementById('arena'), 
         arenaWidth, arenaHeight);
   },

   calculateArenaSize: function (viewportSize) {
      var DESKTOP_ARENA_WIDTH  = 800,  // Pixels
          DESKTOP_ARENA_HEIGHT = 520,  // Pixels
          arenaHeight,
          arenaWidth;

      arenaHeight = viewportSize.width * 
                    (DESKTOP_ARENA_HEIGHT / DESKTOP_ARENA_WIDTH);

      if (arenaHeight < viewportSize.height) { // Height fits
         arenaWidth = viewportSize.width;      // Set width
      }
      else {                                   // Height does not fit
         arenaHeight = viewportSize.height;    // Recalculate height
         arenaWidth  = arenaHeight *           // Set width
                      (DESKTOP_ARENA_WIDTH / DESKTOP_ARENA_HEIGHT);
      }

      if (arenaWidth > DESKTOP_ARENA_WIDTH) {  // Too wide
         arenaWidth = DESKTOP_ARENA_WIDTH;     // Limit width
      } 

      if (arenaHeight > DESKTOP_ARENA_HEIGHT) { // Too tall
         arenaHeight = DESKTOP_ARENA_HEIGHT;    // Limit height
      }

      return { 
         width:  arenaWidth, 
         height: arenaHeight 
      };
   },

   fitScreen: function () {
      var arenaSize = game.calculateArenaSize(
                         game.getViewportSize());

      game.resizeElementsToFitScreen(arenaSize.width, 
                                          arenaSize.height);
   },

};

// Event handlers.......................................................

window.addEventListener(
   'keydown',

   function (e) {
      var key = e.keyCode,
          SLOW_MOTION_RATE = 0.2;

      if ( ! game.playing) {
         return;
      }

      if (key === 76) { // 'l' to lose a bullet
         game.loseOneBullet();
      }
      else if (key === 32) {
         game.turret.shooting = true;
      }
      else if (key === 68 || key === 37) { // 'd' or left arrow
         game.turret.rotating = true;
         game.turret.direction = game.CLOCKWISE;
      }
      else if (key === 75 || key === 39) { // 'k' or right arrow
         game.turret.rotating = true;
         game.turret.direction = game.COUNTER_CLOCKWISE;
      }
      else if (key === 80) { // 'p'
         game.togglePaused();
      }
   }
);

window.addEventListener(
   'keyup',

   function (e) {
      game.turret.rotating = false;
   }
);

window.addEventListener(
   'blur',

   function (e) {
      game.windowHasFocus = false;
   
      if ( ! game.paused) {
         game.togglePaused();
      }
   }
);

window.addEventListener(
   'focus',

   function () {
      var originalFont = game.toastElement.style.fontSize,
          DIGIT_DISPLAY_DURATION = 1000; // milliseconds

          game.windowHasFocus = true;

         if ( ! game.playing) {
            //game.togglePaused(); // no countdown 
            return;
         }
      
         game.countdownInProgress = true;

         if (game.paused) {
            game.toastElement.style.font = '128px fantasy'; // Large font

         if (game.windowHasFocus && game.countdownInProgress)
            game.revealToast('3', 500); // Display 3 for 0.5 seconds

         setTimeout(function (e) {
            if (game.windowHasFocus && game.countdownInProgress)
               game.revealToast('2', 500); // Display 2 for 0.5 seconds

            setTimeout(function (e) {
               if (game.windowHasFocus && game.countdownInProgress)
                  game.revealToast('1', 500); // Display 1 for 0.5 seconds

               setTimeout(function (e) {
                  if ( game.windowHasFocus && game.countdownInProgress)
                     game.togglePaused();

                  if ( game.windowHasFocus && game.countdownInProgress)
                     game.toastElement.style.fontSize = originalFont;

                  game.countdownInProgress = false;

               }, DIGIT_DISPLAY_DURATION);

            }, DIGIT_DISPLAY_DURATION);

         }, DIGIT_DISPLAY_DURATION);
      }
   }
);

// Game object.........................................................

var game = new BodegasRevenge();

game.newGameLink.onclick = function (e) {
   game.restartGame();
};

game.startLink.onclick = function () {
   var WELCOME_FADE_DURATION = 1000;

   game.fadeOutElements(game.welcomeElement, WELCOME_FADE_DURATION);
   game.playing = true;

   setTimeout( function () {
      game.togglePaused();
   }, 1000);
};

// Running slowly warning event handlers..............................

game.slowlyDontShowElement.onclick = function (e) {
   game.fadeOutElements(game.runningSlowlyElement,
                             game.RUNNING_SLOWLY_FADE_DURATION);
   game.showSlowWarning = false;
   game.updateDeveloperBackdoorCheckboxes();
};

game.slowlyOkayElement.onclick = function (e) {
   game.fadeOutElements(game.runningSlowlyElement,
                             game.RUNNING_SLOWLY_FADE_DURATION);
   game.speedSamples = [60,60,60,60,60,60,60,60,60,60]; // reset
};

// Sound and music checkbox event handlers.............................

game.musicCheckboxElement.onchange = function (e) {
   game.musicOn = game.musicCheckboxElement.checked;

   if (game.musicOn) {
      game.musicElement.play();
   }
   else {
      game.musicElement.pause();
   }
};

// High scores.........................................................

game.highScoreNameElement.onkeypress = function () {
   if (game.highScorePending) {
      game.highScoreAddScoreElement.disabled = false;
      game.highScorePending = false;
   }
};

game.highScoreAddScoreElement.onclick = function () {
   game.highScoreAddScoreElement.disabled = true;

   game.serverSocket.emit('set high score', {
      name: game.highScoreNameElement.value,
      score: game.score
   });
};

game.highScoreNewGameElement.onclick = function () {
   game.highScoreAddScoreElement.disabled = true;
   game.restartGame();
   game.hideHighScores();
}

// Event handlers for the server socket.................................

try {
   game.serverSocket.on('high score', function (data) { 
      // data is the current high score

      if (game.score > data.score) {
         game.serverSocket.emit('get high scores');
         game.highScorePending = true;
      }
      else {
         game.revealCredits();
         //game.livesElement.style.opacity = 0.2; 
         game.scoreElement.style.opacity = 0.2; 
         game.instructionsElement.style.opacity = 0.2; 
         game.soundAndMusicElement.style.opacity = 0.2;
      }
   });

   game.serverSocket.on('high scores', function (data) { 
      game.highScoreListElement.innerHTML = "";
     
      for(var i=0; i < data.scores.length; i += 2) {
         game.highScoreListElement.innerHTML += 
            "<li>" + data.scores[i+1] + " by " + 
            data.scores[i] + "</li>";
      } 

      game.revealHighScores();
   });

   game.serverSocket.on('high score set', function (data) {
      // data is the high score that was just set on the server

      game.serverSocket.emit('get high scores'); // redisplay scores
   });
}
catch(err) {
   // server is unavailable
}

// Sound and music checkbox event handlers.............................

game.soundCheckboxElement.onchange = function (e) {
   game.soundOn = game.soundCheckboxElement.checked;
};

game.musicCheckboxElement.onchange = function (e) {
   game.musicOn = game.musicCheckboxElement.checked;

   if (game.musicOn) {
      game.musicElement.play();
   }
   else {
      game.musicElement.pause();
   }
};

// Launch game.........................................................

game.initializeImages();
game.createSprites();
game.addSpritesToSpriteArray();
game.createAudioChannels();

game.detectMobile();

if (game.mobile) {
   game.instructionsElement = 
      document.getElementById('bodega-mobile-instructions'); 
      
   game.welcomeElement = 
      document.getElementById('bodega-mobile-welcome'); 

   game.startLink = 
      document.getElementById('bodega-mobile-start');

   game.startLink.onclick = function () {
      var WELCOME_FADE_DURATION = 1000;

      game.fadeOutElements(game.welcomeElement, WELCOME_FADE_DURATION);
      game.playing = true;

      setTimeout( function () {
         game.togglePaused();
      }, 1000);
   };   
}

game.bgVelocity = game.BACKGROUND_VELOCITY;

game.canvas.addEventListener(
   'touchstart',

   function (e) {
      game.turret.touchStartTime = game.timeSystem.calculateGameTime();

      game.turret.lastFingerLocation = { 
         x: e.changedTouches[0].pageX,
         y: e.changedTouches[0].pageY
      };

      game.turret.armed = true;

      e.preventDefault();
   }
);

game.canvas.addEventListener(
   'touchmove',

   function (e) {
      var MOVEMENT_THRESHOLD = 3;

      if (game.turret.armed && !game.turret.rotating) {
         game.turret.armed = false;
         game.turret.rotating = true;
      }

      if (game.turret.lastFingerLocation.y > 
          e.changedTouches[0].pageY) {

         if (game.turret.lastFingerLocation.y - 
             e.changedTouches[0].pageY > MOVEMENT_THRESHOLD) {
            game.turret.direction = game.CLOCKWISE;
         }
      }
      else {
         if (e.changedTouches[0].pageY -
             game.turret.lastFingerLocation.y > MOVEMENT_THRESHOLD) {
            game.turret.direction = game.COUNTER_CLOCKWISE;
         }
      }

      game.turret.lastFingerLocation = { 
         x: e.changedTouches[0].pageX,
         y: e.changedTouches[0].pageY
      };
   }
);

game.canvas.addEventListener(
   'touchend',

   function (e) {
      var TAP_THRESHOLD = 200, // milliseconds
          now = game.timeSystem.calculateGameTime();

      game.turret.rotating = false;

      if (now - game.turret.touchStartTime < TAP_THRESHOLD) {
         game.turret.shooting = true;
      }

      e.preventDefault();
   }
);

game.fitScreen();
window.addEventListener("resize", game.fitScreen);
window.addEventListener("orientationchange", game.fitScreen);
