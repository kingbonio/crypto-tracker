import * as request from 'browser-request';
import * as coins from "./config/coins.json";

const uri = "https://api.coinmarketcap.com/v1/ticker/";
const currentPrices = [];
const pricePromises = [];
const displayDiv = document.getElementById("display");

async function requestCoinData(coin){
    return request(uri + coin.name, results => {
        results = JSON.parse(results);
        currentPrices.push({ name: coin.name, price: results[0].price_usd });
        for (let i = 0; i < coins.length; i++) {
            if (coins[i].name === currentPrice.name) {
                coins[i].currentPrice = results[0].price_usd;
            }
        }
    });
}

function calculateStatistics(currentPrice) {
    for (let i = 0; i < coins.length; i++) {
        if (coins[i].name === currentPrice.name) {
            let coin = coins[i];
            let changeInValue = (currentPrice.price - coin.purchasePrice) * 100;
            let profitMade = coin.volume * (changeInValue / 100);
            coin.currentPrice = currentPrice.price;
            coin.changeInValue = parseFloat(changeInValue).toFixed(5);
            coin.originalValue = parseFloat(coin.purchasePrice * coin.volume).toFixed(2);
            coin.currentValue = parseFloat(coin.currentPrice * coin.volume).toFixed(2);
            coin.profitMade = parseFloat(coin.currentValue - coin.originalValue).toFixed(2);
        }
    }
}

displayDiv.innerHTML += "Collecting data...\n";

for (let i = 0; i < coins.length; i++) {
    pricePromises.push(requestCoinData(coins[i]));
}

Promise.all(pricePromises)
    .then(prices => {
        let totalProfit = 0;
        for (let i = 0; i < currentPrices.length; i++) {
            calculateStatistics(currentPrices[i]);
        }
        for (let i = 0; i < coins.length; i++) {
            let coin = coins[i];
            displayDiv.innerHTML += coin.name;
            displayDiv.innerHTML += "buy price: $" + coin.purchasePrice;
            displayDiv.innerHTML += "current price: $" + coin.currentPrice;
            displayDiv.innerHTML += "buy value: $" + coin.originalValue;
            displayDiv.innerHTML += "current value: $" + coin.currentValue;
            displayDiv.innerHTML += "Change in price = " + coin.changeInValue + "%";
            displayDiv.innerHTML += "Profit made = $" + coin.profitMade + "\n";
            totalProfit += Number(coin.profitMade);
        }
        displayDiv.innerHTML += "\nTotal profit = $" + parseFloat(totalProfit).toFixed(2);
    })
    .catch(err => {
        displayDiv.innerHTML += err;
    });


// request = promises
// fulfill promises and then calculate results
// Then show results


