const initialState = {
  lastUpdate: {cellars:0, blocks:0, positions:0, wines:0, appellations:0, domains:0, regions:0, countries:0},
}

function update(state = initialState, action) {
  let nextState = {}
  switch (action.type) {
    case 'CELLAR':
      nextState = {
        ...state,
        lastUpdate: {...state.lastUpdate, cellars:action.payload},
      }
      return nextState
    case 'BLOCK':
      nextState = {
        ...state,
        lastUpdate: {...state.lastUpdate, blocks:action.payload},
      }
      return nextState
    case 'POSITION':
      nextState = {
        ...state,
        lastUpdate: {...state.lastUpdate, positions:action.payload},
      }
      return nextState
    case 'WINE':
      nextState = {
        ...state,
        lastUpdate: {...state.lastUpdate, wines:action.payload},
      }
      return nextState
    case 'APPELLATION':
      nextState = {
        ...state,
        lastUpdate: {...state.lastUpdate, appellations:action.payload},
      }
      return nextState
    case 'DOMAIN':
      nextState = {
        ...state,
        lastUpdate: {...state.lastUpdate, domains:action.payload},
      }
      return nextState
    case 'REGION':
      nextState = {
        ...state,
        lastUpdate: {...state.lastUpdate, regions:action.payload},
      }
      return nextState
    case 'COUNTRY':
      nextState = {
        ...state,
        lastUpdate: {...state.lastUpdate, countries:action.payload},
      }
      return nextState
    case 'LOGOUT':
      return initialState
  default:
    return state
  }
}

export default update
