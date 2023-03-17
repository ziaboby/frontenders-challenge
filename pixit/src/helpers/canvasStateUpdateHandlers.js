import { getCanvasCoordinatesFromPixel } from "../utils.js";

export default function CanvasStateUpdateHandlers(
  state,
  canvasHandler,
  eventsHandlers
) {
  this.state = state;
  this.canvasHandler = canvasHandler;
  this.eventsHandlers = eventsHandlers;
}

CanvasStateUpdateHandlers.prototype.setColorOfFirstPaletteElement =
  function () {
    const firstColorPalette = document.querySelector(".btn-color"),
      firstColor = firstColorPalette.dataset.color;
    firstColorPalette.classList.add("selected");

    this.state.selected_color.color = firstColor;
  };

CanvasStateUpdateHandlers.prototype.redrawPixels = function () {
  this.canvasHandler.drawPixelsGrid(this.state.pixel_dimensions.dimensions);
  this.canvasHandler.createCanvas();

  this.state.selected_pixels.all.forEach((pixelInfo) => {
    const pixelCanvasCoordinates = getCanvasCoordinatesFromPixel(
      this.state.pixel_dimensions.dimensions,
      pixelInfo.coordinates
    );
    this.canvasHandler.colorPixel(
      pixelCanvasCoordinates,
      this.state.pixel_dimensions.dimensions,
      pixelInfo.color
    );
  });

  this.addRemoveCanvasEventsListener(0);
  this.addRemoveCanvasEventsListener(1);
};

/**
 * @param {1|0} type - 1 addEventListener => listeners ON, 0 - removeEventListener => listeners OFF
 */
CanvasStateUpdateHandlers.prototype.addRemoveCanvasEventsListener = function (
  type
) {
  const method = ["removeEventListener", "addEventListener"][type];

  ["mousedown", "touchstart"].forEach((eventName) => {
    this.canvasHandler.canvas[method](
      eventName,
      this.eventsHandlers.setMouseDownToTrue
    );
  });

  ["mousemove", "touchmove"].forEach((eventName) => {
    this.canvasHandler.canvas[method](
      eventName,
      this.eventsHandlers.colorPixelOnMouseMove
    );
  });

  ["mouseup", "touchend"].forEach((eventName) => {
    this.canvasHandler.canvas[method](
      eventName,
      this.eventsHandlers.setMouseDownToFalse
    );
  });

  this.canvasHandler.canvas[method](
    "touchcancel",
    this.eventsHandlers.setMouseDownToFalse
  );
};
