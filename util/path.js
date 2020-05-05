// creating instance of path package
const path = require("path");

// getting and exporting the root directory name for node project
module.exports = path.dirname(process.mainModule.filename);
