// Copyright 2013-2015, University of Colorado Boulder

/**
 * Control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var projectileMotion = require( 'PROJECTILE_MOTION/projectileMotion' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HSlider = require( 'SUN/HSlider' );
  var CheckBox = require( 'SUN/CheckBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ProjectileMotionConstants = require( 'PROJECTILE_MOTION/common/ProjectileMotionConstants' );

  // strings
  var massString = 'Mass';
  var diameterString = 'Diameter';
  var dragCoefficientString = 'Drag Coefficient';
  var altitudeString = 'Altitude';
  var airResistanceString = 'Air Resistance';
  var velocityVectorsString = 'Velocity Vectors';

  // constants
  var LABEL_OPTIONS = { font: ProjectileMotionConstants.LABEL_FONT };

  /**
   * Control panel constructor
   * @param {BarMagnet} barMagnetModel the entire model for the bar magnet screen
   * @param {Object} [options] scenery options for rendering the control panel, see the constructor for options.
   * @constructor
   */
  function CustomizePanel( projectileMotionModel, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        xMargin: 10,
        yMargin: 10,
        stroke: 'orange',
        lineWidth: 3
      },
      options );

    // auxiliary function that creates the string for a text label
    // @param {String} label
    // @param {Number} value
    // @return {String}
    var createLabelText = function( label, value ) {
      return label + ': ' + value.toFixed( 2 );
    };

    // auxiliary function that creates vbox for a parameter label and slider
    // @param {String} label
    // @param {Property} property
    // @param {Object} range, range has keys min and max
    // @return {VBox}
    var createParameterControlBox = function( label, property, range ) {
      var parameterLabel = new Text( createLabelText( label, property.value ), LABEL_OPTIONS );
      property.link( function( v ) {
        parameterLabel.text = createLabelText( label, v );
      } );
      var setParameterSlider = new HSlider( property, range );
      return new VBox( { spacing: 2, children: [ parameterLabel, setParameterSlider ] } );
    };

    var massBox = createParameterControlBox(
      massString,
      projectileMotionModel.massProperty,
      ProjectileMotionConstants.MASS_RANGE
    );

    var diameterBox = createParameterControlBox(
      diameterString,
      projectileMotionModel.diameterProperty,
      ProjectileMotionConstants.DIAMETER_RANGE
    );

    var dragCoefficientBox = createParameterControlBox(
      dragCoefficientString,
      projectileMotionModel.dragCoefficientProperty,
      ProjectileMotionConstants.DRAG_COEFFICIENT_RANGE
    );

    var altitudeBox = createParameterControlBox(
      altitudeString,
      projectileMotionModel.altitudeProperty,
      ProjectileMotionConstants.ALTITUDE_RANGE
    );

    var airResistanceLabel = new Text( airResistanceString, LABEL_OPTIONS );
    var airResistanceCheckBox = new CheckBox( airResistanceLabel, projectileMotionModel.airResistanceOnProperty );

    var velocityVectorComponentsLabel = new Text( velocityVectorsString, LABEL_OPTIONS );
    var velocityVectorComponentsCheckBox = new CheckBox( velocityVectorComponentsLabel, projectileMotionModel.velocityVectorComponentsOnProperty );

    // The contents of the control panel
    var content = new VBox( {
      align: 'center',
      // spacing: 10,
      children: [
        massBox,
        diameterBox,
        airResistanceCheckBox,
        dragCoefficientBox,
        altitudeBox,
        velocityVectorComponentsCheckBox
      ]
    } );

    Panel.call( this, content, options );
  }

  projectileMotion.register( 'CustomizePanel', CustomizePanel );

  return inherit( Panel, CustomizePanel );
} );

