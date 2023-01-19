## Dashboard data
* Active validators: validators that produced at least one block during the last X blocks (last + current epoch?)
* Total validators: number of unique addresses that produced at least 1 block since X blocks (last + current epoch?)
* Active snark workers: -same as validators-
* Total snark workers: -same as validators-
* A list of latest block creators and the number of blocks produced by each
* Top validators by stake (+ think of how to visualize/measure the centralization/decentralization of stakes)
* Block time: time in minutes between two blocks
* Block rewards
* Fees per block
* Transactions per block
* World map with node locations
* Active stake
* TPS / TPD

## Questions

### 1. **Canonical chain?**

What is the diference between canonical and non-canonical chain? Do I understand it right, that the dashboard should display data from canonical chain only? For example I want to know how many blocks an address has produced. The correct way to do this would be the first, not the second query, right? The first returns 5 blocks, the second one 20+ blocks.

```
query MyQuery {
  blocks(query: {creator: "B62qkgy1rQQmSL91aFeFvrYi9ptqavvgVkUiPZHmy5tZacSupTTCGi6", canonical: true}) {
    blockHeight
    creator
  }
}
```

```
query MyQuery {
  blocks(query: {creator: "B62qkgy1rQQmSL91aFeFvrYi9ptqavvgVkUiPZHmy5tZacSupTTCGi6"}) {
    blockHeight
    creator
  }
}
```

### 2. **Number of validators**

How to efficiently get the time-series data of the number of validators? Here's how I do it right now, how can we optimise this? Fetching 5000 blocks per query, each returning the subsequent 5000 blocks. So for example, getting the block creators from block 1 to block 20,000, would dispatch 4 such queries.

```
query MyQuery {
  blocks(query: {blockHeight_gte: 1, canonical: true, blockHeight_lt: 5000}, limit: 5000) {
    creator
    blockHeight
  }
}
```

### 3. **Number of snark workers**

I thought I could use the same logic as for number of validators, but even with canocinal set to true, there are multiple provers under same block. So single block requires many snarks, right (I guess so, as there are many work ids under each block)? How to efficiently get the time-series data of the number of snark workers?

```
query MyQuery {
  snarks(query: {blockHeight: 210002, canonical: true}) {
    prover
    blockHeight
  }
}
```

### 4. **Top active validators by stake**

How to query the ***active*** validators, instead of all? If I understand correctly, there are many addresses that delegate to itself, but are not actually running the validators (and so not producing any blocks). For example, the following query returns a validator that has not produced a block in a very long time. Is there an efficient way to query validators that are actively producing blocks? So in practice the query should return something [similar to this table](https://minascan.io/mainnet/validators/leaderboard?epoch=45&isFullyUnlocked=false&isNotAnonymous=false&isVerifOnly=false&isWithFee=false&orderBy=DESC&page=0&searchStr=&size=100&sortBy=amount_staked&stake=1000&type=active).

```
query MyQuery {
  stakes(limit: 1, sortBy: BALANCE_DESC, query: {epoch: 45}) {
    balance
    public_key
  }
}
```

We could also fetch the addresses of the validators over the last 1000 blocks, and then fetch the balances of these addresses. To get this, it would take only two queries, but the method is questionable (the last 1000 blocks can in theory not include the top active validators..?).

### 5. **Validator IP addresses (or any other information that let us approximate the location of nodes)**

Does this data exist? Ideas how to get it efficiently? If this is now easily available, I'd like to try setting up some kind of a program and api that creates this data (after the dashboard is finished), but I'm short on good ideas how to get the data.
