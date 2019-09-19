// Copyright 2016-2019, University of Colorado Boulder

/**
 * View for the target.
 * X position can change when user drags the cannon, y remains constant (on the ground)
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Animation = require( 'TWIXT/Animation' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const Easing = require( 'TWIXT/Easing' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );
  const Range = require( 'DOT/Range' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const StarNode = require( 'SCENERY_PHET/StarNode' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const mString = require( 'string!PROJECTILE_MOTION/m' );
  const pattern0Value1UnitsWithSpaceString = require( 'string!PROJECTILE_MOTION/pattern0Value1UnitsWithSpace' );

  // constants
  var TARGET_DIAMETER = ProjectileMotionConstants.TARGET_WIDTH;
  var TARGET_HEIGHT = ProjectileMotionConstants.TARGET_HEIGHT;
  var REWARD_NODE_INITIAL_Y_OFFSET = -10; // in screen coords
  var REWARD_NODE_Y_MOVEMENT = 70; // in screen coords
  var REWARD_NODE_GROWTH_AMOUNT = 0.5; // scale factor, larger = more growth

  /**
   * @param {Score} score - model of the target and scoring algorithms
   * @param {Property.<ModelViewTransform2>} transformProperty
   * @param {ScreenView} screenView
   * @constructor
   */
  function TargetNode( score, transformProperty, screenView ) {
    var self = this;
    Node.call( this );

    // @private for coordinate transforms as well as adding the stars as children
    this.screenView = screenView;

    // local var to improve readability
    var targetXProperty = score.targetXProperty;

    // red and white circles of the target
    var outerCircle = new Circle( 1, {
      fill: 'red',
      stroke: 'black',
      lineWidth: transformProperty.get().viewToModelDeltaX( 1 )
    } );
    var middleCircle = new Circle( 2 / 3, {
      fill: 'white',
      stroke: 'black',
      lineWidth: transformProperty.get().viewToModelDeltaX( 0.5 )
    } );
    var innerCircle = new Circle( 1 / 3, {
      fill: 'red',
      stroke: 'black',
      lineWidth: transformProperty.get().viewToModelDeltaX( 0.5 )
    } );

    // target view
    var target = new Node( {
      pickable: true,
      cursor: 'pointer',
      children: [
        outerCircle,
        middleCircle,
        innerCircle
      ]
    } );

    // scaling the target to the right size
    var viewRadius = transformProperty.get().modelToViewDeltaX( TARGET_DIAMETER ) / 2;
    var targetHeightInView = TARGET_HEIGHT / TARGET_DIAMETER * viewRadius;
    target.setScaleMagnitude( viewRadius, targetHeightInView );

    // center on model's targetXProperty
    target.center = transformProperty.get().modelToViewPosition( Vector2.createFromPool( score.targetXProperty.get(), 0 ) );

    // add target to scene graph
    this.addChild( target );

    // @private variables used in drag handler
    var startPoint;
    var startX;
    var mousePoint;
    var horizontalDragHandler = new SimpleDragHandler( {
      start: function( event ) {
        startPoint = screenView.globalToLocalPoint( event.pointer.point );
        startX = target.centerX; // view units
      },

      drag: function( event ) {
        mousePoint = screenView.globalToLocalPoint( event.pointer.point );

        // change in x, view units
        var xChange = mousePoint.x - startPoint.x;

        targetXProperty.set( Util.roundSymmetric( transformProperty.get().viewToModelX(
          Util.clamp( startX + xChange, screenView.layoutBounds.minX, screenView.layoutBounds.maxX )
        ) * 10 ) / 10 );
      },

      allowTouchSnag: true
    } );

    // drag target to change horizontal position
    target.addInputListener( horizontalDragHandler );

    // text readout for horizontal distance from fire, which is origin, which is base of cannon
    var distancePattern = StringUtils.fillIn( pattern0Value1UnitsWithSpaceString, { units: mString } );
    var distanceLabel = new NumberDisplay(
      targetXProperty,
      new Range(
        transformProperty.get().viewToModelX( screenView.layoutBounds.minX ),
        transformProperty.get().viewToModelX( screenView.layoutBounds.maxX )
      ),
      _.extend(
        ProjectileMotionConstants.NUMBER_DISPLAY_OPTIONS, {
          numberFill: 'black',
          valuePattern: distancePattern,
          xMargin: 10.5,
          yMargin: 2,
          decimalPlaces: 1,
          cursor: 'pointer'
        }
      )
    );

    this.addChild( distanceLabel );

    // drag text to change horizontal position
    distanceLabel.addInputListener( horizontalDragHandler );

    // @private {Array.<Node>} keeps track of rewardNodes that animate when projectile has scored
    this.rewardNodes = [];

    // listen to model for whether score indicator should be shown
    score.scoredEmitter.addListener( function() {

      if ( score.numberOfStars === 1 ) {
        var rewardNode = new Node( {
          children: [
            new StarNode( { x: 0, y: -30 } )
          ]
        } );
      }
      else if ( score.numberOfStars === 2 ) {
        rewardNode = new Node( {
          children: [
            new StarNode( { x: -20, y: -20 } ),
            new StarNode( { x: 20, y: -20 } )
          ]
        } );
      }
      else { // 3
        rewardNode = new Node( {
          children: [
            new StarNode( { x: -30, y: -20 } ),
            new StarNode( { x: 0, y: -30 } ),
            new StarNode( { x: 30, y: -20 } )
          ]
        } );
      }
      var rewardNodeStartPosition = new Vector2( target.centerX, target.centerY + REWARD_NODE_INITIAL_Y_OFFSET );
      rewardNode.center = rewardNodeStartPosition;
      screenView.addChild( rewardNode );
      self.rewardNodes.push( rewardNode );

      // animate the reward node (one to three stars) to move up, expand, and fade out
      var rewardNodeAnimation = new Animation( {
        duration: 1,
        easing: Easing.QUADRATIC_OUT,
        setValue: function( newYPos ) {
          rewardNode.centerY = newYPos;
          var animationProportionCompleted = Math.abs( newYPos - rewardNodeStartPosition.y ) / REWARD_NODE_Y_MOVEMENT;
          rewardNode.opacity = 1 - animationProportionCompleted;
          rewardNode.setScaleMagnitude( 1 + ( animationProportionCompleted * REWARD_NODE_GROWTH_AMOUNT ) );
        },
        from: rewardNodeStartPosition.y,
        to: rewardNodeStartPosition.y - REWARD_NODE_Y_MOVEMENT
      } );

      // remove the reward node when the animation finishes
      rewardNodeAnimation.finishEmitter.addListener( function() {
        self.rewardNodes.splice( self.rewardNodes.indexOf( rewardNode ), 1 );
        rewardNode.dispose();
      } );

      // kick off the animation
      rewardNodeAnimation.start();
    } );

    // Observe changes in the model horizontal position and update the view correspondingly
    var updateHorizontalPosition = function( targetX ) {
      target.centerX = transformProperty.get().modelToViewX( targetX );
      distanceLabel.centerX = target.centerX;
      distanceLabel.top = target.bottom + 2;
      self.rewardNodes.forEach( function( rewardNode ) {
        rewardNode.x = target.centerX;
      } );
    };

    targetXProperty.link( updateHorizontalPosition );

    // Observe changes in the modelViewTransform and update the view
    transformProperty.link( function( transform ) {
      var viewRadius = transform.modelToViewDeltaX( TARGET_DIAMETER ) / 2;
      target.setScaleMagnitude( viewRadius, targetHeightInView );
      updateHorizontalPosition( targetXProperty.get() );
    } );

    // The node lasts for the lifetime of the sim, so its links/references don't need to be disposed

  }

  projectileMotion.register( 'TargetNode', TargetNode );

  return inherit( Node, TargetNode, {

    /**
     * Remove animations
     * @public
     * @override
     */
    reset: function() {
      var self = this;
      this.rewardNodes.forEach( function( rewardNode ) {
        if ( self.screenView.hasChild( rewardNode ) ) {
          self.screenView.removeChild( rewardNode );
        }
      } );
      this.rewardNodes = [];
    }

  } );
} );

