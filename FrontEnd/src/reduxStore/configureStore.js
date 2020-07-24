import {configureStore} from '@reduxjs/toolkit';
import reducer from './rootReducer';

export default function () {
    return configureStore({
       reducer
    });
}

/*
desired Store structure;
    {
        books: {...},
        auth: { userID: "sdfs", name: "sfsdfs", isAdmin: false},
        ui: {
            bookFilters:{},
            orderBy:{},
            searchTerm: ""
        }
    }

*/