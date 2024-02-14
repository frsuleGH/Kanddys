import { createReducer, on } from '@ngrx/store';

// * State.
import { loaded, loading } from '@core/state';

// * Actions.
import {
	checkedUser,
	checkUser,
	createUser,
	errorUser,
	loadedUser,
	loadUser,
	logged,
	login,
	recoverUser,
	successUser,
	userMode
} from './user.actions';

// * Interfaces.
import { IUserState } from '@core/interfaces/app.interface';

// * Initial state.
export const initialState: IUserState = {
	status: loading,
	mode: 'LOGIN',
	data: ''
};

// * Reducers.
export const userReducer = createReducer(
	initialState,
	// * LOAD USER.
	on(loadUser, (state): IUserState => {
		return { ...state, status: loading };
	}),
	on(loadedUser, (state, { mail }): IUserState => {
		return { ...state, status: loaded, data: mail, mode: 'HELLO' };
	}),
	// * USER MODE.
	on(userMode, (state, { mode }): IUserState => {
		return { ...state, mode };
	}),
	// * CHECK USER.
	on(checkUser, (state): IUserState => {
		return { ...state, status: loading };
	}),
	on(checkedUser, (state): IUserState => {
		return { ...state, status: loaded, mode: 'OPTIONS' };
	}),
	// * CREATE USER.
	on(createUser, (state): IUserState => {
		return { ...state, status: loaded, mode: 'WELCOME' };
	}),
	// * RECOVER PASSWORD.
	on(recoverUser, (state): IUserState => {
		return { ...state, status: loading };
	}),
	// * RECOVERED PASSWORD.
	on(successUser, (state): IUserState => {
		return { ...state, status: loaded, mode: 'SUCCESS' };
	}),
	// * RECOVERED PASSWORD ERROR.
	on(errorUser, (state): IUserState => {
		return { ...state, status: loaded, mode: 'ERROR' };
	}),
	// * LOGIN.
	on(login, (state): IUserState => {
		return { ...state, status: loading };
	}),
	on(logged, (state): IUserState => {
		return { ...state, status: loaded, mode: 'HELLO' };
	})
);
