// initialize fs to read/write later
const fs = require("fs");

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

module.exports = {
  getCurrencies
}