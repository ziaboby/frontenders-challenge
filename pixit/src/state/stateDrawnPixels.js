export default function stateDrawnPixels() {
  let _pixelsInfo = [];

  return {
    get all() {
      return [..._pixelsInfo];
    },

    /**
     * @param {object} info
     * @param {array} info.coordinates
     * @param {string} info.color
     */
    add: function (info) {
      _pixelsInfo.push(info);
    },

    removeAll: function () {
      _pixelsInfo = [];
    },
  };
}
