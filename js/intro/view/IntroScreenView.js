// Copyright 2016-2018, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const IntroProjectilePanel = require( 'PROJECTILE_MOTION/intro/view/IntroProjectilePanel' );
  const IntroVectorsPanel = require( 'PROJECTILE_MOTION/intro/view/IntroVectorsPanel' );
  const Node = require( 'SCENERY/nodes/Node' );
  const projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  const ProjectileMotionScreenView = require( 'PROJECTILE_MOTION/common/view/ProjectileMotionScreenView' );
  const VectorVisibilityProperties = require( 'PROJECTILE_MOTION/common/view/VectorVisibilityProperties' );

  /**
   * @param {IntroModel} model
   * @param {Object} [options]
   * @constructor
   */
  function IntroScreenView( model, options ) {

    // contains Properties about vector visibility, used in super class
    var visibilityProperties = new VectorVisibilityProperties();

    // acts as listParent for the projectile dropdown box
    var comboBoxListParent = new Node();

    // @private, for layout
    this.introProjectilePanel = new IntroProjectilePanel(
      model.objectTypes,
      model.selectedProjectileObjectTypeProperty,
      comboBoxListParent,
      model.projectileMassProperty,
      model.projectileDiameterProperty,
      model.projectileDragCoefficientProperty,
      model.airResistanceOnProperty
    );

    ProjectileMotionScreenView.call(
      this,
      model,
      this.introProjectilePanel,
      new IntroVectorsPanel( visibilityProperties ),
      visibilityProperties,
      options
    );

    // insert dropdown right on top of the rightside panels
    this.insertChild( this.indexOfChild( this.topRightPanel ) + 1, comboBoxListParent );
  }

  projectileMotion.register( 'IntroScreenView', IntroScreenView );

  return inherit( ProjectileMotionScreenView, IntroScreenView, {
    /**
     * Layout
     * @param {number} width
     * @param {number} height
     *
     * @override
     */
    layout: function( width, height ) {
      this.introProjectilePanel.hideComboBoxList();
      ProjectileMotionScreenView.prototype.layout.call( this, width, height );
    }
  } );
} );

