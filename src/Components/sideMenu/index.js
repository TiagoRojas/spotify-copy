import Logo from "../../assets/logo.png";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

function SideMenu() {
	const navigate = useNavigate();
	const navigateLikedSongs = () => {
		navigate("/mylikes");
	};
	return (
		<div className="fixed left-0 h-screen bg-black text-white">
			<img src={Logo} className="h-12 w-auto m-3" alt="Spotify Logo" />
			<div>
				<div className="px-5 py-3 m-5 rounded-xl hover:bg-zinc-900" onClick={() => navigate("/")}>
					Home
				</div>
				<div className="px-5 py-3 m-5 rounded-xl hover:bg-zinc-900" onClick={() => navigateLikedSongs()}>
					Liked Songs
				</div>
				<div className="px-5 py-3 m-5 rounded-xl hover:bg-zinc-900">Playlist</div>
			</div>
		</div>
	);
}

export default SideMenu;
