import {
  USER_ADDRESS_MAP_CONFIRM,
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_RESET,
  USER_DELETE_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_RESET,
  USER_DETAILS_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_TOPSELLERS_LIST_FAIL,
  USER_TOPSELLERS_LIST_REQUEST,
  USER_TOPSELLERS_LIST_SUCCESS,
  USER_SELLERS_LIST_FAIL,
  USER_SELLERS_LIST_REQUEST,
  USER_SELLERS_LIST_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_RESET,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPGRADE_REQUEST,
  USER_UPGRADE_SUCCESS,
  USER_UPGRADE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_RESET,
  USER_UPDATE_SUCCESS,
  USER_PASSWORDRECOVERY_REQUEST,
  USER_PASSWORDRECOVERY_SUCCESS,
  USER_PASSWORDRECOVERY_FAIL,
  USER_PASSWORD_REPLACEMENT_REQUEST,
  USER_PASSWORD_REPLACEMENT_SUCCESS,
  USER_PASSWORD_REPLACEMENT_FAIL,
  USER_NEWSLETTER_REQUEST,
  USER_NEWSLETTER_SUCCESS,
  USER_NEWSLETTER_FAIL,
  USER_NEWSLETTER_VERIFICATION_REQUEST,
  USER_NEWSLETTER_VERIFICATION_SUCCESS,
  USER_NEWSLETTER_VERIFICATION_FAIL,
  USER_NEWSLETTER_UPDATE_REQUEST,
  USER_NEWSLETTER_UPDATE_SUCCESS,
  USER_NEWSLETTER_UPDATE_FAIL,
} from '../constants/userConstants'

export const userPasswordRecoveryReducer = ( state = { email: '', loading: false }, action ) => {
  switch (action.type) {
    case USER_PASSWORDRECOVERY_REQUEST:
      return { loading: true, email: action.payload }
    case USER_PASSWORDRECOVERY_SUCCESS:
      return { loading: false, email: action.payload }
    case USER_PASSWORDRECOVERY_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const userSigninReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SIGNIN_REQUEST:
      return { loading: true }
    case USER_SIGNIN_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case USER_SIGNIN_FAIL:
      return { loading: false, error: action.payload }
    case USER_SIGNOUT:
      return {}
    default:
      return state
  }
}

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true }
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload }
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const userDetailsReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { loading: true }
    case USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload }
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    case USER_DETAILS_RESET:
      return { loading: true }
    default:
      return state
  }
}

export const userUpgradeReducer = (state = { loading: false }, action) => {
  switch (action.type) {
    case USER_UPGRADE_REQUEST:
      return { loading: true }
    case USER_UPGRADE_SUCCESS:
      return { loading: false, userInfo: action.payload.user }
    case USER_UPGRADE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_PROFILE_REQUEST:
      return { loading: true }
    case USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true }
    case USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload }
    case USER_UPDATE_PROFILE_RESET:
      return {}
    default:
      return state
  }
}

export const userUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_UPDATE_REQUEST:
      return { loading: true }
    case USER_UPDATE_SUCCESS:
      return { loading: false, success: true }
    case USER_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case USER_UPDATE_RESET:
      return {}
    default:
      return state
  }
}

export const userListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case USER_LIST_REQUEST:
      return { loading: true }
    case USER_LIST_SUCCESS:
      return { loading: false, users: action.payload }
    case USER_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_DELETE_REQUEST:
      return { loading: true }
    case USER_DELETE_SUCCESS:
      return { loading: false, success: true }
    case USER_DELETE_FAIL:
      return { loading: false, error: action.payload }
    case USER_DELETE_RESET:
      return {}
    default:
      return state
  }
}

export const userTopSellerListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case USER_TOPSELLERS_LIST_REQUEST:
      return { loading: true }
    case USER_TOPSELLERS_LIST_SUCCESS:
      return { loading: false, users: action.payload }
    case USER_TOPSELLERS_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const userSellerListReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case USER_SELLERS_LIST_REQUEST:
      return { loading: true }
    case USER_SELLERS_LIST_SUCCESS:
      return { loading: false, users: action.payload }
    case USER_SELLERS_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const userAddressMapReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_ADDRESS_MAP_CONFIRM:
      return { address: action.payload }
    default:
      return state
  }
}

export const userPasswordReplacementReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PASSWORD_REPLACEMENT_REQUEST:
      return { loading: true, password_replacement: false }
    case USER_PASSWORD_REPLACEMENT_SUCCESS:
      return { loading: false, password_replacement: true }
    case USER_PASSWORD_REPLACEMENT_FAIL:
      return { loading: false, message: action.payload }
    default:
      return state
  }
}

export const userNewsletterReducer = ( state = {}, action) => {
  switch (action.type) {
    case USER_NEWSLETTER_REQUEST:
      return { loading: true }
    case USER_NEWSLETTER_SUCCESS:
      return { loading: false, subscribed: true }
    case USER_NEWSLETTER_FAIL:
      return { loading: false, message: action.payload }
    default:
      return state
  }
}

export const userNewsletterVerifyReducer = ( state = {}, action) => {
  switch (action.type) {
    case USER_NEWSLETTER_VERIFICATION_REQUEST:
      return { loading: true }
    case USER_NEWSLETTER_VERIFICATION_SUCCESS:
      return { loading: false, name: action.payload }
    case USER_NEWSLETTER_VERIFICATION_FAIL:
      return { loading: false, message: action.payload }
    default:
      return state
  }
}

export const userNewsletterUpdateReducer = ( state = {}, action) => {
  switch (action.type) {
    case USER_NEWSLETTER_UPDATE_REQUEST:
      return { loading: true }
    case USER_NEWSLETTER_UPDATE_SUCCESS:
      return { loading: false }
    case USER_NEWSLETTER_UPDATE_FAIL:
      return { loading: false, message: action.payload }
    default:
      return state
  }
}