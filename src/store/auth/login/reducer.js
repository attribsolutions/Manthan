import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  ROLE_ACCESS_API_CALL_SUCCESS,
  ROLE_ACCESS_API_UPDATE_SUCCESS,
  GET_USER_DETAILS_AFTER_LOGIN_SUCCESS,
  DESISION_DEROPDOWN_SUCCESS_AFTER_LOGIN,
  GET_SUPER_ADMIN_API_SUCCESS,
  LOGOUT_REST
} from "./actionTypes"

const initialState = {
  loginError: null,
  loading: false,
  RoleData:[],
  RoleAccessUpdateData:[],
  afterLoginUserDetails:{},
  divisionDropdown:[],
  SuperAdmin:[]
}

const Login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      }

    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
      }
   
    case LOGOUT_USER:
      state = { ...state ,
    }
      break
    case LOGOUT_USER_SUCCESS:
      state = { ...state ,
      }
      
    case API_ERROR:
      state = { ...state, loginError: action.payload, loading: false }
      break

      case GET_USER_DETAILS_AFTER_LOGIN_SUCCESS:
        return {
          ...state,
          afterLoginUserDetails: action.payload,
        }
        
      case DESISION_DEROPDOWN_SUCCESS_AFTER_LOGIN:
        return {
          ...state,
          divisionDropdown: action.payload,
        }
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

          case GET_SUPER_ADMIN_API_SUCCESS:
            return {
              ...state,
              SuperAdmin: action.payload,
            }

            case  LOGOUT_REST: 
            return{
                 ...initialState,
            }
    default:
      state = { ...state }
      break
  }
  return state
}

export default Login
