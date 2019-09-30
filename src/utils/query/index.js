import getters from './getters'
import setters from './setters'

export default function Query(...args){
  return { ...getters(...args), ...setters(...args) }
}