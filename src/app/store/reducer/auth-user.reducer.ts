import { createReducer, on } from '@ngrx/store';
import { User } from 'src/app/model/User';
import { setAuthUser } from '../action/auth-user.actions';

export const initialState: User = null;

export const authUserReducer = createReducer(
    initialState,
    on(setAuthUser, setAuthUserFn)
  );
  
function setAuthUserFn(state: User, action: User) { 
    return action;
}