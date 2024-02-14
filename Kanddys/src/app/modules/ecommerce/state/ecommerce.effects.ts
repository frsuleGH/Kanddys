// * ENV.
import { environment } from '../../../../environments/environment';
// * ----------------------------------------------------------------
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of } from 'rxjs';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Interfaces.
import { IAppState } from '@core/interfaces/app.interface';
import { ICart, IEcommerce } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import { loadEcommerce, loadedEcommerce, updateCart, updatedCart } from './ecommerce.actions';

// * View.
import { EcommerceComponent } from '@ecommerce/ecommerce.component';
import { LoadingService } from '../../../core/services/loading.service';

@Injectable({ providedIn: EcommerceComponent })
export class EcommerceEffects {
	private _actions$: Actions = inject(Actions);
	private _core: CoreService = inject(CoreService);
	private _router: Router = inject(Router);
	private _store: Store<IAppState> = inject(Store<IAppState>);
	private _loading: LoadingService = inject(LoadingService);

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public loadEcommerce$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(loadEcommerce),
			mergeMap((action) =>
				this._core.get<IEcommerceResponse>('ecommerce', environment.slug).pipe(
					map((res) => this._transform(res)),
					map((ecommerce: IEcommerce) => {
						this._loading.hide();
						return loadedEcommerce({ ecommerce });
					}),
					catchError((error) => {
						console.error(error);
						this._loading.hide();
						void this._router.navigate(['']);
						return of({ type: 'LOAD_MERCHANT_FAILED' });
					})
				)
			)
		);
	});

	private _transform(res: IEcommerceResponse): IEcommerce {
		const document: string = `${this._core.hash}${environment.slug}`;
		const local = localStorage.getItem(document);
		let cart: ICart;

		if (local) {
			cart = JSON.parse(local);
		} else {
			cart = {
				id: document,
				products: [],
				traditional: null,
				count: 0,
				total: 0,
				valid: true
			};
		}

		localStorage.setItem(document, JSON.stringify(cart));

		return {
			status: 'LOADED',
			shop: {
				merchant: {
					title: res.title,
					description: res.description,
					logo: res.logo,
					email: res.email
				},
				products: res.products.map((product: IEcommerceResponse['products'][number]) => {
					return {
						id: product.id,
						title: product.title,
						description: product.description,
						images: product.images,
						price: product.price,
						stock: product.stock
					};
				})
			},
			conf: {
				traditional: res.traditional,
				virtual: res.virtual,
				delivery: res.delivery,
				pickup: res.pickup,
				reservation: res.reservation
			},
			cart: cart,
			disabled: res.disabled,
			calendar: res.calendar
		};
	}

	// eslint-disable-next-line @typescript-eslint/member-ordering
	public updateCart$ = createEffect(() => {
		return this._actions$.pipe(
			ofType(updateCart),
			mergeMap((action) => {
				const document: string = `${this._core.hash}${environment.slug}`;
				const local = localStorage.getItem(document);
				if (local) {
					const cart: ICart = JSON.parse(local);
					const index = cart.products.findIndex((item) => item.id === action.product.id);
					switch (action.operation) {
						case 'ADD':
							if (index === -1) {
								cart.products.push(action.product);
							} else {
								cart.products[index].quantity += action.product.quantity;
							}
							break;
						case 'DELETE':
							if (index !== -1) {
								cart.products.splice(index, 1);
							}
							break;
						case 'UPDATE':
							if (index !== -1) {
								cart.products[index] = action.product;
							}
							break;
					}
					cart.count = cart.products.length;
					cart.total = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
					localStorage.setItem(document, JSON.stringify(cart));
					return of(updatedCart({ cart }));
				} else {
					return of({ type: 'UPDATE_CART_FAILED' });
				}
			})
		);
	});
}

interface IEcommerceResponse {
	description: string;
	virtual: boolean;
	email: string;
	pickup: boolean;
	logo: string;
	traditional: boolean;
	title: string;
	reservation: boolean;
	products: {
		id: string;
		title: string;
		images: string[];
		stock: number;
		price: number;
		description: string;
	}[];
	delivery: boolean;
	disabled: string[];
	calendar: {
		batch: {
			limit: number;
			to: string;
			from: string;
			day: string;
			title: string;
		}[];
		delay: number;
	};
}
