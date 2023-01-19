# Notes
### data sources
https://docs.minaexplorer.com/rest-api/ref#get-summary  
https://graphql.minaexplorer.com/  

### general stats
number of validators (active/ inactive / total)  
number of snark workers (active/ inactive / total)  
validator stake distribution (show how distributed the stake is, cummulative stake?)  
chain length  
epoch / slot (chart and progress)  
global slot  
locked supply  
total currency  
mina node latest version stable release (https://github.com/MinaProtocol/mina/tags)  
distribution of nodes running different versions nodes?  

### time series / other
number of validators  
number of snark workers  
block time (seconds/minutes in between blocks)  
latest block miners (hashes with urls to explorer)  
tx fees in the block (in mina)  
balance of the winnerAccount (in Mina)  
number of transactions in a block  
world map with nodes  
active stake  
TPS / TPD  
block coinbase reward?

### notes on the design
1. There's not central data storage, i.e. the carts do not share the data one with another. This is by design to keep it simple (albeit a bit least efficient).
2. There's a data store, though. It stores the current epoch / block / slot / etc. This data is useful for some queries inside the chart components.
