import initColorPalette from "./src/initColorPalette.js";
import canvasHandler from "./src/canvasHandler.js";
import statePixelsDimensions from "./src/state/statePixelsDimensions.js";
import stateDrawnPixels from "./src/state/stateDrawnPixels.js";
import stateSelectedColor from "./src/state/stateSelectedColor.js";
import CanvasStateUpdateHandlers from "./src/helpers/canvasStateUpdateHandlers.js";
import EventsHandlers from "./src/helpers/eventsHandlers.JS";

(function (container, canvasHandler) {
  initColorPalette(document.getElementById("palette"), "btn-color");
  canvasHandler.init(container);

  if (!canvasHandler.isCanvasSupported) {
    container.innerText =
      "This app uses canvas, which is not supported by your browser";
  } else {
    const state = {
        pixel_dimensions: statePixelsDimensions(),
        selected_pixels: stateDrawnPixels(),
        selected_color: stateSelectedColor(),
      },
      canvasStateUpdatesHandlers = new CanvasStateUpdateHandlers(
        state,
        canvasHandler
      ),
      eventsHandlers = EventsHandlers(
        state,
        canvasHandler,
        canvasStateUpdatesHandlers
      );

    canvasStateUpdatesHandlers.eventsHandlers = eventsHandlers;

    canvasStateUpdatesHandlers.setColorOfFirstPaletteElement();
    canvasHandler.drawPixelsGrid(state.pixel_dimensions.dimensions);

    canvasStateUpdatesHandlers.addRemoveCanvasEventsListener(1);
    window.addEventListener("resize", eventsHandlers.resize);
    document
      .querySelector("input[name='width']")
      .addEventListener("change", eventsHandlers.changeDimensionsHandler);
    document
      .querySelector("input[name='height']")
      .addEventListener("change", eventsHandlers.changeDimensionsHandler);
    document
      .getElementById("reset")
      .addEventListener("click", eventsHandlers.clickReset);
    document.querySelectorAll(".btn-color").forEach((btn) => {
      btn.addEventListener("click", eventsHandlers.clickColorBtn);
    });
    document
      .getElementById("download")
      .addEventListener("click", eventsHandlers.clickDownload);
  }
})(document.getElementById("canvas-container"), canvasHandler());
