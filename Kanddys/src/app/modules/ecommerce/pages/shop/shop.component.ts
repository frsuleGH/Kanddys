import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

// * Services.
import { EcommerceService } from '@ecommerce/services/ecommerce.service';

// * Interfaces.
import { IAppState } from '@core/interfaces/app.interface';
import { IEcommerce } from '@ecommerce/interfaces/ecommerce.interface';

// * Selectors.
import { selectEcommerceCount, selectEcommerceShop } from '@ecommerce/state/ecommerce.selectors';

// * Shared.
import { MatDialog } from '@angular/material/dialog';
import { ButtonComponent } from '@core/components/button/button.component';
import { SharedDialogComponent } from '../../../../core/dialogs/share/share.component';
import { currency } from '../../../../core/util/currency.pipe';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-shop',
	standalone: true,
	imports: [CurrencyPipe, ButtonComponent],
	templateUrl: './shop.component.html',
	styleUrl: './shop.component.scss'
})
export class ShopComponent {
	public readonly shop: Signal<IEcommerce['shop']> = inject(Store<IAppState>).selectSignal(selectEcommerceShop);
	public readonly width: number = Math.floor((window.innerWidth - 32) / 2);
	public readonly height: number = Math.floor(((window.innerWidth - 32) / 2 / 9) * 16);
	public readonly count: Signal<number> = inject(Store<IAppState>).selectSignal(selectEcommerceCount);
	public currency = currency;
	private _ecommerce: EcommerceService = inject(EcommerceService);
	private _dialog: MatDialog = inject(MatDialog);

	public redirect(route: string, id?: string): void {
		this._ecommerce.redirect(route, id);
	}

	public open(merchant: IEcommerce['shop']['merchant']): void {
		const mercnhat = merchant;
		this._dialog.open(SharedDialogComponent, {
			position: { bottom: '0' },
			maxWidth: '432px',
			width: '100%',
			data: {
				title: mercnhat.title,
				description: merchant.description
			}
		});
	}
}
