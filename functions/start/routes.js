const roofTop = require("../routes/roofTop")
const cafe = require("../routes/cafe")
const lounge = require("../routes/lounge")

module.exports = app => {
	app.use("/rooftop", roofTop)
	app.use("/lounge", lounge)
	app.use("/cafe", cafe)
}
