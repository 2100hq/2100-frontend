import AsyncHandlers from './AsyncHandlers'

export default function Dispatcher (libs = {}) {
  const asyncHandlers = AsyncHandlers(libs)
  const dispatch = libs.dispatch // cache this; its going to be overriden
  const fn = async action => {
    if (!action) return
    console.log(new Date().toISOString(), 'ACTION >', action)
    if (asyncHandlers[action.type]) return asyncHandlers[action.type](action)
    dispatch(action)
  }
  fn.replaceLib = (key, val) => libs[key] = val
  return fn
}
