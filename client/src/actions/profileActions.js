import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS, CLEAR_PROFILES, CLEAR_CURRENT_PROFILE } from './types'
import setAuthToken from '../utils/setAuthToken'
import axios from 'axios'
import jwt_decode from 'jwt-decode'


export const getCurrentProfile = () => dispatch => {
    dispatch(setProfileLoading());

    axios.get('/api/profile').then(res=> dispatch({
        type: GET_PROFILE,
        payload: res.data
    }))
    .catch(err => dispatch({
        type: GET_PROFILE,
        payload: {}
    }))
}

export const setProfileLoading = () => {
    return { type: PROFILE_LOADING };
}

export const clearCurrentProfile = () => {
    return { type: CLEAR_CURRENT_PROFILE };
}