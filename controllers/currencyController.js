// initialize fs to read/write later
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const getCurrencies = (req, res) => {
  let currencyJSON = fs.readFileSync("currency.json", "utf-8");
  let currencies = JSON.parse(currencyJSON);
  // sort currencyId by number value
  currencies = currencies.sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    }
  });
  if (currencies.length === 0) {
    // when there are no currencies within the JSON
    res.status(404).send({
      message: "There are no currencies.",
    });
  } else {
    // success, send all currencies
    res.status(200).send(currencies);
  }
};

const createCurrency = (req, res) => {
  const currency = req.body;
  // check if currency is empty
  if (Object.keys(currency).length !== 0) {
    // read json file and parse to JSON
    let currenciesjson = fs.readFileSync("currency.json", "utf-8");
    let currencies = JSON.parse(currenciesjson);

    if (
      currencies.filter(
        (existing) => existing.abbreviation === currency.abbreviation
      ) === undefined
    ) {
      // assume it is adding at the end of the file, make newId length of currencies + 1
      let newId = currencies.length + 1;
      // prevent same currencyId
      while (currencies.find((currency) => currency.currencyId == newId)) {
        newId += 1;
      }
      // add currency and use newId and then write to JSON file, return currency
      currencies.push({ ...currency, id: newId, uuid: uuidv4() });
      currenciesjson = JSON.stringify(currencies, null, 4);
      fs.writeFileSync("currency.json", currenciesjson, "utf-8");
      res.status(201).send(currency);
    } else {
      // let user know that the currency abbreviation already exist, therefore the currency already exists
      console.log(`${currency.abbreviation} already exists.`);
      res.status(403).send({
        message: `${currency.abbreviation} already exists.`,
      });
    }
  } else {
    res.status(400).send({
      message: "Please enter some information for currency.",
    });
  }
};

const getCurrencyByAbbreviation = (req, res) => {
  let currencyJSON = fs.readFileSync("currency.json", "utf-8");
  let currencies = JSON.parse(currencyJSON);
  console.log(`${req.params.abbreviation}`);
  let currency = currencies.filter(
    (currency) =>
      currency.abbreviation.toLowerCase() ==
      req.params.abbreviation.toLowerCase()
  );
  if (Object.keys(currency).length !== 0) {
    res.status(200).send(currency);
  } else {
    res.status(404).send({
      message: "currency not found.",
    });
  }
};

const deleteCurrencyByAbbreviation = (req, res) => {
  let currencyJSON = fs.readFileSync("currency.json", "utf-8")
  let currencies = JSON.parse(currencyJSON)
  console.log(`${req.params.abbreviation}`)
  let currency = currencies.filter((currency) => currency.abbreviation.toLowerCase() == req.params.abbreviation.toLowerCase())
  [0]
  if(currency !== undefined) {
    currencies = currencies.filter((currency) => currency.abbreviation.toLowerCase() !== req.params.abbreviation.toLowerCase())
    currencyJSON = JSON.stringify(currencies, null, 4)
    fs.writeFileSync("currency.json", currencyJSON, "utf-8")
    res.status(200).send({
      message: `${req.params.abbreviation} successfully deleted.`
    })
  } else {
    res.status(404).send({
      message: `${req.params.abbreviation} not found.`
    })
  }
}

module.exports = {
  getCurrencies,
  createCurrency,
  getCurrencyByAbbreviation,
  deleteCurrencyByAbbreviation
};
