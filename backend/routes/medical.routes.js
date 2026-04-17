const express = require("express")
const router = express.Router()
const medical = require("../controller/medical.controller")

router.get("/search",medical.medicalController)

module.exports = router