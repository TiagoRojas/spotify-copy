import "./style.css";
import Logo from "../../assets/logo.png";
import downloadCircle from "../../assets/downloadCircle.png";
import homeIcon from "../../assets/home.png";
import searchIcon from "../../assets/searchIcon.png";
import hamburgerIcon from "../../assets/hamburgerIcon.png";
import heart from "../../assets/myLikesHeart.png";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {changeData, updateTrackFavList, changeColor} from "../../store/slice/spotifySlice";
import {useLazyGetFavoriteTracksQuery} from "../../store/api/spotifyApi";
import useMusic from "../../hooks/useMusic";
import {generateRandomGradient} from "../complements";

function SideMenu() {
	const dispatch = useDispatch();
	const {reset, pause} = useMusic();
	const playlist = useSelector((state) => state.data.userPlaylist);
	const accessToken = useSelector((state) => state.data.code);
	const userData = useSelector((state) => state.data.userData);
	const currentMode = useSelector((state) => state.spotifyData.mode);

	const [getFavoriteTracks] = useLazyGetFavoriteTracksQuery();
	const handleOpenSpotifyWeb = () => {
		window.open("https://www.spotify.com/download");
	};

	const handleReset = () => {
		document.title = userData.display_name + " - Spotify";
		pause();
		reset();
	};
	const handleMoveToLikedSongs = () => {
		document.title = userData.display_name + " - Spotify";
		dispatch(updateTrackFavList({type: "reset"}));
		getFavoriteTracks({token: accessToken, offset: 0});
		reset();
	};
	const handlePlaylistRequest = ({id, image, name}) => {
		document.title = userData.display_name + " - Spotify";
		const color = generateRandomGradient();
		dispatch(changeColor(color));
		dispatch(changeData({type: "reset"}));
		fetch(`https://api.spotify.com/v1/playlists/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				reset();
				dispatch(changeData({data: data, type: "playlist", loaded: true, name, image, id}));
			});
	};
	const showMenu = () => {
		let menu = document.querySelector(".menu");
		let hamburger = document.querySelector(".hamburger");
		menu.classList.toggle("left-[-14rem]");
		hamburger.classList.toggle("ml-60");
	};
	return (
		<>
			<div className="sm:hidden fixed bg-zinc-800 w-12 h-12 ml-4 mt-4 flex items-center justify-center inline-block rounded-2xl hamburger z-50 duration-300">
				<img src={hamburgerIcon} className="h-auto w-10 z-10 invert" onClick={() => showMenu()} alt="menu" />
			</div>
			<div className="left-[-14rem] sm:left-[0px] fixed flex flex-col left-0 h-screen pb-10 sm:pb-0 w-56 sm:w-52 bg-black z-20 select-none text-white menu duration-300 overflow-y-scroll">
				<img src={Logo} className="h-auto w-48 mx-auto mt-3" alt="Spotify Logo" />
				<div className="mx-2">
					<div className="border-b pb-2">
						{currentMode === "online" ? (
							<>
								<NavLink to={"/"} className={({isActive, isPending}) => (isPending ? "" : isActive ? "brightness-150" : "")} onClick={() => handleReset()}>
									<div className="flex flex-row items-center px-2 py-3 mt-2 rounded-xl duration-200 brightness-50 hover:brightness-150">
										<img src={homeIcon} className="w-5 h-5 mr-1 invert" alt="home" />
										Inicio
									</div>
								</NavLink>
								<NavLink to={"/search"} className={({isActive, isPending}) => (isPending ? "" : isActive ? "brightness-200" : "")}>
									<div className="flex flex-row items-center px-2 py-3 mt-2 rounded-xl duration-200 brightness-50 hover:brightness-150">
										<img src={searchIcon} className="w-5 h-5 mr-1 invert" alt="search" />
										Buscar
									</div>
								</NavLink>
								<NavLink
									to={"/mylikes"}
									className={({isActive, isPending}) => (isPending ? "" : isActive ? "brightness-200" : "")}
									onClick={() => handleMoveToLikedSongs()}
								>
									<div className="flex flex-row items-center px-2 py-3 mt-2 rounded-xl">
										<div className="flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-400 to-gray-100 w-6 h-6 rounded mr-1">
											<img src={heart} className="w-3 h-3" alt="heart" />
										</div>
										<p className="duration-200 brightness-50 hover:brightness-150">Tus me gusta</p>
									</div>
								</NavLink>
							</>
						) : (
							<p className="mt-6 select-none">Estas en el modo Offline!</p>
						)}
					</div>
					<div className="px-2 py-3 rounded-xl h-full max-h-screen">
						{playlist !== []
							? playlist.map((item, i) => (
									<NavLink
										className={({isActive, isPending}) => (isPending ? "" : isActive ? "brightness-200" : "")}
										to={`/playlist/${item.id}`}
										key={i}
										onClick={() => handlePlaylistRequest({id: item.id, name: item.name, image: item.images[0], privacity: item.public, playlist})}
									>
										<p className="truncate brightness-50 hover:brightness-150 duration-200 mt-2">{item.name}</p>
									</NavLink>
							  ))
							: null}
					</div>
				</div>
				<div className="flex items-end h-full mb-32">
					<div
						className="flex items-center justify-center m-2 p-2 rounded-xl brightness-75 hover:brightness-150 duration-200"
						onClick={() => handleOpenSpotifyWeb()}
					>
						<img src={downloadCircle} className="h-6 w-6 mr-2 invert" alt="spotify logo" />
						<p className="">Instalar app</p>
					</div>
				</div>
			</div>
		</>
	);
}
export default SideMenu;
