// Copyright 2015-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Andrea Lin (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragScreen = require( 'PROJECTILE_MOTION/drag/DragScreen' );
  const IntroScreen = require( 'PROJECTILE_MOTION/intro/IntroScreen' );
  const LabScreen = require( 'PROJECTILE_MOTION/lab/LabScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const VectorsScreen = require( 'PROJECTILE_MOTION/vectors/VectorsScreen' );

  // strings
  const projectileMotionTitleString = require( 'string!PROJECTILE_MOTION/projectile-motion.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar, Mike Dubson',
      softwareDevelopment: 'Andrea Lin',
      team: 'Ariel Paul, Kathy Perkins, Amanda McGarry, Wendy Adams, John Blanco',
      qualityAssurance: 'Steele Dalton, Alex Dornan, Ethan Johnson, Liam Mulhall',
      graphicArts: 'Mariah Hermsmeyer, Cheryl McCutchan'
    }
  };

  SimLauncher.launch( function() {
    var sim = new Sim( projectileMotionTitleString, [
      new IntroScreen(),
      new VectorsScreen(),
      new DragScreen(),
      new LabScreen()
    ], simOptions );
    sim.start();
  } );
} );

