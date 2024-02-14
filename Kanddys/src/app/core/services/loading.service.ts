import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
	private loader: HTMLElement | null = document.getElementById('loader');
	private loading: string = 'loader-hidden';

	public hide(): void {
		setTimeout(() => {
			if (this.loader) if (!this.loader.classList.contains(this.loading)) this.loader.classList.add(this.loading);
		}, 500);
	}

	public show(): void {
		if (this.loader) if (this.loader.classList.contains(this.loading)) this.loader.classList.remove(this.loading);
	}
}
