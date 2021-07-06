import * as Witnet from "witnet-requests"

// Retrieves USD price of a bitcoin from the BitStamp API
const bitstamp = new Witnet.Source("https://www.bitstamp.net/api/ticker/")
  .parseJSONMap()   // Parse a `Map` from the retrieved `String`
  .getFloat("last") // Get the `Float` value associated to the `last` key

// Retrieves USD price of a bitcoin from CoinDesk's "bitcoin price index" API
// The JSON here is a bit more complex, thus more operators are needed
const coindesk = new Witnet.Source("https://api.coindesk.com/v1/bpi/currentprice.json")
  .parseJSONMap()         // Parse a `Map` from the retrieved `String`
  .getMap("bpi")          // Get the `Map` value associated to the `bpi` key
  .getMap("USD")          // Get the `Map` value associated to the `USD` key
  .getFloat("rate_float") // Get the `Float` value associated to the `rate_float` key

// Filters out any value that is more than 1.5 times the standard
// deviation away from the average, then computes the average mean of the
// values that pass the filter.
const aggregator = new Witnet.Aggregator({
  filters: [
   [Witnet.Types.FILTERS.deviationStandard, 1.5]
  ],
  reducer: Witnet.Types.REDUCERS.averageMean
})

// Filters out any value that is more than 1.5 times the standard
// deviation away from the average, then computes the average mean of the
// values that pass the filter.
const tally = new Witnet.Tally({
  filters: [
   [Witnet.Types.FILTERS.deviationStandard, 1.0]
  ],
  reducer: Witnet.Types.REDUCERS.averageMean
})

// This is the Witnet.Request object that needs to be exported
const request = new Witnet.Request()
  .addSource(bitstamp)       // Use source 1
  .addSource(coindesk)       // Use source 2
  .setAggregator(aggregator) // Set the aggregation script
  .setTally(tally)           // Set the tally script
  .setQuorum(100, 55)        // Set witness count
  .setFees(1, 1)             // Set economic incentives

// Do not forget to export the request object
export { request as default }