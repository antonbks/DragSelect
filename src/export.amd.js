// Module exporting
if (typeof module !== 'undefined' && module !== null) {
  module.exports = DragSelect;

  // AMD Modules
} else if (
  typeof define !== 'undefined' &&
  typeof define === 'function' &&
  define
) {
  define(function() {
    return DragSelect;
  });
} else {
  window.DragSelect = DragSelect;
}
