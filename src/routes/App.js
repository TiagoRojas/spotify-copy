import {useEffect, useState} from "react";
import Login from "../Components/Login";
import userIcon from "../assets/userIcon.png";
import githubLogo from "../assets/github-logo.png";
import linkedinLogo from "../assets/linkedin.png";
import portfolioLogo from "../assets/portfolio.png";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import {useDispatch, useSelector} from "react-redux";
import {changeCode, updatePlaylist, updateUserData} from "../store/slice/dataSlice";
import {useNavigate} from "react-router-dom";
import {changeMode} from "../store/slice/spotifySlice";
import OfflineModeView from "./offlineMode";
import {handleScroll} from "../Components/complements";
import spotifyBanner from "../assets/banner.png";

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
		if (hours >= 19 || hours < 7) {
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
							<div className="lg:w-[800px] xl:w-[1000px] w-screen h-[150px] md:h-[200px] mx-auto">
								<img src={spotifyBanner} className="w-full h-full object-cover" />
							</div>
							<p className="text-white text-[48px] font-bold pl-5">{welcomeMessage}</p>
							<p className="text-white text-[20px] pl-5">
								Este es un proyecto realizado para mi portfolio personal, el cual utiliza:
								<ul className="pl-5 text-white list-disc">
									<li>React</li>
									<li>Redux Toolkit</li>
									<li>React Query</li>
									<li>Sweetalert2</li>
									<li>Spotify API</li>
									<li>Tailwind CSS</li>
								</ul>
							</p>
							<div className="text-white flex flex-col lg:flex-row sm:items-center sm:ml-5 mx-5 mb-32 pt-12 pl-12">
								<a
									href=""
									target="_blank"
									className="flex flex-row bg-[#2a2a2a] text-black font-bold h-32 w-full md:w-96 overflow-hidden items-center rounded-xl mt-5 mr-3 md:mt-0"
								>
									<img src={githubLogo} className="bg-white w-32 h-auto p-2" />
									<p className="text-white text-[24px] ml-1">Link al repositorio</p>
								</a>
								<a
									href=""
									target="_blank"
									className="flex flex-row bg-[#2a2a2a] text-black font-bold h-32 w-full md:w-96 overflow-hidden items-center rounded-xl mt-5 mr-3 md:mt-0"
								>
									<img src={portfolioLogo} className="bg-white w-32 h-auto p-2" />
									<p className="text-white text-[24px] ml-1">Link a mi Portfolio</p>
								</a>
								<a
									href=""
									target="_blank"
									className="flex flex-row bg-[#2a2a2a] text-black font-bold h-32 w-full md:w-96 overflow-hidden items-center rounded-xl mt-5 mr-3 md:mt-0"
								>
									<img src={linkedinLogo} className="bg-white w-32 h-auto p-2" />
									<p className="text-white text-[24px] ml-1">Link a LinkedIn</p>
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
