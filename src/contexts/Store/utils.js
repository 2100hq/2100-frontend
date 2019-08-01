import { set, uniqueId, keyBy } from 'lodash'

export function isPrivateUpdate (action) {
  return (
    (Array.isArray(action.params.path) &&
      action.params.path[0] === 'private') ||
    /^private/.test(action.params.path)
  )
}
/*
 * Remaps `private.myCommand` commands to be keyed by transactionHash if available
 */
export function remapPrivateData (action) {
  let { path, data } = action.params
  if (typeof path === 'string') path = path.split('.')
  // ['private']
  if (path.length === 1) {
    if (data.myCommands) {
      data.myCommands = keyBy(
        Object.values(data.myCommands),
        command => command.transactionHash || command.id
      )
    }
  }
  // ['private', 'myCommands']
  if (path.length === 2 && path[1] === 'myCommands') {
    data = keyBy(
      Object.values(data),
      command => command.transactionHash || command.id
    )
  }

  // ['private', 'myCommands', 'id123']
  if (path.length === 3 && path[1] === 'myCommands') {
    path[2] = data.transactionHash || data.id
  }

  return {
    ...action,
    params: {
      ...action.params,
      path,
      data
    }
  }
}
export const errors = {
  login: {
    NOT_UNLOCKED: 'Please unlock your Ethereum wallet before signing in',
  },
  auth: {
    NOT_LOGGED_IN: 'Please sign in'
  }
}
