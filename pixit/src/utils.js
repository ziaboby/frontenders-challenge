/**
 * @typedef {object} PixelDimension
 * @param {number} width
 * @param {number} height
 */

/**
 * @typedef {[number, number]} Coordinates
 * @param {number} [0] - value in x axis
 * @param {number} [1] - value in y axis
 */

/**
 * Return the grid pixel corresponding to canvas coordinates
 * @param {PixelDimension} pixelDimension
 * @param {Coordinates} canvasPointCoordinates
 * @return {Coordinates}
 */
export function getPixelFromCanvasPoint(
  pixelDimension,
  canvasPointCoordinates
) {
  const xCoordinates = parseInt(
    canvasPointCoordinates[0] / pixelDimension.width
  );
  const yCoordinates = parseInt(
    canvasPointCoordinates[1] / pixelDimension.height
  );

  return [xCoordinates, yCoordinates];
}

/**
 * Return the canvas coordinates of the pixel
 * @param {PixelDimension} pixelDimension
 * @param {Coordinates} pixelCoordinates
 * @return {Coordinates}
 */
export function getCanvasCoordinatesFromPixel(
  pixelDimension,
  pixelCoordinates
) {
  const [x, y] = pixelCoordinates;
  return [x * pixelDimension.width, y * pixelDimension.height];
}
