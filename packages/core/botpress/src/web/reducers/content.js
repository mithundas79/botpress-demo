import { handleActions } from 'redux-actions'
import _ from 'lodash'

import {
  receiveContentCategories,
  receiveContentItems,
  receiveContentItemsRecent,
  receiveContentItem,
  receiveContentItemsCount,
  receiveContentSchema
} from '~/actions'

const defaultState = {
  categories: null,
  currentItems: [],
  recentItems: [],
  itemsById: {},
  itemsCount: 0
}

export default handleActions(
  {
    [receiveContentCategories]: (state, { payload }) => ({
      ...state,
      categories: payload
    }),

    [receiveContentItems]: (state, { payload }) => ({
      ...state,
      currentItems: payload
    }),

    [receiveContentItemsRecent]: (state, { payload }) => ({
      ...state,
      recentItems: payload
    }),

    [receiveContentItem]: (state, { payload }) => ({
      ...state,
      itemsById: {
        ...state.itemsById,
        [payload.id]: payload
      }
    }),

    [receiveContentItemsCount]: (state, { payload }) => ({
      ...state,
      itemsCount: payload.data.count
    })
  },
  defaultState
)
