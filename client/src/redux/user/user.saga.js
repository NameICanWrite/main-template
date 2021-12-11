import {
  call,
  put,
  takeEvery,
  takeLatest,
  select,
  delay
} from '@redux-saga/core/effects'
import authApi from '../../api/auth.api'
import userApi from '../../api/user.api'
import withLoading from '../../utils/redux-utils/withLoading.saga'
import { setAuthLoading, setUserDataLoading } from '../loading.slice'
import { createUserWithNameAndPassword, getUserData, loginWithNameAndPassword, loginWithGoogle, logout, setUserData } from './user.slice'



const getUserDataSaga = withLoading(function* () {
    const userData = yield userApi.getSingle('user-data')
    yield put(setUserData(userData))

    return userData.message
}, setUserDataLoading, setAuthLoading)

const handleAuth = withLoading(function* (auth) {
    const authMessage = yield call(auth)
		yield call(getUserDataSaga)

    return authMessage
}, setAuthLoading)


function* loginWithGoogleSaga({ payload }) {
  yield call(handleAuth, async () => await authApi.postSingle('login-with-google', payload))
}

function* loginWithNameAndPasswordSaga({ payload }) {
  yield call(handleAuth, async () => await authApi.postSingle('login', payload))
}

function* createUserWithNameAndPasswordSaga({ payload }) {
  yield call(handleAuth, async () => await authApi.postSingle('signup', payload))
}

const logoutSaga = withLoading(function * () {
  const authMessage = yield authApi.postSingle('logout')
  yield put(setUserData(null))
  yield put(setAuthLoading({success: false, isLoading: false, message: ''}))
  
  return authMessage
}, setUserDataLoading)

export default function* userSaga() {
  yield takeLatest(loginWithGoogle, loginWithGoogleSaga)
  yield takeLatest(loginWithNameAndPassword, loginWithNameAndPasswordSaga)
  yield takeLatest(createUserWithNameAndPassword, createUserWithNameAndPasswordSaga)
  yield takeLatest(logout, logoutSaga)
  yield takeLatest(getUserData, getUserDataSaga)
}

