import {combineReducers} from 'redux';

import testReducer from './slices/test';
import authReducer from './slices/auth';


export default combineReducers({
    //add all slice-reducers here!
    test: testReducer,
    auth: authReducer
});