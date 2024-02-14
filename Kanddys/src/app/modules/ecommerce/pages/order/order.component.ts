import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';
import { ButtonComponent } from '../../../../core/components/button/button.component';
import { SqqDialogComponent } from '../../../../core/dialogs/sqq/sqq.component';
import { CoreService } from '../../../../core/services/core.service';
import { currency } from '../../../../core/util/currency.pipe';
import { ICart } from '../../interfaces/ecommerce.interface';
import { EcommerceService } from '../../services/ecommerce.service';
import { IAddress } from '../address/address.component';

// * Services.

// * Components.

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-order',
	standalone: true,
	imports: [ButtonComponent],
	templateUrl: './order.component.html',
	styleUrl: './order.component.scss'
})
export class OrderComponent {
	public address: IAddress['address'] | undefined;
	public calendar: string | undefined;
	public cart: ICart | undefined;
	public currency = currency;

	private _core: CoreService = inject(CoreService);
	private _ecommerce: EcommerceService = inject(EcommerceService);
	private _dialog: MatDialog = inject(MatDialog);

	public ngOnInit(): void {
		if (!this._core.calendar || !this._core.reservation) {
			this.redirect('address');
		}

		if (this._core.calendar) this.calendar = this._formmater(this._core.calendar);
		this.address = this._core.address;

		const document: string = `${this._core.hash}${environment.slug}`;
		const local = localStorage.getItem(document);
		if (local) {
			this.cart = JSON.parse(local);
		} else {
			this._core.back();
		}
	}

	public confirm(): void {
		if (this._core.user) {
			this._ecommerce.redirect('payment');
		} else {
			this._open();
		}
	}

	private _open(): void {
		const dialog = this._dialog.open(SqqDialogComponent, {
			maxWidth: '432px',
			width: '100%',
			position: { bottom: '0' }
		});

		dialog.afterClosed().subscribe((res: any) => {
			if (res) {
				this.redirect('payment');
			}
		});
	}

	public redirect(route: string, id?: string): void {
		this._ecommerce.redirect(route, id);
	}

	public back(): void {
		this.redirect('calendar');
	}

	private _formmater(fecha_str: string): string {
		let fecha = fecha_str.slice(0, 10);
		let horario = fecha_str.slice(10);
		let [año, mes, dia] = fecha.split('-');
		let fecha_formateada = `${dia}-${mes}-${año}`;
		let fecha_final = `${fecha_formateada}${horario}`;
		return fecha_final;
	}
}
