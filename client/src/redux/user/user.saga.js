import {
    call,
    put,
    takeLatest,
} from '@redux-saga/core/effects'
import authApi from '../../api/auth.api'
import userApi from '../../api/user.api'
import withLoading from '../../utils/redux-utils/withLoading.saga'
import {
    setAuthLoading,
    setFetchUserDataLoading,
    setAuthLoadingSilently,
    setUpdateUserDataLoading,
    setUpdateUserPasswordLoading,
    setForgetUserPasswordLoading, setResetUserPasswordLoading,
} from '../loading.slice'
import {
    createUserWithNameAndPassword,
    getUserData,
    loginWithNameAndPassword,
    loginWithGoogle,
    logout,
    setUserData,
    updateUserData,
    updateUserPassword,
    forgetUserPassword,
    resetUserPassword
} from './user.slice'


export const getUserDataSaga = withLoading(function* () {
    const userData = yield userApi.getSingle('user-data')
    yield put(setUserData(userData))

    return userData.message
}, setFetchUserDataLoading, setAuthLoadingSilently)

const handleAuth = withLoading(function* (auth) {
    const authMessage = yield call(auth)
    yield call(getUserDataSaga)

    return authMessage
}, setAuthLoading)

function* loginWithGoogleSaga({payload}) {
    yield call(handleAuth, async () => await authApi.postSingle('login-with-google', payload))
}

function* loginWithNameAndPasswordSaga({payload}) {
    yield call(handleAuth, async () => await authApi.postSingle('login', payload))
}

function* createUserWithNameAndPasswordSaga({payload}) {
    yield call(handleAuth, async () => await authApi.postSingle('signup', payload))
}

const logoutSaga = withLoading(function* () {
    const authMessage = yield authApi.postSingle('logout')
    yield put(setUserData(null))
    yield put(setAuthLoading({success: false, isLoading: false, message: ''}))

    return authMessage
}, setFetchUserDataLoading)

const updateUserDataSaga = withLoading(function* ({payload}) {
    const message = yield userApi.postSingle('user-data', payload)
    yield call(getUserDataSaga)
    return message
}, setUpdateUserDataLoading)

const updateUserPasswordSaga= withLoading( function* ({payload}){
    const message= yield userApi.postSingle('update-password', payload)
    yield call(getUserDataSaga)
    return message
}, setUpdateUserPasswordLoading)

const forgetUserPasswordSaga= withLoading( function* ({payload}){
    const message= yield userApi.postSingle('forgot-password', payload)
    yield call(getUserDataSaga)
    return message
}, setForgetUserPasswordLoading)

const resetUserPasswordSaga= withLoading( function* ({payload}){
    console.log('inside reset pass saga')
    const message= yield userApi.postSingle(`reset-password/${payload.token}`, payload)
    yield call(getUserDataSaga)
    return message
}, setResetUserPasswordLoading)

export default function* userSaga() {
    yield takeLatest(loginWithGoogle, loginWithGoogleSaga)
    yield takeLatest(loginWithNameAndPassword, loginWithNameAndPasswordSaga)
    yield takeLatest(createUserWithNameAndPassword, createUserWithNameAndPasswordSaga)
    yield takeLatest(logout, logoutSaga)
    yield takeLatest(getUserData, getUserDataSaga)
    yield takeLatest(updateUserData, updateUserDataSaga)
    yield takeLatest(updateUserPassword, updateUserPasswordSaga)
    yield takeLatest(forgetUserPassword, forgetUserPasswordSaga)
    yield takeLatest(resetUserPassword, resetUserPasswordSaga)
}


