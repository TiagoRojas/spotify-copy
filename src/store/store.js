import {configureStore} from "@reduxjs/toolkit";
import {spotifyApi} from "./api/spotifyApi";
import {dataSlice} from "./slice/dataSlice";
import {spotifySlice} from "./slice/spotifySlice";
export const store = configureStore({
	reducer: {
		spotifyData: spotifySlice.reducer,
		data: dataSlice.reducer,
		[spotifyApi.reducerPath]: spotifyApi.reducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false
		}).concat(spotifyApi.middleware)
});
