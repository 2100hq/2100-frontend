export default function Setters({state, actions, dispatch}){
  const setters = {
    setIsEditing: ({tokenid}) => dispatch(actions.update('intents.editingAllocations', {tokenid}))
  }
  return setters
}