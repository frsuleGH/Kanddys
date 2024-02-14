import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ButtonComponent } from '../../../../core/components/button/button.component';
import { IAppState, IMail } from '../../../../core/interfaces/app.interface';
import { CoreService } from '../../../../core/services/core.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { currency } from '../../../../core/util/currency.pipe';
import { ICart } from '../../interfaces/ecommerce.interface';
import { EcommerceService } from '../../services/ecommerce.service';
import { clearCart, loadEcommerce } from '../../state/ecommerce.actions';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-payment',
	standalone: true,
	imports: [MatIconModule, ButtonComponent],
	templateUrl: './payment.component.html',
	styleUrl: './payment.component.scss'
})
export class PaymentComponent {
	@ViewChild('fileInput') public input?: ElementRef<HTMLInputElement>;

	public mode: 'BANK' | 'OPTIONS' | 'PAYPAL' | 'PROOF' = 'BANK';
	public image: string | undefined;
	public count: number = 0;
	public total: number = 0;
	public currency = currency;

	private _blob: any;

	private _core: CoreService = inject(CoreService);
	private _ecommerce: EcommerceService = inject(EcommerceService);
	private _store: Store<IAppState> = inject(Store<IAppState>);
	private _loading: LoadingService = inject(LoadingService);

	public ngOnInit(): void {
		const document: string = `${this._core.hash}${environment.slug}`;
		const local = localStorage.getItem(document);
		const cart: ICart | undefined = local ? JSON.parse(local) : undefined;

		if (cart) {
			this.count = cart.products.length;
			this.total = cart.total;
		}

		if (!this._core.user) {
			this._ecommerce.redirect('order');
		}
	}

	public continue(): void {
		this._loading.show();
		this._store
			.pipe(
				select((state) => state),
				take(1)
			)
			.subscribe((state) => {
				const document: string = `${this._core.hash}${environment.slug}`;
				const local = localStorage.getItem(document);
				const cart: ICart | undefined = local ? JSON.parse(local) : undefined;

				const invoice: Invoice = {
					reservation: this._core.calendar ?? '',
					status: 'PENDIENTE',
					phone: this._core.address?.phone ?? 0,
					id: '',
					products: state.ecommerce.cart.products ?? [],
					reference: this._core.address?.reference ?? '',
					addressee: this._core.address?.addressee ?? '',
					total: state.ecommerce.cart.total ?? 0,
					direction: `${this._core.address?.street ? this._core.address?.street : ''} ${this._core.address?.number ? this._core.address?.number : ''}, ${this._core.address?.city ? this._core.address?.city : ''},  ${this._core.address?.country ? this._core.address?.country : ''}`,
					traditional: cart && cart.traditional ? cart.traditional : '',
					image: this.image ?? '',
					check: false,
					createAt: new Date().toISOString(),
					user: this._core.user ?? '',
					merchant: state.ecommerce.shop.merchant.email,
					pickup: this._core.pickUp
				};

				if (this._blob) {
					this._core.uploadImage(this._blob).subscribe((res) => {
						if (res) {
							invoice.image = res;
							this._core.postDocument<Invoice>('invoice', invoice).subscribe((response) => {
								if (this._core.reservation?.id) {
									this._core.post('reservations', this._core.reservation.id, {
										reservation: this._core.reservation?.reservation
									});
									let body: string = '';
									invoice.products.forEach((product) => {
										body += `
										<tr>
										<td style="border: 1px solid #ddd; padding: 8px;">${product.title}</td>
										<td style="border: 1px solid #ddd; padding: 8px;">${product.quantity}</td>
										<td style="border: 1px solid #ddd; padding: 8px;">$${product.price}</td>
										<td style="border: 1px solid #ddd; padding: 8px;">$${product.price * product.quantity}</td>
										</tr>
										`;
									});
									let fecha = new Date(2024, 1, 8, 18, 16, 7);
									let opciones: Intl.DateTimeFormatOptions = {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										hour: 'numeric',
										minute: 'numeric',
										second: 'numeric'
									};
									const mail: IMail = {
										message: {
											html: `<div style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
											<div style="max-width: 800px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;">
												<h1 style="text-align: center;">Factura</h1>
												<p><strong>Reserva:</strong> ${fecha}</p>
												<p><strong>Estado:</strong> ${invoice.status}</p>
												${invoice.phone ? `<p><strong>Teléfono:</strong> ${invoice.phone}</p>` : ''}
												${invoice.reference ? `<p><strong>Referencia:</strong> ${invoice.reference}</p>` : ''}
												${invoice.addressee ? `<p><strong>Destinatario:</strong> ${invoice.addressee}</p>` : ''}
												<p><strong>Total: </strong>$${invoice.total}</p>
												<p><strong>Dirección de envío:</strong> ${this._core.pickUp ? 'Retirar en tienda.' : invoice.direction}</p>
												${invoice.traditional ? `<p><strong>Mensaje de dedicatoria:</strong> ${invoice.traditional}</p>` : ''}
												<p><strong>Creación:</strong> ${fecha.toLocaleString('es-ES', opciones)}</p>
												<p><strong>Usuario:</strong> ${invoice.user}</p>
												<p><strong>Comerciante:</strong> ${invoice.merchant}</p>
												<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
													<thead>
														<tr>
														<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Producto</th>
														<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Cantidad</th>
														<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Precio unitario</th>
														<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Total</th>
													</tr>
													</thead>
													<tbody>
														${body}
													</tbody>
												</table>
												<img src="${invoice.image}" alt="Imagen de la factura" style="display: block; max-width: 100%; margin-top: 20px;">
											</div>
										</div>
										`,
											subject: 'Cafaro factura',
											text: ``
										},
										to: ''
									};
									mail.to = 'javiezcobar@gmail.com';
									this._core.sendEmail(mail);
									mail.to = 'davieltaveras@mac.com';
									this._core.sendEmail(mail);
									// mail.to = 'maximilianokerps@gmail.com';
									// this._core.sendEmail(mail);
									mail.to = this._core.user ?? '';
									this._core.sendEmail(mail);
									this._store.dispatch(clearCart());
									localStorage.setItem(
										document,
										JSON.stringify({
											id: document,
											products: [],
											traditional: null,
											count: 0,
											total: 0,
											valid: true
										})
									);
									this._store.dispatch(loadEcommerce({ slug: environment.slug }));
									this._loading.hide();
									this._ecommerce.redirect('invoice', response.id);
									return;
								} else {
									this._loading.hide();
									return;
								}
							});
						} else {
							this._loading.hide();
							return;
						}
					});
				}
			});
	}

	public reset(): void {
		this.image = undefined;
		this.mode = 'BANK';
	}

	public back(): void {
		if (this.mode === 'PROOF') {
			this.reset();
		} else {
			this._core.back();
		}
	}

	public onClickInput(): void {
		this.input?.nativeElement.click();
	}

	public onFileSelected(event: any): void {
		this._blob = event;
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file: File = input.files[0];
			if (file.type.match('image.*')) {
				this.image = URL.createObjectURL(file);
				this._blob = file;
				this.mode = 'PROOF';
			} else {
				alert('Por favor selecciona una imagen.');
			}
		}
	}
}

export interface Invoice {
	reservation: string;
	status: string;
	phone: number;
	id: string;
	products: {
		title: string;
		price: number;
		id: string;
		quantity: number;
		description: string;
		image: string;
	}[];
	reference: string;
	addressee: string;
	total: number;
	direction: string;
	traditional: string;
	image: string;
	check: boolean;
	createAt: string;
	user: string;
	merchant: string;
	pickup: boolean;
}
