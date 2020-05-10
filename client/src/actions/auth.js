import axios from 'axios';
import { setAlert } from './alert';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// LOAD USER
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth');
    // loads user into state
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    // removes user object from state
    dispatch({ type: AUTH_ERROR });
  }
};

// Register User
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const { data } = await axios.post('/api/users', body, config);

    // hits api to create new user object in db
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { token: data.token },
    });

    // loads user object into state
    dispatch(loadUser());
  } catch (error) {
    const { errors } = error?.response?.data;

    if (errors) {
      // catches errors if data is inputted incorrectly
      errors.forEach((error, i) =>
        dispatch(setAlert(error.msg, 'danger', (i + 1) * 1000))
      );
    }
    // sets user object in state to null
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// Login User
export const login = ({ email, password }) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const { data } = await axios.post('/api/auth', body, config);

    // updates state with user object
    dispatch({
      type: LOGIN_SUCCESS,
      payload: data,
    });
    dispatch(loadUser());
  } catch (error) {
    const { errors } = error?.response?.data;

    if (errors) {
      errors.forEach((error, i) =>
        dispatch(setAlert(error.msg, 'danger', (i + 1) * 1000))
      );
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / Clear Profile

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
  dispatch({ type: CLEAR_PROFILE });
};
