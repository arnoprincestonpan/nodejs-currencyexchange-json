const express = require("express");
const {
  getCurrencies,
  createCurrency,
  getCurrencyByAbbreviation,
  deleteCurrencyByAbbreviation,
  updateCurrencyByAbbreviation,
} = require("../controllers/currencyController");
const { errorHandler } = require("../controllers/errorHandler")

const router = express.Router();

// get all currencies
router.get("/api/currencies/", errorHandler, getCurrencies);
// create a new currency
router.post("/api/currencies/", errorHandler, createCurrency);
// get single currency
router.get("/api/currency/:abbreviation", errorHandler, getCurrencyByAbbreviation);
// delete single currency
router.delete("/api/currency/:abbreviation", errorHandler, deleteCurrencyByAbbreviation)
// update single currency
router.put("/api/currency/:abbreviation", errorHandler, updateCurrencyByAbbreviation)

module.exports = router;
