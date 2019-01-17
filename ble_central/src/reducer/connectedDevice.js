const initialState = {
  list: []
}

export const ADD_DEVICE = 'connectedDevice/addDevice'

export default function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case ADD_DEVICE: {
      let { list } = state
      list = [...list, payload]
      return { ...state, list }
    }
    default:
      return state
  }
}