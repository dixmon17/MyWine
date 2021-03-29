const initialState = { lastUpdate: {appellations:0, regions:0, countries:0, varieties:0} }

function fixtures(state = initialState, action) {
  let nextState = {}
  switch (action.type) {
    case 'FIXTURES_APPELLATION_VERIFIED':
      nextState = {
        ...state,
        lastUpdate: {...state.lastUpdate, appellations:action.payload}
      }
      return nextState
    case 'FIXTURES_REGION_VERIFIED':
      nextState = {
        ...state,
        lastUpdate: {...state.lastUpdate, regions:action.payload}
      }
      return nextState
    case 'FIXTURES_COUNTRY_VERIFIED':
      nextState = {
        ...state,
        lastUpdate: {...state.lastUpdate, countries:action.payload}
      }
      return nextState
    case 'FIXTURES_VARIETY_VERIFIED':
      nextState = {
        ...state,
        lastUpdate: {...state.lastUpdate, varieties:action.payload}
      }
      return nextState
  default:
    return state
  }
}

export default fixtures
