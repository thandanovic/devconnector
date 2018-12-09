//TESt ACTIOn
import { GET_ERRORS } from './types'
import axios from 'axios'

//Test action
export const registerUser = (userData, history) => dispatch => {
    axios
        .post('/api/users/register', userData)
        .then(result => history.push('/login'))
        .catch(err => dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        }));
}