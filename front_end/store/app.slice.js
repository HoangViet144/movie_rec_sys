import { createSlice } from '@reduxjs/toolkit'

export const name = 'app'

const initialState = {
  isLogin: false,
  token: '',
}

const homeSlice = createSlice({
  name,
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLogin = action.payload
    },
    setToken: (state, action) => {
      state.token = action.payload
    },
    testAction: (state, action) => {
      state.new = action.payload
    },
  },
})

export const {
  actions: { setLogin, setToken, testAction },
} = homeSlice

export default homeSlice.reducer
