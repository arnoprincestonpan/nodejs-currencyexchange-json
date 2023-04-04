// initialize fs to read/write later
const fs = require("fs");
const { v4: uuidv4 } = require("uuid")

const getCurrencies = (req, res) => {
  let currencyJSON = fs.readFileSync("currency.json", "utf-8");
  let currencies = JSON.parse(currencyJSON);
  // sort productId by number value
  currencies = currencies.sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    }
  });
  if (currencies.length === 0) {
    // when there are no products within the JSON
    res.status(404).send({
      message: "There are no currencies.",
    });
  } else {
    // success, send all products
    res.status(200).send(currencies);
  }
};

const createCurrency = (req, res) => {
  const currency = req.body
  if(Object.keys(currency).length !== 0) {
    let currencyJSON = fs.readFileSync("currency.json", "utf-8");
    let currencies = JSON.parse(currencyJSON);
    let newId = currencies.length + 1
    while(currencies.find((currency) => currency.id == newId)) {
      newId += 1
    }
    currencies.push({...currencies, id: newId, uuid: uuidv4() })
    currencyJSON = JSON.stringify("currency.json", currencyJSON, "utf-8")
    res.status(201).send(currency)
  } else {
    res.status(400).send({
      message: "Please enter some information for the new currency."
    })
  }
}

module.exports = {
  getCurrencies,
  createCurrency
}