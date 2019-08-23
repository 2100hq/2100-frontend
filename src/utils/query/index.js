import queries from './queries'

export default function Query(state){
  const boundQueries = { ...queries }
  Object.keys(boundQueries).forEach( fn => {
    boundQueries[fn] = (...args) => queries[fn](state, ...args)
  })
  return boundQueries
}