const express = require("express")
const { getCurrencies, createCurrency } = require("../controllers/currencyController")

const router = express.Router()

// get all currencies
router.get("/api/currencies/", getCurrencies)
// create a new currency
router.post("/api/currencies/", createCurrency)


module.exports = router