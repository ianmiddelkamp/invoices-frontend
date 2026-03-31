// Singleton dialog service — call confirm() or alert() anywhere, no props needed.

let _show = null;
let _resolve = null;

export function _register(show) {
  _show = show;
}

export function listSelection(message, title, options){
  if(!options || options.length === 0) return Promise.reject(new Error('No options provided for listSelection'));
  return new Promise((resolve) => {
    _resolve = resolve;
    _show({ type: 'list', message, title, options });
  });
}
export function confirm(message, { title, confirmLabel = 'Confirm', danger = true } = {}) {
  return new Promise((resolve) => {
    _resolve = resolve;
    _show({ type: 'confirm', message, title, confirmLabel, danger });
  });
}

export function alert(message, { title } = {}) {
  return new Promise((resolve) => {
    _resolve = resolve;
    _show({ type: 'alert', message, title });
  });
}

export function _respond(value) {
  const r = _resolve;
  _resolve = null;
  _show(null);
  r?.(value);
}
