export default function stateSelectedColour() {
  let _color = "#000";

  return {
    set color(value) {
      _color = value;
    },
    get color() {
      return _color;
    },
  };
}
