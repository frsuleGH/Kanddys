import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Signal } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Store } from '@ngrx/store';
import { filter, first, Subject, takeUntil, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ButtonComponent } from '../../../../core/components/button/button.component';
import { IAppState } from '../../../../core/interfaces/app.interface';
import { CoreService } from '../../../../core/services/core.service';
import { ICalendar } from '../../interfaces/ecommerce.interface';
import { EcommerceService } from '../../services/ecommerce.service';
import { selectEcommerceCalendar, selectEcommerceDisabled } from '../../state/ecommerce.selectors';
import { CalendarHeaderComponent } from './calendar-header';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-calendar',
	standalone: true,
	imports: [CalendarHeaderComponent, MatDatepickerModule, MatNativeDateModule, ButtonComponent],
	templateUrl: './calendar.component.html',
	styleUrl: './calendar.component.scss'
})
export class CalendarComponent {
	public calendarHeader = CalendarHeaderComponent;
	public calendar: Signal<ICalendar> = this._store.selectSignal(selectEcommerceCalendar);
	public selected: Date | null = null;
	public minDate: Date = new Date();
	public maxDate: Date = new Date();
	public reservation: number[] = [];
	public day?: string;
	public inDay: string = '';
	public request: boolean = false;
	public disabled: string[] | undefined;

	private _unsubscribe: Subject<void> = new Subject<void>();
	private _date!: Date;

	public constructor(
		private _core: CoreService,
		private _store: Store<IAppState>,
		private _ecommerce: EcommerceService,
		private _cdr: ChangeDetectorRef
	) {
		this.minDate.setHours(0, 0, 0, 0);
		this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
	}

	public ngOnInit(): void {
		this._store
			.select(selectEcommerceDisabled)
			.pipe(
				takeUntil(this._unsubscribe),
				filter((disabled) => disabled !== undefined),
				first(),
				tap((disabled) => {
					if (disabled) {
						this.disabled = disabled;
						this._cdr.markForCheck();
					}
				})
			)
			.subscribe();
	}

	public filter = (date: Date | null): boolean => {
		if (date) {
			const day = date.getDay();
			const dateString = date.toISOString().split('T')[0];
			return date >= this.minDate && day !== 0 && !this.disabled?.includes(dateString);
		}
		return false;
	};

	public onDateChange(event: Date | null): void {
		if (this.request) return;
		if (event) {
			this._date = event;
			this.request = true;
			this.inDay = this._formatter(event);
			this.day = event.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().replace('.', ' ');
			const formattedDate = event.toISOString().split('T')[0];
			this.reservation = [];
			this._core.get<IReservation>('reservations', formattedDate).subscribe({
				next: (res: IReservation) => {
					this.reservation = res.reservation;
					this.request = false;
					this._cdr.markForCheck();
				},
				error: () => {
					this.request = false;
					this._cdr.markForCheck();
				},
				complete: () => (this.request = false)
			});
		}
	}

	public save(from: string, to: string, index: number): void {
		if (this.reservation.length > 0) {
			const res: number[] = this.reservation;
			if (res[index]) {
				res[index] = res[index] + 1;
			} else {
				res[index] = 1;
			}
			this._core.reservation = { id: this._date.toISOString().slice(0, 10), reservation: res };
			console.log('existe', res);
		} else {
			let res: number[] = [];
			for (let i = 0; i <= index; i++) {
				if (i === index) {
					res[i] = 1;
				} else {
					res[i] = 0;
				}
			}
			console.log('no existe', res);

			this._core.reservation = { id: this._date.toISOString().slice(0, 10), reservation: res };
		}

		if (this.reservation.length > 0) {
			const batchs: number[] = this.calendar().batch.map((batch) => batch.limit);
			if (this._check(batchs, this.reservation)) {
				if (this.disabled) {
					this.disabled = [...this.disabled, this._date.toISOString().slice(0, 10)];
					this._core.put('ecommerce', environment.slug, 'disabled', this.disabled);
				}
			}
		}

		const day = `${this._date.toISOString().slice(0, 10)} (${from} - ${to})`;
		this._core.calendar = day;
		this._ecommerce.redirect('order');
	}

	public back(): void {
		this._ecommerce.redirect('address');
	}

	public configure(hour: string, delay: number) {
		let now = new Date();
		let givenHour = new Date(this._date);
		givenHour.setHours(Number(hour.split(':')[0]));
		givenHour.setMinutes(Number(hour.split(':')[1]));
		let isToday = now.toDateString() === this._date.toDateString();
		if (!isToday) {
			return true;
		} else {
			let diffInMinutes = (givenHour.getTime() - now.getTime()) / 60000;
			return diffInMinutes > delay;
		}
	}

	public ngOnDestroy(): void {
		this._unsubscribe.next();
		this._unsubscribe.complete();
	}

	private _check(one: number[], two: number[]): boolean {
		if (one.length !== two.length) return false;
		for (let i = 0; i < one.length; i++) {
			if (one[i] !== two[i]) return false;
			console.log(one[i], two[i], one[i] !== two[i], i);
		}
		return true;
	}

	private _formatter(date: Date): string {
		return date.toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
}

export interface IReservation {
	reservation: number[];
}
