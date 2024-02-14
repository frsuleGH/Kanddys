import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// * Material.
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-calendar-header',
	standalone: true,
	imports: [MatButtonModule, MatIconModule],
	template: `
		<div style="display: flex; align-items: center; padding: 0.5em;">
			@if (shouldShowPreviousButton()) {
				<button mat-icon-button (click)="onClick('BEFORE')">
					<mat-icon>keyboard_arrow_left</mat-icon>
				</button>
			} @else {
				<div style="min-width: 48px"></div>
			}
			<span style="flex: 1; height: 1em; font-weight: 500; text-align: center;">{{ label }}</span>
			<button mat-icon-button (click)="onClick('AFTER')">
				<mat-icon>keyboard_arrow_right</mat-icon>
			</button>
		</div>
	`
})
export class CalendarHeaderComponent<D> implements OnDestroy {
	private _destroyed: Subject<void> = new Subject<void>();

	public constructor(
		@Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
		private _calendar: MatCalendar<D>,
		private _dateAdapter: DateAdapter<D>,
		private _cdr: ChangeDetectorRef
	) {
		_calendar.stateChanges.pipe(takeUntil(this._destroyed)).subscribe(() => {
			_cdr.markForCheck();
		});
	}

	public get label(): string {
		return this._dateAdapter
			.format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
			.toLocaleUpperCase();
	}

	public shouldShowPreviousButton(): boolean {
		const now = this._dateAdapter.today();
		const currentMonth = this._dateAdapter.getYear(now) * 12 + this._dateAdapter.getMonth(now);
		const activeMonth =
			this._dateAdapter.getYear(this._calendar.activeDate) * 12 + this._dateAdapter.getMonth(this._calendar.activeDate);
		return activeMonth > currentMonth;
	}

	public onClick(mode: 'AFTER' | 'BEFORE'): void {
		this._calendar.activeDate =
			mode === 'BEFORE'
				? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
				: this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1);
	}

	public ngOnDestroy(): void {
		this._destroyed.next();
		this._destroyed.complete();
	}
}
