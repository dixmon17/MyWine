import { createStore, combineReducers } from "redux"
import { persistCombineReducers } from 'redux-persist'
import currentSearch from './reducers/currentSearch'
import update from './reducers/update'
import fixtures from './reducers/fixtures'
import oauth from './reducers/oauth'
import { createReducer } from "redux-orm"
import orm from './orm'
import AsyncStorage from '@react-native-community/async-storage'

const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
	blacklist: ["currentSearch"],
}

const rootReducer = {
    currentSearch: currentSearch,
    update: update,
    oauth: oauth,
    fixtures: fixtures,
    orm: createReducer(orm)
};

export default createStore(persistCombineReducers(rootPersistConfig, rootReducer));
