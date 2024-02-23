/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (email, name, password, passwordConfirm) => {
  // console.log(window.location.href);

  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        email,
        name,
        password,
        passwordConfirm,
      },
    });
    console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', 'Sign up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }

    // console.log(res);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
