import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

// * Material.
import { MatIconModule } from '@angular/material/icon';

type types = 'XL' | 'XR' | 'ICON' | 'FAV' | 'LI' | 'MINI' | 'BLOCK';
/**
 * [XL]: legend; [XR]: icon; legend; [ICON]: icon; (block) [FAV]: icon; (circle) [LI]: legend; icon; [MINI]: status; [BLOCK]: legend;
 *
 * background: string;
 */
@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-button',
	standalone: true,
	imports: [MatIconModule],
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss'
})
export class ButtonComponent {
	@Input() legend: string = '';
	@Input() background?: string;
	@Input() type: types = 'XL';
	@Input() icon?: string;
	@Input() status: boolean = true;
	@Input() disabled: boolean = false;
	@Input() color?: string;
	@Input() light: boolean = false;
	@Input() active: boolean = false;
}
