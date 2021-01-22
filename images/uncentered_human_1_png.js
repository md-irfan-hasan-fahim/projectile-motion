/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;