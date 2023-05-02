import {useEffect, useState} from "react";
import CardsTracks from "../Components/Cards";
import Search from "../Components/search";
import Login from "../Components/Login";
import banner1 from "../assets/banner2.png";
import userIcon from "../assets/userIcon.png";
import githubLogo from "../assets/github-logo.png";
import linkedinLogo from "../assets/linkedin.png";
import portfolioLogo from "../assets/portfolio.png";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import {useDispatch, useSelector} from "react-redux";
import {changeCode, updatePlaylist, updateUserData} from "../store/slice/dataSlice";
import {useLocation, useNavigate} from "react-router-dom";
import {changeMode} from "../store/slice/spotifySlice";
import OfflineModeView from "./offlineMode";
import {handleScroll} from "../Components/complements";

function App() {
	const dispatch = useDispatch();
	const accessToken = useSelector((state) => state.data.code);
	const currentMode = useSelector((state) => state.spotifyData.mode);
	const code = new URLSearchParams(window.location.search).get("code");
	const userData = useSelector((state) => state.data.userData);
	const navigate = useNavigate();
	const [welcomeMessage, setWelcomeMessage] = useState("");

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
							dispatch(updateUserData(userData));
							document.title = userData.display_name + " - Spotify";
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

	window.addEventListener("scroll", () => handleScroll(currentMode));

	const hours = new Date().getHours();
	useEffect(() => {
		if (hours >= 7) {
			setWelcomeMessage("Buenos dias!");
		}
		if (hours >= 12) {
			setWelcomeMessage("Buenas tardes!");
		}
		if (hours >= 19) {
			setWelcomeMessage("Buenas noches!");
		}
	}, []);
	switch (currentMode) {
		case "":
			return <Login />;
		case "online":
			return (
				<div className="min-h-screen min-w-screen">
					<SideMenu />
					<div className="sm:fixed flex flex-row items-center justify-center p-5 pl-52 z-10 duration-200 w-full searchElement">
						<div className="text-white ml-auto mr-10 flex flex-row items-center justify-center">
							<img src={userIcon} className="h-6 w-auto invert mx-1" />
							{userData.display_name}
						</div>
					</div>
					<Player />
					<div className="sm:pl-52 w-full">
						<div className="sm:ml:52 sm:pt-5">
							<p className="text-white text-[48px] font-bold pl-5">{welcomeMessage}</p>
							<p className="text-white text-[20px] pl-5">
								Este es un proyecto realizado con React y RTK Query para mi portfolio personal el cual pueden encontrar abajo
							</p>
							<div className="text-white flex flex-col lg:flex-row justify-evenly sm:items-center sm:ml-5 mx-5 mb-32">
								<a
									href=""
									target="_blank"
									className="bg-white text-black text-[30px] font-bold p-3 h-[400px] w-full md:w-[300px] overflow-hidden flex flex-col items-center rounded-xl mt-5 md:mt-0"
								>
									Link al repositorio
									<img src={githubLogo} className="relative left-16 top-16 w-64 h-auto rotate-[25deg] mt-auto" />
								</a>
								<a
									href=""
									target="_blank"
									className="bg-white text-black text-[30px] font-bold p-3 h-[400px] w-full md:w-[300px] overflow-hidden flex flex-col items-center rounded-xl mt-5 md:mt-0"
								>
									<p className="relative z-10">Link a mi Portfolio</p>
									<img src={portfolioLogo} className="relative left-16 bottom-20 w-64 h-auto rotate-[10deg] mt-auto" />
								</a>
								<a
									href=""
									target="_blank"
									className="bg-white text-black text-[30px] font-bold p-3 h-[400px] w-full md:w-[300px] overflow-hidden flex flex-col items-center rounded-xl mt-5 md:mt-0"
								>
									Link a LinkedIn
									<img src={linkedinLogo} className="relative right-10 top-5 w-44 h-auto rotate-[-40deg] mt-auto" />
								</a>
							</div>
						</div>
					</div>
				</div>
			);
		case "offline":
			return <OfflineModeView />;
	}
}

export default App;
