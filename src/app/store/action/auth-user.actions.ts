import { createAction, props } from '@ngrx/store';
import { User } from '../../model/User';

export const setAuthUser = createAction('[Auth user] Set auth user', props<User>());
