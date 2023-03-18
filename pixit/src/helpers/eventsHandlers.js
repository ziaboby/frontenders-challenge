import { getCanvasCoordinatesFromPixel } from "../utils.js";

export default function EventsHandlers(state, canvasHandler, utils) {
  let isMouseDown = false,
    latestClientX = undefined,
    latestClientY = undefined,
    drawingByKeyboard = false;

  return {
    setMouseDownToTrue: (event) => {
      (event.cancelable === undefined || event.cancelable) &&
        event.preventDefault();
      isMouseDown = true;
    },

    setMouseDownToFalse: (event) => {
      if (isMouseDown) {
        (event.cancelable === undefined || event.cancelable) &&
          event.preventDefault();
        isMouseDown = false;
      }
    },

    changeDimensionsHandler: (event) => {
      const type = event.target.name,
        value = +event.target.value;

      state.pixel_dimensions[type] = value;

      utils.redrawPixels();
    },

    clickReset: () => {
      document.querySelector("input[name='width']").value = 10;
      document.querySelector("input[name='height").value = 10;
      state.pixel_dimensions.width = 10;
      state.pixel_dimensions.height = 10;
      state.selected_pixels.removeAll();
      canvasHandler.setCanvasDimensionsWithContainer();
      utils.redrawPixels();
      utils.setColorOfFirstPaletteElement();
    },

    clickColorBtn: (event) => {
      document
        .querySelector('.btn-color[aria-selected="true"]')
        .setAttribute("aria-selected", false);

      event.target.setAttribute("aria-selected", true);
      state.selected_color.color = event.target.dataset.color;
    },

    clickDownload: () => {
      const tagA = document.createElement("a");
      tagA.download = "image";
      tagA.target = "_blank";
      tagA.href = canvasHandler.imageURL();
      tagA.click();
    },

    resize: () => {
      const prevDimensions = {
        width: canvasHandler.canvas.width,
        height: canvasHandler.canvas.height,
      };

      canvasHandler.setCanvasDimensionsWithContainer();

      if (
        canvasHandler.canvas.width != prevDimensions.width ||
        canvasHandler.canvas.height != prevDimensions.height
      ) {
        canvasHandler.drawPixelsGrid(state.pixel_dimensions.dimensions);
        utils.redrawPixels();
      }
    },

    colorPixelOnMouseMove: (event) => {
      if (isMouseDown) {
        event.preventDefault();

        const { top, left } = canvasHandler.positionInsideTheViewport;

        const eventX = event.changedTouches
            ? event.changedTouches[0].pageX
            : event.pageX,
          eventY = event.changedTouches
            ? event.changedTouches[0].pageY
            : event.pageY;
        const x = eventX - left,
          y = eventY - top;

        const mousedMovedEnterNewPixel =
          !latestClientX ||
          Math.abs(latestClientX - x) > state.pixel_dimensions.width / 3 ||
          Math.abs(latestClientY - y) > state.pixel_dimensions.height / 3;

        if (mousedMovedEnterNewPixel) {
          latestClientX = x;
          latestClientY = y;

          const coloredPixelCoordinates = canvasHandler.colorPixel(
            [x, y],
            state.pixel_dimensions.dimensions,
            state.selected_color.color
          );

          state.selected_pixels.add({
            coordinates: [...coloredPixelCoordinates],
            color: state.selected_color.color,
          });
        }
      }
    },

    focusFirstPixel: () => {
      canvasHandler.createFocusedPixel(
        [0, 0],
        state.pixel_dimensions.dimensions
      );
    },

    /**
     *
     * @param {KeyboardEvent} event
     */
    keydownToMoveInTheCanvas: (event) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        event.preventDefault();
        const pixelCoordinates = canvasHandler.getNextPixelByKeyboard(
          event.key
        );
        if (drawingByKeyboard) {
          canvasHandler.updateFocusedPixel(pixelCoordinates);
          const coordinates = getCanvasCoordinatesFromPixel(
            state.pixel_dimensions.dimensions,
            pixelCoordinates
          );
          canvasHandler.colorPixel(
            coordinates,
            state.pixel_dimensions.dimensions,
            state.selected_color.color
          );
        } else {
          canvasHandler.createFocusedPixel(
            pixelCoordinates,
            state.pixel_dimensions.dimensions
          );
        }
      } else if ("Enter" == event.key) {
        event.preventDefault();
        const coordinates = getCanvasCoordinatesFromPixel(
          state.pixel_dimensions.dimensions,
          canvasHandler.getNextPixelByKeyboard(event.key)
        );
        canvasHandler.colorPixel(
          coordinates,
          state.pixel_dimensions.dimensions,
          state.selected_color.color
        );
        drawingByKeyboard = true;
      } else if ("Delete" == event.key) {
        event.preventDefault();
        drawingByKeyboard = false;
      }
    },

    /**
     *
     * @param {KeyboardEvent} event
     */
    focusCanvas: (event) => {
      if (event.key == "d" && event.ctrlKey) {
        event.preventDefault();
        canvasHandler.canvas.focus();
      }
    },
  };
}
