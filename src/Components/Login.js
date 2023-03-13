const scopes = "user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state";
const AUTH_URL =
	"https://accounts.spotify.com/authorize?client_id=c5154a2e992646679ab9f91fb823cde1&response_type=code&scope=" +
	encodeURIComponent(scopes) +
	"&redirect_uri=http://localhost:3000/";

export default function Login() {
	return (
		<div className="flex justify-center items-center h-screen bg-zinc-900">
			<a href={AUTH_URL} className="bg-green-900 p-7 rounded-full text-white font-bold text-xl">
				Login with Spotify
			</a>
		</div>
	);
}
