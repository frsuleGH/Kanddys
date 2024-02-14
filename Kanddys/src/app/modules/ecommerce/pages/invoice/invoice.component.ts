import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../../../core/components/button/button.component';
import { SharedDialogComponent } from '../../../../core/dialogs/share/share.component';
import { SuccessDialogComponent } from '../../../../core/dialogs/success/success.component';
import { CoreService } from '../../../../core/services/core.service';
import { currency } from '../../../../core/util/currency.pipe';
import { EcommerceService } from '../../services/ecommerce.service';
import { Invoice } from '../payment/payment.component';

// * Services.

// * Components.

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-invoice',
	standalone: true,
	imports: [MatIconModule, ButtonComponent],
	templateUrl: './invoice.component.html',
	styleUrl: './invoice.component.scss'
})
export class InvoiceComponent {
	public invoice: Invoice | undefined;
	public currency = currency;
	public id: string | undefined;

	private _core: CoreService = inject(CoreService);
	private _ecommerce: EcommerceService = inject(EcommerceService);
	private _route: ActivatedRoute = inject(ActivatedRoute);
	private _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
	private _dialog: MatDialog = inject(MatDialog);

	public ngOnInit(): void {
		this.id = this._route.snapshot.params['id'];
		if (this.id) {
			this._core.get<Invoice>('invoice', this.id).subscribe((res: Invoice) => {
				this.invoice = res;
				const date = new Date(res.createAt).toLocaleString('es-AR', {
					day: '2-digit',
					month: 'long',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				});
				this.invoice.createAt = date;
				this._dialog.open(SuccessDialogComponent, {
					position: { bottom: '0' },
					maxWidth: '432px',
					width: '100%',
					autoFocus: false,
					data: {
						date: this._formmater(res.reservation)
					}
				});
				this._cdr.markForCheck();
			});
		} else {
			this.redirect('shop');
		}
	}

	public redirect(route: string, id?: string): void {
		this._ecommerce.redirect(route, id);
	}

	public open(): void {}

	public share(invoice: Invoice): void {
		if (!invoice) return;
		this._dialog.open(SharedDialogComponent, {
			position: { bottom: '0' },
			maxWidth: '432px',
			width: '100%',
			data: {
				id: invoice.id,
				description: 'LAIA - Factura de compra'
			}
		});
	}

	public _formmater(fecha_str: string): string {
		let fecha = fecha_str.slice(0, 10);
		let horario = fecha_str.slice(10);
		let [año, mes, dia] = fecha.split('-');
		let fecha_formateada = `${dia}-${mes}-${año}`;
		let fecha_final = `${fecha_formateada}${horario}`;
		return fecha_final;
	}
}
