const express = require("express");
const {
  getCurrencies,
  createCurrency,
  getCurrencyByAbbreviation,
  deleteCurrencyByAbbreviation,
  updateCurrencyByAbbreviation
} = require("../controllers/currencyController");

const router = express.Router();

// get all currencies
router.get("/api/currencies/", getCurrencies);
// create a new currency
router.post("/api/currencies/", createCurrency);
// get single currency
router.get("/api/currency/:abbreviation", getCurrencyByAbbreviation);
// delete single currency
router.delete("/api/currency/:abbreviation", deleteCurrencyByAbbreviation)
// update single currency
router.put("/api/currency/:abbreviation", updateCurrencyByAbbreviation)

module.exports = router;
