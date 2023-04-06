// initialize fs to read/write later
const fs = require("fs");
// READ only
const dataPath = require("../data.json");
// READ and WRiTE
const data = "../data.json"

const { v4: uuidv4 } = require("uuid");

// get all currencies
const getCurrencies = (req, res) => {
  // initialize currencies as the JSON property currencies
  const currencies = dataPath.currencies;
  // check if there are any currencies entered
  if (currencies.length !== 0) {
    // if it is not empty, go ahead and sort the currency
    currencies.sort((a, b) => a.ib - b.id);
    res.status(200).send(currencies);
  } else {
    // if it is empty, let the user know
    res.status(404).send({
      message: "There are no currencies.",
    });
  }
};

const createCurrency = (req, res) => {
  // grab the information from the body
  const newCurrency = req.body;
  let currencies = dataPath.currencies;
  if (Object.keys(newCurrency).length !== 0) {
    // if there are keys, that means it is not empty

    // may an array of fields that I want an if statement to check
    const requiredFields = [
      "abbreviation",
      "currencyName",
      "symbol",
      "country",
    ];

    // .every will return true if the element exists, as long as there is one false it'll return false
    if (requiredFields.every((field) => newCurrency[field])) {
      // generate a newId, this one is for ordering
      let newId = currencies.length + 1;
      // find a possible existing id
      let maybeExistingId = currencies.find(
        (currency) => currency.id === newId
      );
      // if we can find the existing id, make a new id and make a new one
      while (maybeExistingId) {
        newId = currencies.length + 1;
        maybeExistingId = currencies.find((currency) => currency.id === newId);
      }
      currencies.push({ ...newCurrency, uuid: uuidv4(), id: newId });
      fs.writeFileSync(data, JSON.stringify(currencies, null, 4));
      res.status(201).send(newCurrency);
    } else {
      res.status(400).send({
        message: `Please enter data for the fields: ${requiredFields.join(", ")}`
      })
    }

  } else {
    // if no data was passed, we let the user know
    res.status(400).send({
      message: "No data inputted. Please enter some data.",
    });
  }
};

const getCurrencyByAbbreviation = (req, res) => {
  let currencyJSON = fs.readFileSync("data.json", "utf-8");
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
  let currencyJSON = fs.readFileSync("data.json", "utf-8");
  let currencies = JSON.parse(currencyJSON);
  console.log(`${req.params.abbreviation}`);
  let currency = currencies.filter(
    (currency) =>
      currency.abbreviation.toLowerCase() ==
      req.params.abbreviation.toLowerCase()
  )[0];
  if (currency !== undefined) {
    currencies = currencies.filter(
      (currency) =>
        currency.abbreviation.toLowerCase() !==
        req.params.abbreviation.toLowerCase()
    );
    currencyJSON = JSON.stringify(currencies, null, 4);
    fs.writeFileSync("data.json", currencyJSON, "utf-8");
    res.status(200).send({
      message: `${req.params.abbreviation.toUpperCase()} successfully deleted.`,
    });
  } else {
    res.status(404).send({
      message: `${req.params.abbreviation.toUpperCase()} not found.`,
    });
  }
};

const updateCurrencyByAbbreviation = (req, res) => {
  let currencyJSON = fs.readFileSync("data.json", "utf-8");
  let currencies = JSON.parse(currencyJSON);
  console.log(`${req.params.abbreviation}`);
  let currencyIndex = currencies.findIndex(
    (currency) =>
      currency.abbreviation.toLowerCase() == req.body.abbreviation.toLowerCase()
  );
  if (currencyIndex !== -1) {
    currencies[currencyIndex] = {
      ...currencies[currencyIndex],
      currencyName: req.body.currencyName,
      buyPrice: req.body.buyPrice,
      sellPrice: req.body.sellPrice,
      country: req.body.country,
    };
    currencyJSON = JSON.stringify(currencies, null, 4);
    fs.writeFileSync("data.json", currencyJSON, "utf-8");
    res.status(200).send({
      message: `${req.params.abbreviation.toUpperCase()} updated.`,
    });
  } else {
    res.status(404).send({
      message: `${req.params.abbreviation.toUpperCase()} is not found.`,
    });
  }
};

module.exports = {
  getCurrencies,
  createCurrency,
  getCurrencyByAbbreviation,
  deleteCurrencyByAbbreviation,
  updateCurrencyByAbbreviation,
};
