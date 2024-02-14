import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnDestroy,
	Signal,
	ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

// * Services.
import { CoreService } from '@core/services/core.service';

// * Interfaces.
import { IAppState, ILoading } from '@core/interfaces/app.interface';
import { ICart, IProduct } from '@ecommerce/interfaces/ecommerce.interface';

// * Selectors.
import { selectEcommerceLoading, selectEcommerceProduct } from '@ecommerce/state/ecommerce.selectors';

// * Material.
import { MatDialog } from '@angular/material/dialog';

// * Dialogs.

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';
import { SharedDialogComponent } from '../../../../core/dialogs/share/share.component';
import { currency } from '../../../../core/util/currency.pipe';
import { EcommerceService } from '../../services/ecommerce.service';
import { updateCart } from '../../state/ecommerce.actions';

@Component({
	changeDetection: ChangeDetectionStrategy.Default,
	selector: 'app-ecommerce-product',
	standalone: true,
	imports: [ButtonComponent],
	templateUrl: './product.component.html',
	styleUrl: './product.component.scss'
})
export class ProductComponent implements OnDestroy {
	@ViewChild('carousel', { static: false }) public carousel?: ElementRef;

	public product!: Signal<IProduct>;
	public status: Signal<ILoading> = this._store.selectSignal(selectEcommerceLoading);

	public currency = currency;

	public mode: 'PRODUCT' | 'DETAILS' = 'PRODUCT';
	public index: number = 0;

	private _elements: NodeListOf<HTMLElement> | undefined = undefined;
	private _listener: (() => void) | undefined;
	private _rendered: boolean = false;
	private _id: string | undefined = undefined;

	public constructor(
		private _store: Store<IAppState>,
		private _core: CoreService,
		private _ecommerce: EcommerceService,
		private _route: ActivatedRoute,
		private _cdr: ChangeDetectorRef,
		private _dialog: MatDialog
	) {
		if (this._route.snapshot.params['id'])
			this.product = this._store.selectSignal(selectEcommerceProduct(this._route.snapshot.params['id']));
	}

	public ngAfterViewInit(): void {
		this._listen();
	}

	public ngAfterViewChecked(): void {
		this._listen();
	}

	public scrollToImage(index: number): void {
		if (!this._rendered) this._listen();
		if (!this._elements) return;

		this._elements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
	}

	public back(): void {
		if (this.mode === 'DETAILS') {
			this.mode = 'PRODUCT';
		} else {
			this._core.back();
		}
	}

	public add(item: IProduct): void {
		const product: ICart['products'][number] = {
			id: item.id,
			title: item.title,
			description: item.description,
			price: item.price,
			stock: item.stock,
			image: item.images[0],
			quantity: 1
		};
		this._store.dispatch(updateCart({ product, operation: 'ADD' }));
		this._ecommerce.redirect('cart');
	}

	public open(): void {
		this._dialog.open(SharedDialogComponent, {
			position: { bottom: '0' },
			maxWidth: '432px',
			width: '100%',
			data: {
				title: this.product().title,
				description: this.product().description
			}
		});
	}

	public ngOnDestroy(): void {
		if (this._listener) this.carousel?.nativeElement.removeEventListener('scroll', this._listener);
	}

	private _scroll(): void {
		const scrollLeft = this.carousel?.nativeElement.scrollLeft || 0;
		const itemWidth = this._elements?.[0]?.offsetWidth || 0;
		if (this.index !== Math.round(scrollLeft / itemWidth)) this.index = Math.round(scrollLeft / itemWidth);
		this._cdr.markForCheck();
	}

	private _listen(): void {
		if (this._rendered) return;
		if (!this.carousel) return;

		if (this._listener) {
			this.carousel.nativeElement.removeEventListener('scroll', this._listener);
		}

		this._elements = this.carousel.nativeElement.children;

		if (this._elements?.length === 1) return;
		this._listener = this._scroll.bind(this);
		this.carousel.nativeElement.addEventListener('scroll', this._listener);
		this._rendered = true;
	}
}
