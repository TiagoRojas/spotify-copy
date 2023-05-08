import {useDispatch} from "react-redux";
import {changeMode} from "../store/slice/spotifySlice";

const scopes =
	"user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state playlist-read-private";
const client_id = process.env.REACT_APP_CLIENT_ID;
const redirect_uri = process.env.REACT_APP_SPOTIFY_CALLBACK_HOST;
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&scope=${encodeURIComponent(
	scopes
)}&redirect_uri=${redirect_uri}`;

export default function Login() {
	const dispatch = useDispatch();
	const handleOfflineMode = () => {
		dispatch(changeMode("offline"));
	};
	return (
		<div className="flex flex-col justify-center items-center h-screen bg-zinc-900 select-none">
			<a href={AUTH_URL} className="bg-green-700 p-7 rounded-full text-white font-bold text-xl">
				Iniciar sesión con Spotify
			</a>
			<p className="text-white mt-5" onClick={() => handleOfflineMode()}>
				Modo sin conexión
			</p>
		</div>
	);
}
