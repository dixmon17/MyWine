const initialState = { offline: false, firstStart: true, email: null, verified: null, firstSync: true }

function oauth(state = initialState, action) {
  let nextState = {}
  switch (action.type) {
    case 'SUCCESS_LOGIN':
      nextState = {
        ...state,
        verified: (action.payload.verified?action.payload.verified:state.verified),
        email: (action.payload.email?action.payload.email:state.email),
        offline: false,
      }
      return nextState
    case 'SET_OFFLINE':
      nextState = {
        ...state,
        offline: true
      }
      return nextState
    case 'FIRST_START' :
      nextState = {
        ...state,
        firstStart: false
      }
      return nextState
    case 'LOGOUT':
      return initialState
    case 'SIGNUP':
      nextState = {
        ...state,
        email: action.payload.email,
        verified: false
      }
      return nextState
    case 'UPDATE_PROFILE':
      nextState = {
        ...state,
        email: action.payload.email,
        verified: true
      }
      return nextState
    case 'IS_VERIFIED':
      nextState = {
        ...state,
        verified: true
      }
      return nextState
    case 'MAKE_FIRST_SYNC':
      nextState = {
        ...state,
        firstSync: false
      }
      return nextState
    case 'LOGOUT':
      return initialState
  default:
    return state
  }
}

export default oauth
