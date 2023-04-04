const express = require("express")
const { getCurrencies, createCurrency } = require("../controllers/currencyController")

const router = express.Router()

router.get("/api/currencies/", getCurrencies)
router.post("/api/currencies/", createCurrency)

module.exports = router