import {configureStore} from "@reduxjs/toolkit";
import {spotifyApi} from "./api/spotifyApi";
import {spotifySlice} from "./slice/spotifySlice";
export const store = configureStore({
	reducer: {
		spotifyData: spotifySlice.reducer,
		[spotifyApi.reducerPath]: spotifyApi.reducer
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(spotifyApi.middleware)
});
