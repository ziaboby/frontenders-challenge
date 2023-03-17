import { expectForNoObjects } from "./expect.js";
import {
  getPixelFromCanvasPoint,
  getCanvasCoordinatesFromPixel,
} from "../src/utils.js";

export default function () {
  let output = getPixelFromCanvasPoint({ width: 10, height: 10 }, [0, 0]);
  expectForNoObjects(
    "getPixelFromCanvasPoint - should return the pixel coordinates based on the current position in the canvas - x",
    output[0],
    0
  );
  expectForNoObjects(
    "getPixelFromCanvasPoint - should return the pixel coordinates based on the current position in the canvas - y",
    output[1],
    0
  );

  output = getPixelFromCanvasPoint({ width: 10, height: 10 }, [25, 0]);
  expectForNoObjects(
    "getPixelFromCanvasPoint - should return the pixel coordinates based on the current position in the canvas - x",
    output[0],
    2
  );
  expectForNoObjects(
    "getPixelFromCanvasPoint - should return the pixel coordinates based on the current position in the canvas - y",
    output[1],
    0
  );

  output = getPixelFromCanvasPoint({ width: 10, height: 10 }, [255, 100]);
  expectForNoObjects(
    "getPixelFromCanvasPoint - should return the pixel coordinates based on the current position in the canvas - x",
    output[0],
    25
  );
  expectForNoObjects(
    "getPixelFromCanvasPoint - should return the pixel coordinates based on the current position in the canvas - y",
    output[1],
    10
  );

  output = getCanvasCoordinatesFromPixel({ width: 10, height: 10 }, [255, 100]);
  expectForNoObjects(
    "getPixelFromCanvasPoint - should return the pixel coordinates based on the current position in the canvas - x",
    output[0],
    2550
  );
  expectForNoObjects(
    "getPixelFromCanvasPoint - should return the pixel coordinates based on the current position in the canvas - y",
    output[1],
    1000
  );
}
