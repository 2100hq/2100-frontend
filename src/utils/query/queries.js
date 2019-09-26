import { get } from 'lodash'

const queries = {
  getIsSignedIn: state => get(state, 'private.isSignedIn', false),
  getLatestBlock: state => get(state, 'public.latestBlock.number'),
  getToken: (state, tokenid) => {
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
  getTokenName: (state, tokenid) => get(queries.getToken(state,tokenid), 'name'),
  getUserMyName: state => get(state,'private.username'),
  getMyToken: state => get(state, 'private.mytoken'),
  getUserAddress: state => get(state, 'web3.account', ''),
  getIsConnected: state => get(state, 'network.connected'),
  getIsLoading: state => get(state, 'network.loading'),
  getIsMyToken: (state, token) => (queries.getMyToken(state) || {}).id === token.id,
  getUserName: (state, userid) => get(state, ['owners', userid, 'name']),
  getIsAllocating: state => get(state, 'intents.allocating', false),
  getCurrentView: state => state.view,
  getActiveTokensArray: state => Object.values(state.tokens || {}).sort( (a, b) => a.rank - b.rank ),
  getMyStakedOrHeldTokensArray: state => Object.values(state.tokens || {}).filter(token => {
      const hasBalance = get(token, 'balances.available', "0") !== "0"
      const isStaking = get(token, 'myStake', "0") !== "0"
      return hasBalance || isStaking
    }).sort( (a, b) => a.rank - b.rank ),
  getTopTenTokensArray: state => Object.values(state.tokens || {}).filter(token => {
      return token.rank < 11
    }).sort( (a, b) => a.rank - b.rank )

}

export default queries