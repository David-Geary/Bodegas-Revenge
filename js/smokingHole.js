var SmokingHole = function (smokeBubbleCount, fireParticleCount, 
                            left, top, width) {
   this.smokeBubbles  = [];
   this.fireParticles = [];

   this.disguiseAsSprite   (left, top, width);
   this.createFireParticles(fireParticleCount, left, top);
   this.createSmokeBubbles (smokeBubbleCount, left, top);

   this.smokeBubbleCursor = 0;
   this.visible = true;
};

SmokingHole.prototype = {
   addBehaviors: function () {
       this.behaviors = [
         {
            pause: function (sprite, now) {
               for (i=0; i < sprite.smokeBubbles.length; ++i) {
                  sprite.smokeBubbles[i].pause(now);
               }
            },

            unpause: function (sprite, now) {
               for (i=0; i < sprite.smokeBubbles.length; ++i) {
                  sprite.smokeBubbles[i].unpause(now);
               }
            },
    
            execute: function (sprite, now, fps, 
                               context, lastAnimationFrameTime) {
               // Reveal a smoke bubble every animation frame
               // until all the smoking hole's smoke bubbles have
               // been revealed.

               if (sprite.smokeBubbleCursor !== sprite.smokeBubbles.length-1) {
                  sprite.revealSmokeBubble();
                  sprite.advanceCursor();
               }
            } 
         }
      ];
   },

   disguiseAsSprite: function (left, top, width) {
      this.addSpriteProperties(left, top, width);
      this.addSpriteMethods();
      this.addBehaviors();
   },

   addSpriteProperties: function (left, top, width) {
      this.type    = 'smoking hole';
      this.top     = top;
      this.left    = left;
      this.width   = width;
      this.height  = width; // square bounding box around circle
      this.visible = true;
   },

   addSpriteMethods: function () {
      this.draw = function (context) {
         this.drawFireParticles(context);
         this.drawSmokeBubbles(context);
      };

      this.update = function (now, fps, 
                              context, lastAnimationFrameTime) {

         this.updateSmokeBubbles(now, fps, context, 
                                 lastAnimationFrameTime);

         for (var i=0; i < this.behaviors.length; ++i) {
            this.behaviors[i].execute(this, now, fps,
                                      context, lastAnimationFrameTime); 
         }
      };

      this.calculateCollisionRectangle = function () { 
         return { left:   this.left,
                  top:    this.top,
                  width:  this.width,
                  height: this.height };
      };
   },

   createFireParticleArtist: function (left, top, radius) {
      var YELLOW_PREAMBLE = 'rgba(255,255,0,';

      return { 
         draw: function (sprite, context) {
            context.save();

            context.fillStyle = YELLOW_PREAMBLE + 
                                Math.random().toFixed(2) + ');';

            context.beginPath();
            context.arc(sprite.left, sprite.top,
                        sprite.radius*1.5, 0, Math.PI*2, false);
            context.fill();

            context.restore();
         }
      };
   },

   createFireParticle: function (left, top, radius) {
      var sprite = new Sprite(
             'fire particle',
             this.createFireParticleArtist(left, top, radius));

      sprite.left    = left;
      sprite.top     = top;
      sprite.radius  = radius;
      sprite.visible = true;

      return sprite;
   },

   createFireParticles: function (fireParticleCount, left, top) {
      var radius;

      for (i = 0; i < fireParticleCount; ++i) {
         radius = Math.random() * 1.5;

         if (i % 2 === 0) {
            fireParticle = this.createFireParticle(
                              left + Math.random()*(radius*2),
                              top - Math.random()*(radius*2),
                              radius);
         }
         else {
            fireParticle = this.createFireParticle(
                              left - Math.random()*(radius*2),
                              top + Math.random()*(radius*2),
                              radius);
         }

         this.fireParticles.push(fireParticle);
      }
   },

   createSmokeBubble: function (left, top, radius,
                                velocityX, velocityY, lifetime) {
      var smokeBubble;

      this.lifetime = lifetime ? lifetime : 10000;

      var smokeBubble = this.createBubbleSprite(left, top, radius, 
                                                velocityX, velocityY);

      smokeBubble.pause = function (now) {
         this.timer.pause(now);
      };

      smokeBubble.unpause = function (now) {
         this.timer.unpause(now);
      };

      return smokeBubble;
   },

   setInitialSmokeBubbleColor: function (smokeBubble, i) {
      var ORANGE = 'rgba(255,104,31,0.3)',
          YELLOW = 'rgba(255,255,0,0.3)',
          BLACK  = 'rgba(0,0,0,0.5)';

      if (i <= 5)       smokeBubble.fillStyle = BLACK;
      else if (i <= 8)  smokeBubble.fillStyle = YELLOW;
      else if (i <= 10) smokeBubble.fillStyle = ORANGE;
      else
         smokeBubble.fillStyle = 
            'rgb('  + (220+Math.random()*35).toFixed(0) +
            ',' + (220+Math.random()*35).toFixed(0) + 
            ',' + (220+Math.random()*35).toFixed(0) + ')';
   },

   createSmokeBubbles: function (smokeBubbleCount, left, top) {
      var smokeBubble;

      for (i = 0; i < smokeBubbleCount; ++i) {
         if (i % 2 === 0) {
            smokeBubble = this.createSmokeBubble(
               left + Math.random()*3, 
               top - Math.random()*3,
               1,  // radius
               Math.random() * 8,  // velocityX
               Math.random() * 5); // velocityY
         }
         else {
            smokeBubble = this.createSmokeBubble(
               left + Math.random()*10, 
               top + Math.random()*6,
               1,  // radius
               Math.random() * 8,  // velocityX
               Math.random() * 5); // velocityY
         }

         this.setInitialSmokeBubbleColor(smokeBubble, i);

         if (i < 10) {
            // Make sure colored smoke bubbles don't overtake
            // the grayscale bubbles on top
            smokeBubble.dissipatesSlowly = true;
         }

         this.smokeBubbles.push(smokeBubble);
      }
   },   
   
   drawFireParticles: function (context) {
      for (var i = 0; i < this.fireParticles.length; ++i) {
         this.fireParticles[i].draw(context);
      }
   },

   drawSmokeBubbles: function (context) {
      for (var i = 0; i < this.smokeBubbles.length; ++i) {
         this.smokeBubbles[i].draw(context);
      } 
   },

   updateSmokeBubbles: function (now, fps, context, 
                                 lastAnimationFrameTime) {
      for (var i = 0; i < this.smokeBubbles.length; ++i) {
         this.smokeBubbles[i].update(now, fps, context, 
                                     lastAnimationFrameTime);
      }    
   },
   
   revealSmokeBubble: function () {
      this.smokeBubbles[this.smokeBubbleCursor].visible = true;
   },

   advanceCursor: function () {
      if (this.smokeBubbleCursor <= this.smokeBubbles.length - 1) {
         ++this.smokeBubbleCursor;
      }
      else {
         this.smokeBubbleCursor = 0;
      }
   },

   createBubbleArtist: function () {
      return {
         draw: function (sprite, context) {
            var TWO_PI = Math.PI * 2;

            if (sprite.radius > 0) {
               context.save();
               context.beginPath();

               context.fillStyle = sprite.fillStyle;
               context.arc(sprite.left, sprite.top,
                           sprite.radius, 0, TWO_PI, false);

               context.fill();
               context.restore();
            }
         }
      };
   },      

   createDissipateBubbleBehavior: function () {
      return {
         FULLY_OPAQUE: 1.0,
         BUBBLE_EXPANSION_RATE: 15,
         BUBBLE_SLOW_EXPANSION_RATE: 10,
         BUBBLE_X_SPEED_FACTOR: 8,
         BUBBLE_Y_SPEED_FACTOR: 16,

         execute: function (sprite, now, fps, context, 
                            lastAnimationFrameTime) {
            if (sprite.visible) {
               if ( ! sprite.timer.isRunning()) {
                  this.startTimer(sprite, now);
               }
               else if ( ! sprite.timer.isExpired(now)) {
                  this.dissipateBubble(sprite, now, 
                                  fps, lastAnimationFrameTime); 
               }
               else { // timer is expired
                  this.resetBubble(sprite, now); // resets the timer
               }
            }
         },

         startTimer: function (sprite, now) {
            sprite.timer.start(now);
            sprite.opacity = this.FULLY_OPAQUE;
         },
         
         dissipateBubble: function (sprite, now, fps, 
                               lastAnimationFrameTime) {
            var elapsedTime = sprite.timer.getElapsedTime(now),
                velocityFactor = (now - lastAnimationFrameTime) / 1000;

            sprite.left += sprite.velocityX * velocityFactor;
            sprite.top  -= sprite.velocityY * velocityFactor;

            sprite.opacity = this.FULLY_OPAQUE - elapsedTime / 
                             sprite.timer.duration;

            if (sprite.dissipatesSlowly) {
               sprite.radius += 
                  this.BUBBLE_SLOW_EXPANSION_RATE * velocityFactor;
            }
            else {
               sprite.radius += this.BUBBLE_EXPANSION_RATE * 
                                velocityFactor;
            }
         },

         resetBubble: function (sprite, now) {
            sprite.timer.stop(now);
            sprite.timer.reset();
   
            sprite.left = sprite.originalLeft;
            sprite.top = sprite.originalTop;
            sprite.radius = sprite.originalRadius;
   
            sprite.velocityX = Math.random() * 
                               this.BUBBLE_X_SPEED_FACTOR;

            sprite.velocityY = Math.random() * 
                               this.BUBBLE_Y_SPEED_FACTOR;

            sprite.opacity = 0;
         }
      };
   },

   createBubbleSprite: function (left, top, radius, 
                           velocityX, velocityY) {
      var r = 200 + Math.random()*55,
          g = r,
          b = r;

      sprite = new Sprite('smoke bubble', 
                           this.createBubbleArtist(), 
                           [ this.createDissipateBubbleBehavior() ]);

      sprite.fillStyle = 'rgba(' + r.toFixed(0) + ',' +
                                   g.toFixed(0) + ',' + 
                                   b.toFixed(0) + ',' +
                                   0.5 + ')';
      sprite.left   = left;
      sprite.top    = top;
      sprite.radius = radius;

      sprite.originalLeft   = left;
      sprite.originalTop    = top;
      sprite.originalRadius = radius;

      sprite.velocityX = velocityX;
      sprite.velocityY = velocityY;

      sprite.timer = new AnimationTimer(
           this.lifetime,
           AnimationTimer.makeEaseOutEasingFunction(1.5));

      return sprite;
   },
};
