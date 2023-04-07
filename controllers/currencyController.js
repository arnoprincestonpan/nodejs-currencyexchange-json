// initialize fs to read/write later
const fs = require("fs");
// import as an Object to read and/or write
const dataObject = require("../data.json");
// unique id generated
const { v4: uuidv4 } = require("uuid");

// error handler
const errorHandler = (err, req, res, next) => {
  if (err) {
    console.error(err.message);
    if (err.status === 404) {
      res.status({
        error: err.message,
      });
    } else if (err.status === 400) {
      res.status({
        error: err.message,
      });
    } else {
      res.status(500).send({
        error: err.message,
      });
    }
  } else {
    next();
  }
};

// get all currencies
const getCurrencies = (req, res, next) => {
  try {
    // check if the JSON exists
    if (!dataObject) {
      const error = new Error("Data Object not found. Check for JSON file.");
      return next(error);
    }
    // initialize currencies as the JSON property currencies
    const currencies = dataObject.currencies;
    // check if there are any currencies entered
    if (currencies.length !== 0) {
      // if it is not empty, go ahead and sort the currency
      currencies.sort((a, b) => a.ib - b.id);
      res.status(200).send(currencies);
    } else {
      const err = new Error("There are no currencies. Check JSON file.");
      err.status = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

// create new currency with required body
const createCurrency = (req, res, next) => {
  try {
    // grab the information from the body
    const newCurrency = req.body;
    let currencies = dataObject.currencies;
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
        if (
          !currencies.find(
            (currency) =>
              currency.abbreviation.toLowerCase() ===
              newCurrency.abbreviation.toLowerCase()
          )
        ) {
          // generate a newId, this one is for ordering
          let newId = currencies.length + 1;
          // find a possible existing id
          let maybeExistingId = currencies.find(
            (currency) => currency.id === newId
          );
          // if we can find the existing id, make a new id and make a new one
          while (maybeExistingId) {
            newId = currencies.length + 1;
            maybeExistingId = currencies.find(
              (currency) => currency.id === newId
            );
          }
          // add the new currency Object inside the currencies property
          currencies.push({ ...newCurrency, uuid: uuidv4(), id: newId });
          dataObject.currencies = currencies;
          console.log(newCurrency);
          console.log(currencies);
          // use String, using a variable doesn't work properly
          fs.writeFileSync("data.json", JSON.stringify(dataObject, null, 4));
          res.status(201).send(newCurrency);
        } else {
          const err = new Error(`${newCurrency.abbreviation} already exists.`);
          err.status = 400;
          next(err);
        }
      } else {
        const err = new Error(
          `Please enter data for the fields: ${requiredFields.join(", ")}`
        );
        err.status = 400;
        next(err);
      }
    } else {
      // if no data was passed, we let the user know
      const err = new Error("No data inputted. Please enter some data.");
      err.status = 400;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

// get a specific currency
const getCurrencyByAbbreviation = (req, res, next) => {
  try {
    // find if currency.abbreviation exists
    const currency = dataObject.currencies.find(
      (currency) =>
        currency.abbreviation.toLowerCase() ===
        req.params.abbreviation.toLowerCase()
    );
    if (currency) {
      res.status(200).send(currency);
    } else {
      const err = new Error(
        `${req.params.abbreviation.toUpperCase()} not found.`
      );
      err.status = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

// delete currency by req.params.abbreviation
const deleteCurrencyByAbbreviation = (req, res, next) => {
  try {
    const currency = dataObject.currencies.find(
      (currency) =>
        currency.abbreviation.toLowerCase() ===
        req.params.abbreviation.toLowerCase()
    );
    if (currency) {
      dataObject.currencies = dataObject.currencies.filter(
        (currency) =>
          currency.abbreviation.toLowerCase() !==
          req.params.abbreviation.toLowerCase()
      );
      fs.writeFileSync("data.json", JSON.stringify(dataObject, null, 4));
      res.status(200).send({
        message: `${req.params.abbreviation.toUpperCase()} deleted.`,
      });
    } else {
      const err = new Error(
        `${req.params.abbreviation.toUpperCase()} not found.`
      );
      err.status = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
};

// update currency by finding req.params.abbreviation and providing req.body
const updateCurrencyByAbbreviation = (req, res, next) => {
  try {
    const currencyIndex = dataObject.currencies.findIndex(
      (currency) =>
        currency.abbreviation.toLowerCase() ===
        req.params.abbreviation.toLowerCase()
    );
    if (currencyIndex !== -1) {
      dataObject.currencies[currencyIndex] = {
        ...dataObject.currencies[currencyIndex],
        symbol: req.body.symbol,
        country: req.body.country,
        currencyName: req.body.currencyName,
        abbreviation: req.body.abbreviation,
        buyPrice: req.body.buyPrice,
        sellPrice: req.body.sellPrice,
      };
      fs.writeFileSync("data.json", JSON.stringify(dataObject, null, 4));
      res.status(200).send({
        message: `${req.params.abbreviation.toUpperCase()} updated.`,
      });
    } else {
      const err = new Error(
        `${req.params.abbreviation.toUpperCase()} not found.`
      );
      err.status = 404;
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  errorHandler,
  getCurrencies,
  createCurrency,
  getCurrencyByAbbreviation,
  deleteCurrencyByAbbreviation,
  updateCurrencyByAbbreviation,
};
