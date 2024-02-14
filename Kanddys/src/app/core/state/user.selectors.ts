import { createSelector } from '@ngrx/store';

// * State.
import { state } from '@core/state';

// * Interfaces.
import { IAppState } from '@core/interfaces/app.interface';

// * Selectors.
// * User.
export const selectUser = createSelector(state, (state: IAppState): IAppState['user'] => state.user);
