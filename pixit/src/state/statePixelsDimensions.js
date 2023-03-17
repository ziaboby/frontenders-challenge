export default function statePixelsDimensions(
  initialPixelWidth = 10,
  initialPixedHeight = 10
) {
  const _dimensions = {
    width: initialPixelWidth,
    height: initialPixedHeight,
  };

  return {
    set width(value) {
      _dimensions.width = value;
    },
    set height(value) {
      _dimensions.height = value;
    },
    get width() {
      return _dimensions.width;
    },
    get height() {
      return _dimensions.height;
    },
    get dimensions() {
      return { width: _dimensions.width, height: _dimensions.height };
    },
  };
}
