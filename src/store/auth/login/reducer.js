import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  ROLE_ACCESS_API_CALL_SUCCESS,
  ROLE_ACCESS_API_UPDATE_SUCCESS
} from "./actionTypes"

const initialState = {
  error: "",
  loading: false,
  RoleData:[],
  RoleAccessUpdateData:[]
}

const Login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      }
      break
    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
      }
      break
    case LOGOUT_USER:
      state = { ...state }
      break
    case LOGOUT_USER_SUCCESS:
      state = { ...state }
      break
    case API_ERROR:
      state = { ...state, error: action.payload, loading: false }
      break

      case ROLE_ACCESS_API_CALL_SUCCESS:
        return {
          ...state,
          RoleData: action.payload,
        }

        case ROLE_ACCESS_API_UPDATE_SUCCESS:
          return {
            ...state,
            RoleAccessUpdateData: action.payload,
          }

    default:
      state = { ...state }
      break
  }
  return state
}

export default Login
