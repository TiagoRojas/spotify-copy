import {useEffect, useState} from "react";
import CardsTracks from "../Components/Cards";
import Search from "../Components/search";
import Login from "../Components/Login";
import logo from "../assets/logo2.png";
import userIcon from "../assets/userIcon.png";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import {useDispatch, useSelector} from "react-redux";
import {changeCode, updatePlaylist} from "../store/slice/dataSlice";
import {useLocation, useNavigate} from "react-router-dom";
import {changeMode} from "../store/slice/spotifySlice";
import OfflineModeView from "./offlineMode";

function App() {
	const dispatch = useDispatch();
	const location = useLocation();
	const [userData, setUserData] = useState({});
	const accessToken = useSelector((state) => state.data.code);
	const currentMode = useSelector((state) => state.spotifyData.mode);
	const isBlank = useSelector((state) => state.spotifyData.isBlank);
	const code = new URLSearchParams(window.location.search).get("code");
	const navigate = useNavigate();
	const commonParams = {
		redirect_uri: process.env.REACT_APP_SPOTIFY_CALLBACK_HOST,
		client_id: process.env.REACT_APP_CLIENT_ID,
		client_secret: process.env.REACT_APP_CLIENT_SECRET
	};
	const params = {
		code,
		grant_type: "authorization_code",
		...commonParams
	};
	const tracks = useSelector((state) => state.spotifyData.data.tracks);
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
					dispatch(changeCode(data.access_token));
					dispatch(changeMode("online"));
					navigate("/");
					fetch("https://api.spotify.com/v1/me", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${data.access_token}`
						}
					})
						.then((response) => response.json())
						.then((userData) => {
							setUserData(userData);
							console.log(userData);
						});
					fetch(`https://api.spotify.com/v1/me/playlists`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${data.access_token}`
						}
					})
						.then((responsePlaylist) => responsePlaylist.json())
						.then((playlist) => dispatch(updatePlaylist(playlist.items)));
				});
		}
	}, [code]);
	useEffect(() => {
		console.log(location.pathname);
		if (location.pathname === "/") {
			window.addEventListener("scroll", (e) => {
				let scrollPosition = window.scrollY;
				let searchElement = document.querySelector(".searchElement");
				if (scrollPosition > 77) {
					searchElement.classList.add("bg-zinc-900");
				} else searchElement.classList.remove("bg-zinc-900");
			});
		}
	}, [location]);

	if (currentMode === "") {
		return <Login />;
	}
	if (currentMode === "online") {
		return (
			<div className="min-h-screen min-w-screen">
				<div>
					<SideMenu />
					<div className="fixed flex flex-row items-center justify-center p-5 pl-52 searchElement z-10 duration-200 w-full">
						<img src={logo} alt="Brand Logo" className="w-auto h-16 ml-5" />
						<Search accessToken={accessToken} userType={userData.product} />
						<div className="text-white ml-auto mr-10 flex flex-row items-center justify-center">
							<img src={userIcon} className="h-6 w-auto invert mx-1" />
							{userData.display_name}
						</div>
					</div>
					{isBlank ? (
						<div></div>
					) : (
						<div className="flex flex-col justify-center items-center pt-32 ml-56 mr-8 pb-32">
							<div className="grid grid-cols-6 grid-rows-1 items-center justify-between w-full">
								<p className="text-white col-span-3 w-full px-3">#</p>
								<p className="text-white w-full">Titulo</p>
								<p className="text-white w-full text-center">Time</p>
								<p className="text-white w-full">Album</p>
							</div>
							<CardsTracks token={accessToken} data={tracks} type="search" />
						</div>
					)}
					<Player />
				</div>
			</div>
		);
	}
	if (currentMode === "offline") {
		return <OfflineModeView />;
	}
}

export default App;
