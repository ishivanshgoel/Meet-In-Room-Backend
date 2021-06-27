const express = require('express')
const work = express.Router()
const createError = require('http-errors')
const { db } = require("../../setup/firebase/firebase.setup")
const { uuid } = require('uuidv4')

work.post("/assign", (req, res, next) => {

    try {
        const { myId, userId, task } = req.body

        if (!myId, !userId, !task) throw createError.BadRequest('Bad Request')
        const workId = uuid()
        let newTask = {
            ... task,
            workId: workId
        }
        db.collection('workRoom').doc(workId).set(newTask).then(() => {
            res.send({ workId })
        }).catch((err) => {
            next(err)
        })

    } catch (err) {
        next(err)
    }

})

work.post("/mywork", async (req, res, next) => {
    try {
        const { myEmail } = req.body
        if (!myEmail) throw createError.BadRequest('Bad Request')

        const roomsRef = db.collection('workRoom')

        const myWork = await roomsRef.where("to", "==", myEmail).get()

        if (myWork.empty) {
            res.send({ myWork: [] })
        } else {
            let data = []
            myWork.forEach((doc) => {
                data.push(doc.data())
            })
            res.send({ myWork: data })
        }

    } catch (err) {
        next(err)
    }
})

work.post("/assignedwork", async (req, res, next) => {
    try {

        const { myEmail, userEmail } = req.body
        if (!myEmail || !userEmail) throw createError.BadRequest('Bad Request')

        const roomsRef = db.collection('workRoom')

        const work = await roomsRef.where("to", "==", userEmail, "&&", "by", "==", myEmail).get()

        if (work.empty) {
            res.send({ work: [] })
        } else {
            let data = []
            work.forEach((doc) => {
                data.push(doc.data())
            })
            res.send({ work: data })
        }

    } catch (err) {

    }
})

work.post("/updatestatus", async (req, res, next) => {

    try {

        const { newStatus, workId } = req.body
        if ( !newStatus || !workId) throw createError.BadRequest('Bad Request')

        const roomsRef = db.collection('workRoom').doc(workId)
        const work = await roomsRef.update({status: newStatus})

        res.send(true)

    } catch (err) {
        next(err)
    }

})



module.exports = work