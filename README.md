## API Reqs ##

schema -

```
{
    user: {
        total: 2100,
        used: 1625,
        stakes: {
          'ThinkingUSD': 250,
          'naval': 1000,
          'SatoshiLite': 375
        },
        favorites: ['balajis', 'ThinkingUSD'],
        minted: {
          naval: {
            available: 6,
            pending: 0,
            total: 10
          },
          VitalikButerin: {
            available: 0,
            pending: 0,
            total: 100
          }
        }
    },
    featured: {
      username: "VitalikButerin",
      description: "Creator of the Ethereum Smart Contract Platform",
      followers: 130000,
      minting: 25000
    },
    assets: [
        {
          asset: 'VitalikButerin',
          displayName: 'Vitalik Non-giver of Ether',
          followers: 870300,
          staked: 43000,
          categories: ['Crypto Twitter']
        },
        {
          asset: 'elonmusk',
          displayName: 'Elon Musk',
          followers: 27400000,
          staked: 30000,
          categories: ['Tech']
        }
    ]
}
```

Actions -

```
allocate(user, asset, alloc)

settleToken(user, asset, amount)

addAsset(user, asset)

disputeAsset(user, asset)

claimOwnersReward(user, asset)

optOut(user, asset)
```
