import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';

// * Services.
import { EcommerceService } from './services/ecommerce.service';

// * Interfaces.
import { IAppState } from '@core/interfaces/app.interface';

// * Actions.
import { environment } from '../../../environments/environment';
import { loadEcommerce } from './state/ecommerce.actions';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce',
	standalone: true,
	imports: [RouterOutlet],
	template: '<router-outlet />',
	providers: [EcommerceService]
})
export class EcommerceComponent implements OnInit {
	private _store: Store<IAppState> = inject(Store<IAppState>);

	public ngOnInit(): void {
		this._store.dispatch(loadEcommerce({ slug: environment.slug }));
	}
}
