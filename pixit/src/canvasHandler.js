import {
  getPixelFromCanvasPoint,
  getCanvasCoordinatesFromPixel,
} from "./utils.js";

/**
 * @typedef {import("./utils.js").PixelDimension} PixelDimension
 * @typedef {import("./utils.js").Coordinates} Coordinates
 */

export default function () {
  let _canvasNode,
    _canvasPositionInsideTheViewport,
    _container,
    _gridCanvasNode,
    _focusCanvas,
    _focusedPixelCoordinates = [0, 0];

  function _updateCanvasPositionInsideTheViewport() {
    const { top, left } = _canvasNode.getBoundingClientRect();

    _canvasPositionInsideTheViewport = { top: top + window.scrollY, left };
  }

  return {
    init: function (containerElement) {
      _container = containerElement;
      this.createCanvas();
    },

    createCanvas() {
      if (_canvasNode) {
        _container.removeChild(_canvasNode);
      }

      _canvasNode = document.createElement("canvas");
      _canvasNode.id = "pixit";
      _canvasNode.innerText = "This is the are where you can draw";
      this.context.fillStyle = "#ffffff";
      _canvasNode.tabIndex = 0;

      _container.appendChild(_canvasNode);

      this.setCanvasDimensionsWithContainer();
    },

    get canvas() {
      return _canvasNode;
    },

    get context() {
      return _canvasNode.getContext("2d");
    },

    get isCanvasSupported() {
      return !!_canvasNode.getContext;
    },

    get positionInsideTheViewport() {
      return { ..._canvasPositionInsideTheViewport };
    },

    /**
     * @param {PixelDimension} pixelDimension
     * */
    drawPixelsGrid(pixelDimension) {
      if (_gridCanvasNode) {
        _container.removeChild(_gridCanvasNode);
      }

      _gridCanvasNode = document.createElement("canvas");
      _gridCanvasNode.id = "pixit-grid";
      _gridCanvasNode.innerText =
        "This is the grid of the area where you can draw";
      _gridCanvasNode.width = this.canvas.width;
      _gridCanvasNode.height = this.canvas.height;
      _gridCanvasNode.style.zIndex = -1;
      _gridCanvasNode.style.position = "absolute";
      _gridCanvasNode.style.top = 0;
      _gridCanvasNode.style.left = 0;
      _gridCanvasNode.style.bottom = 0;
      _gridCanvasNode.style.right = 0;

      const context = _gridCanvasNode.getContext("2d");

      context.fillStyle = "#ffffff";
      _container.appendChild(_gridCanvasNode);

      drawGridLine({
        context,
        maxValue: _gridCanvasNode.width,
        moveTo: [-1, 0],
        lineTo: [-1, _gridCanvasNode.height],
        offset: pixelDimension.width,
      });
      drawGridLine({
        context,
        maxValue: _gridCanvasNode.height,
        moveTo: [0, -1],
        lineTo: [_gridCanvasNode.width, -1],
        offset: pixelDimension.height,
      });

      context.strokeStyle = "#ccc";
      context.stroke();

      this.createFocusCanvas();
    },

    setCanvasDimensionsWithContainer() {
      this.canvas.width = _container.offsetWidth;
      this.canvas.height = _container.offsetHeight;
      _updateCanvasPositionInsideTheViewport();
    },

    /**
     * @param {Coordinates} canvasPointCoordinates
     * @param {PixelDimension} pixelDimension
     * @param {string} color
     * @return {Coordinates}
     */
    colorPixel([x, y], pixelDimension, color) {
      const pixelCoordinates = getPixelFromCanvasPoint(pixelDimension, [x, y]),
        [pixelCoordinateX, pixelCoordinateY] = getCanvasCoordinatesFromPixel(
          pixelDimension,
          pixelCoordinates
        );

      this.context.beginPath();
      this.context.lineWidth = "1";
      this.context.fillStyle = color;
      this.context.rect(
        pixelCoordinateX,
        pixelCoordinateY,
        pixelDimension.width,
        pixelDimension.height
      );
      this.context.fill();

      return pixelCoordinates;
    },

    imageURL() {
      return this.canvas.toDataURL("image/png");
    },

    createFocusCanvas() {
      const id = "canvas-focus";
      let prevCanvas;

      if ((prevCanvas = document.getElementById(id))) {
        _focusCanvas = null;
        _container.removeChild(prevCanvas);
      }

      _focusCanvas = _gridCanvasNode.cloneNode(true);
      _focusCanvas.id = id;
      _focusCanvas.innerText =
        "Here you can draw, you can move in the grid by pressing any arrow keys, press Enter to start drawing and Canc/Delete to stop";

      _container.appendChild(_focusCanvas);
    },

    /**
     *
     * @param {"ArrowUp" | "ArrowRight" | "ArrowDown" | "ArrowLeft"} direction - where to move the pixel
     */
    getNextPixelByKeyboard(direction) {
      let [x, y] = _focusedPixelCoordinates;
      if (direction == "ArrowLeft" || direction == "ArrowRight") {
        const updated =
          _focusedPixelCoordinates[0] + (direction == "ArrowRight" ? 1 : -1);
        x = updated > 0 ? updated : x;
      }
      if (direction == "ArrowDown" || direction == "ArrowUp") {
        const updated =
          _focusedPixelCoordinates[1] + (direction == "ArrowDown" ? 1 : -1);
        y = updated > 0 ? updated : y;
      }
      return [x, y];
    },

    /**
     *
     * @param {Coordinates} pixelCoordinates
     */
    updateFocusedPixel(pixelCoordinates) {
      _focusedPixelCoordinates = [...pixelCoordinates];
    },

    /**
     *
     * @param {Coordinates} pixelCoordinates
     * @param {PixelDimension} pixelDimension
     */
    createFocusedPixel(pixelCoordinates, pixelDimension) {
      this.createFocusCanvas();
      const canvasPointCoordinates = getCanvasCoordinatesFromPixel(
          pixelDimension,
          pixelCoordinates
        ),
        context = _focusCanvas.getContext("2d");

      context.beginPath();
      context.lineWidth = "1";
      context.fillStyle = "#333";
      context.rect(
        canvasPointCoordinates[0],
        canvasPointCoordinates[1],
        pixelDimension.width,
        pixelDimension.height
      );
      context.stroke();
      this.updateFocusedPixel(pixelCoordinates);
    },

    onCanvasBlur() {
      _focusedPixelCoordinates = [0, 0];
      this.createFocusCanvas();
    },
  };
}

/**
 * Draw a horizontal or vertical line to create a grid
 * @param {object} params
 * @param {object} params.context - canvas context
 * @param {number} params.maxValue  - max value axis
 * @param {number} params.offset -
 * @param {Coordinates} params.moveTo - canvas coordinates, use -1 to indicate where to use the current value of the loop required to draw
 * @param {Coordinates} params.lineTo - canvas coordinates, use -1 to indicate where to use the current value of the loop required to draw
 */
function drawGridLine({ context, maxValue, offset, moveTo, lineTo }) {
  let current = 0;
  while (current < maxValue) {
    context.moveTo(...moveTo.map((item) => (item != -1 ? item : current)));
    context.lineTo(...lineTo.map((item) => (item != -1 ? item : current)));
    current = current + offset;
  }
}
