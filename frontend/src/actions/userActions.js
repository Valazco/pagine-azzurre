import Axios from 'axios'
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_SIGNIN_FAIL,
  USER_SIGNIN_REQUEST,
  USER_SIGNIN_SUCCESS,
  USER_SIGNOUT,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  USER_UPGRADE_REQUEST,
  USER_UPGRADE_SUCCESS,
  USER_UPGRADE_FAIL,
  USER_TOPSELLERS_LIST_REQUEST,
  USER_TOPSELLERS_LIST_SUCCESS,
  USER_TOPSELLERS_LIST_FAIL,
  USER_SELLERS_LIST_REQUEST,
  USER_SELLERS_LIST_SUCCESS,
  USER_SELLERS_LIST_FAIL,
  USER_PASSWORDRECOVERY_SUCCESS,
  USER_PASSWORDRECOVERY_REQUEST,
  USER_PASSWORDRECOVERY_FAIL,
  USER_PASSWORD_REPLACEMENT_SUCCESS,
  USER_PASSWORD_REPLACEMENT_REQUEST,
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

export const register = (username, email, password, sellername, phone, cf, referer, newsletter) => async (dispatch) => {
  dispatch({ type: USER_REGISTER_REQUEST, payload: { username, email, password, sellername, phone, cf, referer } });
  try {
    const { data } = await Axios.post('/api/users/register', {
      username,
      email,
      password,
      sellername,
      phone,
      cf,
      referer,
      newsletter
    });
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const signin = (email, password) => async (dispatch) => {
  dispatch({ type: USER_SIGNIN_REQUEST, payload: { email, password } });
  try {
    const { data } = await Axios.post('/api/users/signin', { email, password });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_SIGNIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const signout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('cartItems');
  localStorage.removeItem('shippingAddress');
  dispatch({ type: USER_SIGNOUT });
  document.location.href = '/signin';
};

export const detailsUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: USER_DETAILS_REQUEST, payload: userId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.get(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${userInfo?.token}` },
    });
    dispatch({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_DETAILS_FAIL, payload: message });
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/users/profile`, user, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    dispatch({ type: USER_SIGNIN_SUCCESS, payload: data });
    localStorage.removeItem('userInfo');
    localStorage.setItem('userInfo', JSON.stringify(data));
    window.location.reload()
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_UPDATE_PROFILE_FAIL, payload: message });
  }
};

export const updateUser = (user) => async (dispatch, getState) => {
  dispatch({ type: USER_UPDATE_PROFILE_REQUEST, payload: user });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/users/${user._id}`, user, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_UPDATE_FAIL, payload: message });
  }
};

export const upgradeUser = (user) => async (dispatch, getState) => {
  dispatch({ type: USER_UPGRADE_REQUEST, payload: user });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.put(`/api/users/upgrade/${user._id}`, user, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    localStorage.setItem('userInfo', JSON.stringify(data));
    dispatch({ type: USER_UPGRADE_SUCCESS, payload: data });
    window.location.reload()
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_UPGRADE_FAIL, payload: message });
  }
};

export const listUsers = () => async (dispatch, getState) => {
  dispatch({ type: USER_LIST_REQUEST });
  try {
    const {
      userSignin: { userInfo },
    } = getState();
    const { data } = await Axios.get('/api/users', {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });
    dispatch({ type: USER_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_LIST_FAIL, payload: message });
  }
};

export const deleteUser = (userId) => async (dispatch, getState) => {
  dispatch({ type: USER_DELETE_REQUEST, payload: userId });
  const {
    userSignin: { userInfo },
  } = getState();
  try {
    const { data } = await Axios.delete(`/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    dispatch({ type: USER_DELETE_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_DELETE_FAIL, payload: message });
  }
};

export const listTopSellers = () => async (dispatch) => {
  dispatch({ type: USER_TOPSELLERS_LIST_REQUEST });
  try {
    const { data } = await Axios.get('/api/users/top-sellers');
    dispatch({ type: USER_TOPSELLERS_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_TOPSELLERS_LIST_FAIL, payload: message });
  }
};

export const listSellers = () => async (dispatch) => {
  dispatch({ type: USER_SELLERS_LIST_REQUEST });
  try {
    const { data } = await Axios.get('/api/users/sellers');
    dispatch({ type: USER_SELLERS_LIST_SUCCESS, payload: data });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    dispatch({ type: USER_SELLERS_LIST_FAIL, payload: message });
  }
};

export const userPasswordRecovery = (email) => async (dispatch) => {
  dispatch({ type: USER_PASSWORDRECOVERY_REQUEST, payload: email });
  try {
    const { data } = await Axios.post('/api/users/password-recovery', { email })
    dispatch({ type: USER_PASSWORDRECOVERY_SUCCESS, payload: { data }})
  } catch(error) {
    const message =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    dispatch({ type: USER_PASSWORDRECOVERY_FAIL, payload: message });
  }
}

export const userPasswordReplacement = (newData, id) => async (dispatch) => {
  dispatch({ type: USER_PASSWORD_REPLACEMENT_REQUEST, payload: newData })
  try {
    const { data } = await Axios.post('/api/users/password-replacement', { newData, id })
    dispatch({ type: USER_PASSWORD_REPLACEMENT_SUCCESS, payload: { data }})
  } catch(error) {
    const message =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    dispatch({ type: USER_PASSWORD_REPLACEMENT_FAIL, payload: message });
  }
}

export const newsletter = (name, email) => async (dispatch) => {
  dispatch({ type: USER_NEWSLETTER_REQUEST, payload: [name, email] })
  try {
    const { data } = await Axios.post('/api/users/newsletter', { name, email })
    dispatch({ type: USER_NEWSLETTER_SUCCESS, payload: { data }})
  } catch(error) {
    const message =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    dispatch({ type: USER_NEWSLETTER_FAIL, payload: message })
  }
}

export const verifyNewsletter = (email) => async (dispatch) => {
  dispatch({ type: USER_NEWSLETTER_VERIFICATION_REQUEST })
  try {
    const { data } = await Axios.post('/api/users/newsletterVerify', { email })
    let name = data.name[0].name
    dispatch({ type: USER_NEWSLETTER_VERIFICATION_SUCCESS, payload: name })
  } catch(error) {
    const message =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    dispatch({ type: USER_NEWSLETTER_VERIFICATION_FAIL, payload: message })
  }
}

export const updateNewsletter = (username, email ) => async (dispatch) => {
  dispatch({ type: USER_NEWSLETTER_UPDATE_REQUEST })
  try {
    const { data } = await Axios.post('/api/users/newsletterUpdate', { username, email })
    dispatch({ type: USER_NEWSLETTER_UPDATE_SUCCESS })
  } catch(error) {
    const message =
    error.response && error.response.data.message
      ? error.response.data.message
      : error.message;
    dispatch({ type: USER_NEWSLETTER_UPDATE_FAIL, payload: message })
  }
}
