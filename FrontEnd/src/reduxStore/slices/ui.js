import { createSlice } from '@reduxjs/toolkit';

import BookStatus from '../../../../enums/BookRequestStatus';

const slice = createSlice({
    name: "ui",
    initialState: { //for fast lookups and by default; use object / if item order matters; use array; if need both, use object with "byId" data structure, and "order" top level array, to store order
        bookFilters: [BookStatus.requested, BookStatus.ordered, BookStatus.available],
        orderBy: [],
        searchTerm: null
    },
    reducers: {
        // action => action-handler
        // eventough these are Reducers, obj. mutation is OK, because of reduxjs/toolkit encapsulation

        bookFilterAdded: (currentState, action) => {
            //logic here
            if (!currentState.bookFilters.includes(action.payload.bookStatus)) {
                currentState.bookFilters.push(
                    action.payload.bookStatus
                );
            }
        },
        bookFilterRemoved: (currentState, action) => {
            //logic here
            if (currentState.bookFilters.includes(action.payload.bookStatus)) {
                currentState.bookFilters = currentState.bookFilters.filter(x => x !== action.payload.bookStatus );
            }
        }
    }
});

export const { bookFilterAdded, bookFilterRemoved } = slice.actions;
export default slice.reducer;