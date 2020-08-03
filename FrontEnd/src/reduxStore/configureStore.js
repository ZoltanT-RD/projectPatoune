import { configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import reducer from './rootReducer';
import api from './middleware/api';

export default function () {
    return configureStore({
       reducer,
        middleware: [
            ...getDefaultMiddleware(),
            // logger({ destination: "console" }),
            api
        ]
    });
}


/*
****************************
///idea: desired Store structure
    {
        books: {...},
        auth: { userID: "sdfs", name: "sfsdfs", isAdmin: false},
        ui: {
            bookFilters:{},
            orderBy:{},
            searchTerm: ""
        }
    }
***************************
*/