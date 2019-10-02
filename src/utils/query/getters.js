import { get, pickBy, omit } from 'lodash'

export default function Getters({state}){
  const getters = {
    getIsSignedIn: () => get(state, 'private.isSignedIn', false),
    getLatestBlock: () => get(state, 'public.latestBlock.number'),
    getTokens: () => get(state, ['tokens'], {}),
    getToken: (tokenid) => {
      if (!tokenid) return {}
      if (tokenid.tokenid || tokenid.id) tokenid=tokenid.tokenid || tokenid.id
      // if tokenid is an address
       if (/^0x/.test(tokenid)){
         // try both active and pending paths
         return get(state,`public.tokens.active.${tokenid}`) || get(`public.tokens.pending.${tokenid}`) || {}
       }
      // if it's not an address treat it as a username
      return get(state, `tokens.${tokenid.replace(/^\$/, '')}`, {})
    },
    getTokenName: (tokenid) => get(getters.getToken(tokenid), 'name'),
    getUserMyName: () => get(state,'private.username'),
    getMyToken: () => get(state, 'private.mytoken'),
    getUserAddress: () => get(state, 'web3.account',''),
    getIsConnected: () => get(state, 'network.connected'),
    getIsLoading: () => get(state, 'network.loading'),
    getIsMyToken: (token) => (getters.getMyToken() || {}).id === token.id,
    getUserName: (userid) => get(state, ['owners', userid, 'name']),
    getIsAllocating: () => get(state, 'intents.allocating', false),
    getIsEditingAllocations: () => get(state, 'intents.editingAllocations', false),
    getCurrentView: () => state.view,
    getActiveTokensArray: () => Object.values(state.tokens || {}).sort( (a, b) => a.rank - b.rank ),
    getMyStakedOrHeldTokensArray: (sorted = true) => {
      const tokens = Object.values(state.tokens || {}).filter(token => {
        const hasBalance = get(token, 'hasBalance', false)
        const isStaking = get(token, 'isStaking', false)
        return hasBalance || isStaking
      })
      if (!sorted) return tokens
      return tokens.sort( (a, b) => a.rank - b.rank )
    },
    getTopTenTokensArray: () => Object.values(state.tokens || {}).filter(token => {
        return token.rank < 11
      }).sort( (a, b) => a.rank - b.rank ),
    getMyStakedTokens: () => Object.entries(get(state, 'private.myStakes', {})).reduce( (obj, [name, stake]) => {
      if (name === '2100') return obj
      if (!stake || stake === "0") return obj
      obj[name] = stake
      return obj
    }, {})
  }
  return getters
}