import { createAction, props } from '@ngrx/store';

// * Interfaces.
import { IUserState } from '@core/interfaces/app.interface';

// * Actions.
// * LOAD USER.
export const loadUser = createAction('[User] Load', props<{ mail: string }>());
export const loadedUser = createAction('[User] Loaded', props<{ mail: string }>());

// * USER STATE.
export const userMode = createAction('[User] Mode', props<{ mode: IUserState['mode'] }>());

// * CHECK USER.
export const checkUser = createAction('[User] Check User', props<{ mail: string }>());

// * CHECKED USER.
export const checkedUser = createAction('[User] Checked User');

// * CREATE USER.
export const createUser = createAction('[User] Create User');

// * RECOVER PASSWORD.
export const recoverUser = createAction('[User] Recover Password', props<{ mail: string }>());
export const successUser = createAction('[User] Recovered Password');
export const errorUser = createAction('[User] Recovered Password Error');

// * LOGIN.
export const login = createAction('[User] Login', props<{ mail: string; password: string }>());
export const logged = createAction('[User] Logged', props<{ mail: string }>());
