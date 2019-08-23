import { get } from 'lodash'

const queries = {
  getIsSignedIn: state => get(state, 'private.isSignedIn', false),
  getLatestBlock: state => get(state, 'public.latestBlock.number'),
  getToken: (state, tokenid) => {
    if (!tokenid) return {}
    if (tokenid.tokenid) tokenid=tokenid.tokenid
    // if tokenid is an address
     if (/^0x/.test(tokenid)){
       // try both active and pending paths
       return get(state,`public.tokens.active.${tokenid}`) || get(`public.tokens.pending.${tokenid}`) || {}
     }
    // if it's not an address treat it as a username
    return get(state, `tokens.${tokenid}`, {})
  },
  getTokenName: (state, tokenid) => get(queries.getToken(state,tokenid), 'name'),
  getUserName: state => get(state,'private.username'),
  getMyToken: state => get(state, 'private.mytoken'),
  getUserAddress: state => get(state, 'web3.account')
}

export default queries