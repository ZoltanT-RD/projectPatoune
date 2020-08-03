import { createSlice } from '@reduxjs/toolkit';

import BookStatus from '../../../../enums/BookRequestStatus';

const slice = createSlice({
    name: "ui",
    initialState: { //for fast lookups and by default; use object / if item order matters; use array; if need both, use object with "byId" data structure, and "order" top level array, to store order
        bookFilters: [BookStatus.requested, BookStatus.ordered, BookStatus.available],
        orderBy: [],
        searchTerm: null,
        currentPage: 1
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
                currentState.currentPage = 1;
            }
        },
        bookFilterRemoved: (currentState, action) => {
            //logic here
            if (currentState.bookFilters.includes(action.payload.bookStatus)) {
                currentState.bookFilters = currentState.bookFilters.filter(x => x !== action.payload.bookStatus );
                currentState.currentPage = 1;
            }
        },
        changeCurrentPageNumber: (currentState, action) => {
            //logic here
            if (currentState.currentPage !== action.payload.newPageNumber) {
                currentState.currentPage = action.payload.newPageNumber;
            }
        }
    }
});

export const { bookFilterAdded, bookFilterRemoved, changeCurrentPageNumber } = slice.actions;
export default slice.reducer;