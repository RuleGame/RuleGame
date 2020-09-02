import { all, select } from 'typed-redux-saga';
import { playerNameSelector } from '../selectors/history';

export default function* trials({ currentPassword, newPassword }) {
  const userId = yield* select(playerNameSelector);
  const changePasswordApiUrl = `http://${HOST}/user/${userId}/password/change`;
  try {
    const response = yield axios.post(changePasswordApiUrl, {
      password: currentPassword,
      new_password: newPassword,
    });

    const {
      data: { rows: successMessage },
    } = response;
    alert(successMessage);
  } catch (e) {
    if (e.response !== undefined && e.response.data !== undefined) {
      const error = typeof e.response.data === 'string' ? e.response.data : e.response.data.error;
      alert(error);
    } else {
      alert(e.message);
    }
  }
}
