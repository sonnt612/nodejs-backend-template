const CONSTANTS = require("../const")
const rp = require("request-promise")

module.exports = {
 get: (uri, body) => {
  const options = {
   method: "GET",
   uri,
   body,
   timeout: 3000,
   json: true, // Automatically stringifies the body to JSON
  }
  return rp(options)
 },
 post: (uri, body) => {
  const options = {
   method: "POST",
   uri,
   body,
   timeout: 3000,
   json: true, // Automatically stringifies the body to JSON
  }
  return rp(options)
 },
}
