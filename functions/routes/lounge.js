const express = require("express")
const Router = express.Router()
const moment = require("moment")
const { db } = require("../config")

Router.post("/", async (req, res) => {
	const { date, name, phoneNumber, chairs, tableNumber, vip } = req.body
	const formatedDate = moment(date).format("YYYYMMDD")
	const formatedDateForMessage = moment(date).format("MM/DD")
	const twilio = require("twilio")

	//create the new reservation
	let newReservation = {}
	newReservation[tableNumber] = { name, phoneNumber, chairs, vip }
	const client = twilio(
		"ACe999416b326e6b3ace7578df7898d6b0",
		"30728db57038f242bd7b6606d82ce496"
	)
	await client.messages.create({
		body: `Cher(e) ${name} votre réservation de la table ${tableNumber} pour le ${formatedDateForMessage} a été bien faite`,
		from: "+19035277997",
		to: "+21651708750",
	})

	//add to db
	await db.doc(`/lounge/${formatedDate}`).set(
		{
			...newReservation,
		},
		{ merge: true }
	)

	return res.status(201).json({
		success: "Reservation confirmé",
	})
})

//get data rooftop
Router.get("/:date", async (req, res) => {
	const date = req.params.date
	const doc = await db.doc(`lounge/${date}`).get()
	if (!doc.exists) {
		return res.status(200).json({
			data: [],
		})
	}
	const data = doc.data()
	const formatedData = Object.values(data)

	return res.status(200).json({
		success: formatedData,
	})
})

//Router.post("/delete", async (req, res) => {
//	const { date, tableNumber, name } = req.body
//	const formatedDate = moment(date).format("YYYYMMDD")
//	//try {
//	const doc = await db.doc(`rooftop/${formatedDate}`).get()
//	const data = Object.entries(doc.data()).map(e => ({ [e[0]]: e[1] }))

//	//check if table free
//	const table = data.find(table => table[tableNumber] === tableNumber)
//	const verifyName = Object.values(table)[0]
//	const sameUserDidTheReservation = Object.values(verifyName).find(
//		username => username === name
//	)
//	let docToDelete = {}
//	//remove from db
//	if (sameUserDidTheReservation)
//		await db.doc(`/rooftop/${formatedDate}`).update({})

//	return res.status(201).json({
//		success: table,
//	})
//	//} catch (err) {
//	//	return res.status(500).json({
//	//		error: "something went wrong",
//	//	})
//	//}
//})
module.exports = Router
