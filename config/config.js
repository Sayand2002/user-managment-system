const {v4:uuid} = require("uuid")
const sessionSecret = uuid();
module.exports = {sessionSecret}