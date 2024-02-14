import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Interfaces.
import { IMail } from '@core/interfaces/app.interface';

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

// * View.
import { SqqDialogComponent } from '@core/dialogs/sqq/sqq.component';

@Injectable({ providedIn: SqqDialogComponent })
export class UserEffects {
	// eslint-disable-next-line @ngrx/use-consistent-global-store-name
	private _actions$: Actions = inject(Actions);
	private _core: CoreService = inject(CoreService);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public loadUser$ = createEffect(() =>
		this._actions$.pipe(
			ofType(loadUser),
			mergeMap((action) =>
				this._core.get<{ email: string; password: string }>('user', action.mail).pipe(
					map((user) => {
						this._core.authentication = true;
						return loadedUser({ mail: user.email });
					}),
					catchError((error) => of({ type: 'LOAD_USER_FAILED' }))
				)
			)
		)
	);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public checkUser$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(checkUser),
			mergeMap((action) =>
				this._core.get<string>('user', action.mail).pipe(
					map((user) => checkedUser()),
					catchError(() => {
						const password: string = this._core.createPassword();
						const data = {
							email: action.mail,
							password
						};
						return this._core.post<string>('user', action.mail, data).pipe(
							map((user) => {
								const mail: IMail = {
									message: {
										html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
																					<h2 style="color: #4a4a4a;">El acceso a tu LAIA está listo.</h2>
																					<p style="color: #4a4a4a;">Aquí te dejamos tu contraseña para futuros ingresos en la misma:</p>
																					<p style="font-weight: bold; color: #000;">${password}</p>
																					<p style="color: #4a4a4a;">LAIA entrenada por Daviel</p>
																					<p style="color: #4a4a4a;">Coordinador de tu Experiencia con LAIA</p>
																	</div>`,
										subject: 'Acceso a tu LAIA',
										text: ''
									},
									to: action.mail
								};
								this._core.post<IMail>('mail', action.mail, mail);
								this._core.post('shop', action.mail, { id: action.mail, products: [], categories: [] });
								this._core.post('merchant', action.mail, { id: action.mail });
								this._core.register(action.mail, password);
								return createUser();
							}),
							catchError((error) => of({ type: 'CHECK_USER_FAILED' }))
						);
					})
				)
			)
		);
	});

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public recoverUser$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(recoverUser),
			mergeMap((action) => {
				return this._core.recover(action.mail).pipe(
					map((res) => {
						if (res) {
							return successUser();
						} else {
							return errorUser();
						}
					}),
					catchError((error) => of(userMode({ mode: 'ERROR' })))
				);
			})
		);
	});

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public login$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(login),
			mergeMap((action) => {
				return this._core.login<string>(action.mail, action.password).pipe(
					switchMap(() => {
						return this._core.get<{ email: string; password: string }>('user', action.mail).pipe(
							map((user) => logged({ mail: user.email })),
							catchError(() => of({ type: 'LOGIN_FAILED' }))
						);
					}),
					catchError(() => of({ type: 'LOGIN_FAILED' }))
				);
			})
		);
	});
}
