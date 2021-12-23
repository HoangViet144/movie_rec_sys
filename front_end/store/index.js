import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import homeReducer, { name as homeSliceName } from './app.slice'
import apiSlice from './api.slice'

const rootReducer = combineReducers({
  [homeSliceName]: homeReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
})

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.ENV !== 'live',
  middleware: (getDefaultMiddleware) => {
    // return [...getDefaultMiddleware(), apiSlice.middleware, shareAPISlice.middleware]
    return [...getDefaultMiddleware(), apiSlice.middleware]
  },
})

setupListeners(store.dispatch)

export default store
