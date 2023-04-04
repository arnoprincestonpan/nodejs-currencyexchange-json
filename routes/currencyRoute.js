const express = require("express")
const { getCurrencies } = require("../controllers/currencyController")

const router = express.Router()

router.get("/api/currencies/", getCurrencies)

module.exports = router