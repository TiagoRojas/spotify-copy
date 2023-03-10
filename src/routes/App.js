import {useEffect, useState} from "react";
import CardsTracks from "../Components/Cards";
import Search from "../Components/search";
import Login from "../Components/Login";
import logo from "../assets/logo2.png";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import {useNavigate} from "react-router-dom";

function App() {
	const [accessToken, setAccessToken] = useState("");
	const code = new URLSearchParams(window.location.search).get("code");
	const [codeSaved, setCodeSaved] = useState("");
	const commonParams = {
		redirect_uri: process.env.REACT_APP_SPOTIFY_CALLBACK_HOST,
		client_id: process.env.REACT_APP_CLIENT_ID,
		client_secret: process.env.REACT_APP_CLIENT_SECRET
	};
	const navigate = useNavigate();
	const params = {
		code,
		grant_type: "authorization_code",
		...commonParams
	};

	const searchParams = Object.keys(params)
		.map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
		.join("&");

	useEffect(() => {
		if (accessToken === "" && code !== null) {
			fetch("https://accounts.spotify.com/api/token", {
				method: "POST",
				body: searchParams,
				headers: {"Content-type": "application/x-www-form-urlencoded"}
			})
				.then((res) => res.json())
				.then((data) => {
					setAccessToken(data.access_token);
				});
		}
		if (code !== null && codeSaved === "") {
			setCodeSaved(code);
		}
	}, [code]);
	useEffect(() => {
		if (codeSaved !== "") {
			navigate("/home");
			console.log(codeSaved);
		}
	}, [codeSaved]);
	if (codeSaved === "") {
		return <Login />;
	} else {
		return (
			<div className="bg-zinc-900 min-h-screen min-w-screen">
				<SideMenu />
				<div className="flex flex-row items-center justify-center p-5">
					<img src={logo} alt="Brand Logo" className="w-auto h-16" />
					<Search accessToken={accessToken} />
				</div>
				<div className="flex flex-col justify-center items-center ml-56 mr-8 pb-32">
					<div className="grid grid-cols-6 grid-rows-1 items-center justify-between w-full">
						<p className="text-white col-span-3 w-full px-3">#</p>
						<p className="text-white w-full">Titulo</p>
						<p className="text-white w-full text-center">Time</p>
						<p className="text-white w-full">Album</p>
					</div>
					<CardsTracks token={accessToken} />
				</div>
				<Player />
			</div>
		);
	}
}

export default App;
