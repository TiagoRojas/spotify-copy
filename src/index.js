import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import App from "./routes/App";
import LikedSongs from "./routes/LikedSongs";
import {store} from "./store/store";
import {Provider} from "react-redux";

import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./Components/Login";
const router = createBrowserRouter([
	{
		path: "/login",
		element: <Login />
	},
	{
		path: "/",
		element: <App />
	},
	{
		path: "/mylikes",
		element: <LikedSongs />
	}
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
);

reportWebVitals();
