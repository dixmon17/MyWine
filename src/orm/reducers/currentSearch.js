const initialState = { id: undefined }

function currentSearch(state = initialState, action) {
  let nextState = {}
  switch (action.type) {
    case 'UPDATE_CURRENT_SEARCH':
      nextState = {
        ...state,
        id: action.payload,
      }
      return nextState
    case 'RESET_CURRENT_SEARCH':
      return initialState
  default:
    return state
  }
}

export default currentSearch
