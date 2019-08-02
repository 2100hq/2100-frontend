import AsyncHandlers from './AsyncHandlers'

export default function Dispatcher (libs) {
  const asyncHandlers = AsyncHandlers(libs)
  return async action => {
    if (!action) return
    console.log('ACTION >', action.type, action.params)
    if (asyncHandlers[action.type]) return asyncHandlers[action.type](action)
    libs.dispatch(action)
  }
}
