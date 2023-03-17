export default function EventsHandlers(state, canvasHandler, utils) {
  let isMouseDown = false,
    latestClientX = undefined,
    latestClientY = undefined;

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
        .querySelector(".btn-color.selected")
        .classList.remove("selected");

      event.target.classList.add("selected");
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
  };
}
