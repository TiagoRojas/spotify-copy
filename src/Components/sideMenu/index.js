import Logo from "../../assets/logo.png";
import logoSimple from "../../assets/logo2.png";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {addData} from "../../store/slice/spotifySlice";

function SideMenu() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const playlist = useSelector((state) => state.data.userPlaylist);
	const accessToken = useSelector((state) => state.data.code);
	const navigateLikedSongs = () => {
		navigate("/mylikes");
	};
	const handleOpenSpotifyWeb = () => {
		window.open("https://www.spotify.com/download");
	};
	const handlePlaylistRequest = (id, name) => {
		console.log(id);
		navigate(`/playlist/${name}`);
		fetch(`https://api.spotify.com/v1/playlists/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				dispatch(addData({data: data, type: "playlist"}));
			});
	};
	return (
		<div className="flex flex-col fixed left-0 h-screen w-52 bg-black text-white z-20 select-none">
			<img src={Logo} className="h-auto w-48 mx-auto mt-3" alt="Spotify Logo" />
			<div className="mx-2">
				<div className="px-2 py-3 mt-2 rounded-xl hover:bg-zinc-900" onClick={() => navigate("/")}>
					Home
				</div>
				<div className="px-2 py-3 mt-2 rounded-xl hover:bg-zinc-900" onClick={() => navigateLikedSongs()}>
					Liked Songs
				</div>
				<div className="px-2 py-3 mt-2 rounded-xl">
					{playlist !== []
						? playlist.map((item, i) => (
								<p className="truncate" key={i} onClick={() => handlePlaylistRequest(item.id, item.name)}>
									{item.name}
								</p>
						  ))
						: null}
				</div>
			</div>
			<div className="flex items-end h-full mb-32">
				<div className="hover:bg-zinc-900 flex items-center justify-center m-2 p-2 rounded-xl" onClick={() => handleOpenSpotifyWeb()}>
					<img src={logoSimple} className="h-10 w-auto mr-2" />
					<p>Descargar Spotify</p>
				</div>
			</div>
		</div>
	);
}
// className="justify-self-end flex items-center mb-32"
export default SideMenu;
