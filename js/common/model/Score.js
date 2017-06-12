// Copyright 2016, University of Colorado Boulder

/**
 * The model for scoring algorithm.
 * Landed projectiles give their x location to this model.
 * Each time a projectile hits the target, the score indicator appears after a small delay time
 * Each time a projectile is fired, the score indicator disappears.
 * The appearance delay of 0.05 is so that if multiple projectiles hit the target after the last fire,
 * the score indicator seems to reappear TODO: this part does not work anymore
 * 
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {number} initialTargetX - initial x position of the target
   * @constructor
   */
  function Score( initialTargetX ) {

    // @public {Property.<number>} x position of target
    this.targetXProperty = new Property( initialTargetX );

    // @public {Emitter} if projectile has scored
    this.scoredEmitter = new Emitter();

  }

  projectileMotion.register( 'Score', Score );

  return inherit( Object, Score, {

    // @public
    reset: function() {
      this.targetXProperty.reset();
    },

    // @public Scores if projectile has scored based on {number} x position of the landed projectile
    scoreIfWithinTarget: function( projectileX ) {
      var distance = Math.abs( projectileX - this.targetXProperty.get() );
      if ( distance <= ProjectileMotionConstants.TARGET_LENGTH / 2 ) {
        this.score();
      }
    },

    // @public restarts time before visible and turns on animation
    score: function() {
      this.scoredEmitter.emit();
    },

  } );
} );

