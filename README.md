# Exchange Exercise

In this exercise, a set of currency 'pockets' is presented, along with inputs for entering values, allowing the user to perform a currency conversion by moving an amount from one 'pocket' to another.

<img src="/docs/exchange-screenshot.jpg?raw=true" alt="Screenshot of the Exchange screen" width="200px" />

## Getting started

### Installation

Make sure you have yarn installed.

```
git clone https://github.com/jonathanconway/exchange-exercise
cd exchange-exercise
yarn install
```

### Important: configuring data source

As this application uses an external API as its rates data source, you will need to register with that data source and generate a token.

(If you want to test the app with dummy data, you can simply run it as-is, but the data will be out-of-date.)

Go to https://openexchangerates.org/signup/free and sign up for a free plan. When you get your App Id, open the `.env` file in the root folder of the project (`./exchange-exercise`) and set the REACT_APP_OPEN_EXCHANGE_RATES_APP_ID variable to that value.

For example (fake ID):

```
REACT_APP_OPEN_EXCHANGE_RATES_APP_ID=8798798daf7d9s8fs8fsd7f
```

If, for some reason, your token doesn't work, or you have any other issue, feel free to [contact me](mailto:jonathan.conway@gmail.com) and I'll send you my own token.

### Start up

```
yarn start
```

### Tests

You can run unit tests with the following command:

```
yarn test
```

## Notes on the solution

### Rates data

For rates, I used the openexchangerates.org source referred to in the exercise notes. I had briefly looked at a few other sources, but initially perceived this one the simplest. In retrospect, perhaps it would have been easier to use a service that had more a convenient response structure - i.e. mapping all currencies to all other currencies, rather than just from a base (USD) to other currencies. Due to the aforementioned structure, I had to write a little extra mapping code to transform the data from 'base to currencies' to 'currencies to currencies' so that it would be more usable by the application.

### Pockets data

I've hard-coded the pockets and balances for each (see the /public/data/get-pockets-response.json file). I put it behind an HTTP method, so that in future, the code could be changed to retrieve it from a server-side endpoint.

### Third-party components

It would have been time-consuming and beyond the scope of the exercise (as I see it) to implement certain lower-level interactions by hand, so I relied on a couple of third-party components.

* **[react-swipeable-views](https://react-swipeable-views.com)** for 'swiper' carousel interaction.
* **[cleave.js](https://nosir.github.io/cleave.js/)** for numeric input control with prefixes, limitations on allowable characters, number of decimal places, etc.

### Unit testing

#### Philosophy

I generally followed a TDD approach, writing failing tests, making them pass and then refactoring. There were a few cases in which I deviated from this approach - specifically, large-scale refactorings in which I wanted to experiment with a different overall design before committing to it. Generally after this experimentation, I went back and wrote the code in a TDD/test-first manner.

I followed both a classicist and mockist approach, depending on what I was testing.

* Black-box / classicist testing With full mount at the lowest level possible, e.g. presentational components
* Elsewhere, mockist testing with shallow rendering, for simplicity and to prevent duplication of testing effort, e.g. container or composite components

#### Testing caveats

* Unfortunately you will see some `componentWillReceiveProps` warnings when running unit tests or looking at the browser contols. This is due to an [issue with cleave.js](https://github.com/nosir/cleave.js/issues/510), which should hopefully soon be resolved.

### General caveats

* There seems to be a slight difference between the rates given by different sources. For example, for USD to GBP at 12:42 AM 19/09/2019, the source of my data (OpenExchangeRates.org) gives 0.80197, whereas XE gives 0.80199417 at that same time. I think this might be due to differing delays, or maybe it's due to different precision of the numbers as well. Probably not much I could do about that from my app's point of view, aside from, say, finding a source with a shorter delay and more precise numbers.

* Unfortunately I couldn't find a way to show the decimal '.' Button in the iOS native keyboard. This appears to be a limitation of iOS WebKit. If I spent more time I might look at implementing a custom keyboard. 

### If I spent more time...

If I had spent more time on the assignment, I would have made many more changes.

A few of them:

* Rates should really be a map, rather than a function. I only realised this in retrospect. I would definitely change it to a map.

* Reselect could be applied to memoize certain calculated values. Though, as I designed the store to already be fairly optimised, perhaps it wouldn't add very much.

* Normalizr could be applied to normalize the store in a conventional manner (that's easy for other developers to pick up).

* Review the third-party packages for security, using a tool such as `yarn audit`. Some of them may contain vulnerabilities, so these kinds of checks should be done prior to production if possible.

* Record rate and date-time against each transfer. It would be useful to have this info. Perhaps in a real-world scenario, where transactions are synced to the server, it would be useful to have this data, for business, regulatory and/or technical support/diagnostic reasons.

* Check for decimal precision / rounding errors. It's possible that rounding errors could cause inappropriate amounts to be transferred, which the user didn't intend. I should spend more time testing for these kinds of errors and trying to break it.

* The background of the stack could have had texture, as in the mockup, rather than just solid colouring. Also, the colouring could have been calculated programatically, rather than hard-coding it.

* Look and feel of notifications was a bit tacky. Could be more polished to fit into the overall design nicely.

* Some subtle animations could have given it more polish. E.g. animation on notifications showing, or fade in/out of loading spinner.

* Most of the unit tests could use shallow rendering, for added speed and less redundant errors on breakage of lower-level components.