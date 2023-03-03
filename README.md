# Notes

### data sources
[GraphQL API](https://graphql.minaexplorer.com/)  
[BigQuery Dataset](https://docs.minaexplorer.com/minaexplorer/bigquery-public-dataset)  
[Rest API](https://docs.minaexplorer.com/rest-api/ref#get-summary)  

### general stats
- [x] chain length  
- [x] epoch / slot (chart and progress)  
- [ ] global slot  
- [ ] locked supply  
- [ ] total currency  
- [x] Mina node latest version stable release (https://github.com/MinaProtocol/mina/tags)  
- [ ] distribution of nodes running different versions nodes?  

### time series / other
- [x] number of validators (total/active)
- [x] number of snark workers  
- [x] block time (seconds/minutes in between blocks)  
- [x] latest block miners (hashes with urls to explorer)  
- [x] tx fees in the block (in mina)  
- [x] validator stake distribution (show how distributed the stake is, cumulative stake?)  
- [ ] balance of the winnerAccount (in Mina)  
- [x] number of transactions in a block  
- [ ] **world map with nodes**  
- [ ] active stake  
- [ ] TPS / TPD  
- [x] block coinbase reward?

# notes on the design
1. There's no proper central data storage, i.e. the carts do not share the data one with another. This is by design to keep it simple (albeit a bit less efficient).
2. There's a small data store, though. It stores the current epoch / block / slot / etc. This data is useful for some queries inside the chart components.
