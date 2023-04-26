import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import App from "./routes/App";
import LikedSongs from "./routes/LikedSongs";
import Playlist from "./routes/playlist";
import SearchView from "./routes/searchView";
import {store} from "./store/store";
import {Provider} from "react-redux";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Album from "./routes/album";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />
	},

	{
		path: "/search",
		element: <SearchView />
	},
	{
		path: "/album/:albumName",
		element: <Album />
	},
	{
		path: "/mylikes",
		element: <LikedSongs />
	},
	{
		path: "/playlist/:playlistId",
		element: <Playlist />
	}
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
);

reportWebVitals();
