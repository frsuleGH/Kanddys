import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// * View.
import { EcommerceComponent } from '@ecommerce/ecommerce.component';

@Injectable({ providedIn: EcommerceComponent })
export class EcommerceService {
	private _router: Router = inject(Router);
	private _route: ActivatedRoute = inject(ActivatedRoute);

	public redirect(url: string, id?: string): void {
		if (id) {
			void this._router.navigate([`${url}/${id}`], { relativeTo: this._route });
			return;
		} else {
			void this._router.navigate([url], { relativeTo: this._route });
			return;
		}
	}
}
