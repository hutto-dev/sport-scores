console.log("Minimal controller loading");

exports.testFunction = function () {
  console.log("This is a test function");
};

console.log("After definition, exports.testFunction is:", exports.testFunction);

module.exports = {
  testFunction: exports.testFunction, // Make sure to reference the export
};
