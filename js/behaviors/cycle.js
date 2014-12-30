/* CYCLE: For sprites that have a spritesheet artist, this behavior
          advances the sprite artist through the sprite's images for
          the specified duration. Then the behavior waits for the
          specified gap to expire and starts the entire process again.
          
          The behavior shows each cell for the specified duration.
          When the behavior has cycled through all of the cells, it
          pauses for the specified gap before starting the whole
          process again.
*/

CycleBehavior = function (duration, gap) {
   this.duration = duration || 1000;  //  milliseconds
   this.lastAdvance = 0;
   this.gap = gap;
};

CycleBehavior.prototype = {
   execute: function (sprite, 
                         now, 
                         fps, 
                         context, 
                         lastAnimationFrameTime) {
      if (this.lastAdvance === 0) { // First time only
         this.lastAdvance = now;
      }

      if (this.gap &&                      // If there's a gap
          sprite.artist.cellIndex === 0) { // and the cycle is complete
         if (now - this.lastAdvance > this.gap) { // If it's time to advance

            sprite.artist.advance();
			      this.lastAdvance = now;
		     }         
      }
      else if (now - this.lastAdvance > this.duration) {
         sprite.artist.advance();
         this.lastAdvance = now;
      }
   }
};