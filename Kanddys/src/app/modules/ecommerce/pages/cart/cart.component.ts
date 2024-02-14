import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

// * State.
import { EcommerceService } from '@ecommerce/services/ecommerce.service';

// * Interfaces.
import { IAppState, ILoading } from '@core/interfaces/app.interface';
import { ICart, IEcommerce } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.

// * Selectors.

// * Shared.
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '@core/components/button/button.component';
import { environment } from '../../../../../environments/environment';
import { CoreService } from '../../../../core/services/core.service';
import { currency } from '../../../../core/util/currency.pipe';
import { updateCart } from '../../state/ecommerce.actions';
import { selectEcommerceCart, selectEcommerceConf, selectEcommerceLoading } from '../../state/ecommerce.selectors';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-cart',
	standalone: true,
	imports: [MatExpansionModule, MatIconModule, ButtonComponent],
	templateUrl: './cart.component.html',
	styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
	public status: Signal<ILoading> = this._store.selectSignal(selectEcommerceLoading);
	public cart: Signal<IEcommerce['cart']> = this._store.selectSignal(selectEcommerceCart);
	public conf: Signal<IEcommerce['conf']> = this._store.selectSignal(selectEcommerceConf);
	public traditional: string | null = null;

	public currency = currency;

	public constructor(
		private _store: Store<IAppState>,
		private _ecommerce: EcommerceService,
		private _core: CoreService
	) {}

	public ngOnInit(): void {
		const document: string = `${this._core.hash}${environment.slug}`;
		const local = localStorage.getItem(document);
		if (local) {
			const cart: ICart = JSON.parse(local);
			this.traditional = cart.traditional;
		}
	}

	public redirect(route: string, id?: string): void {
		this._ecommerce.redirect(route, id);
	}

	public set(product: ICart['products'][number], action: 'DECREMENT' | 'INCREMENT'): void {
		if (action === 'INCREMENT') {
			this._store.dispatch(
				updateCart({ product: { ...product, quantity: product.quantity + 1 }, operation: 'UPDATE' })
			);
		} else {
			if (product.quantity === 1) {
				this._store.dispatch(updateCart({ product, operation: 'DELETE' }));
			} else {
				this._store.dispatch(
					updateCart({ product: { ...product, quantity: product.quantity - 1 }, operation: 'UPDATE' })
				);
			}
		}
	}

	public continue(): void {
		this.redirect('address');
	}

	public back(): void {
		this._ecommerce.redirect('shop');
	}
}
