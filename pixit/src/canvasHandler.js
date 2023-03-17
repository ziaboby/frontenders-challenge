import {
  getPixelFromCanvasPoint,
  getCanvasCoordinatesFromPixel,
} from "./utils.js";

/**
 * @typedef {import("./utils.js").PixelDimension} PixelDimension
 * @typedef {import("./utils.js").Coordinates} Coordinates
 */

export default function () {
  let _canvasNode, _canvasPositionInsideTheViewport, _container;

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
      const id = "pixit";
      let prevCanvas;

      if ((prevCanvas = document.getElementById(id))) {
        _canvasNode = null;
        _container.removeChild(prevCanvas);
      }

      _canvasNode = document.createElement("canvas");
      _canvasNode.id = id;
      _canvasNode.innerText = "This is the are where you can draw";
      this.context.fillStyle = "#ffffff";

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
      const id = "pixit-grid";
      let prevCanvas;

      if ((prevCanvas = document.getElementById(id))) {
        _container.removeChild(prevCanvas);
      }

      let _gridCanvasNode = document.createElement("canvas");
      _gridCanvasNode.id = id;
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
      _container.appendChild(_gridCanvasNode);

      const context = _gridCanvasNode.getContext("2d");

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
