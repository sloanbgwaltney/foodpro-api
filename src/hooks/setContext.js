module.exports = function (key, subKey, val) {
  return function (ctx) {
    ctx[key][subKey] = val;
    return ctx;
  };
};
