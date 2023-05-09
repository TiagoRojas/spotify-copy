import Cards from "../Components/Cards";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import UnFindeSong from "../localSongs/Unfinde/song.mp3";
import UnFindeCover from "../localSongs/Unfinde/albumCover.jpg";
import RaraVezSong from "../localSongs/raraVez/song.mp3";
import RaraVezCover from "../localSongs/raraVez/albumCover.jpg";
import YaNoVuelvasSong from "../localSongs/yaNoVuelvas/song.mp3";
import YaNoVuelvasCover from "../localSongs/yaNoVuelvas/albumCover.jpg";
import spotifyBanner from "../assets/banner.png";
import githubLogo from "../assets/github-logo.png";
import linkedinLogo from "../assets/linkedin.png";
import {useEffect, useState} from "react";
function OfflineModeView() {
	const [welcomeMessage, setWelcomeMessage] = useState("");
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
	}, [hours]);
	const data = [
		{
			artists: [{name: "Ke Personajes"}, {name: "FMK"}, {name: "Big One"}],
			preview_url: UnFindeSong,
			duration_ms: 168000,
			cover: UnFindeCover,
			name: "Un Finde | CROSSOVER #2"
		},
		{
			artists: [{name: "Taiu"}, {name: "Milo j"}],
			preview_url: RaraVezSong,
			duration_ms: 129000,
			cover: RaraVezCover,
			name: "Rara Vez"
		},
		{
			artists: [{name: "Luck Ra"}, {name: "La K'onga"}, {name: "Ke Personajes"}],
			preview_url: YaNoVuelvasSong,
			duration_ms: 200000,
			cover: YaNoVuelvasCover,
			name: "Ya No Vuelvas (Versión Cuarteto)"
		}
	];
	return (
		<div className="min-w-screen min-h-screen text-white">
			<SideMenu />
			<div className="sm:ml-52">
				<div className="w-full lg:h-[350px] md:h-[300px] h-[150px] sm:pt-10">
					<img src={spotifyBanner} className="w-full h-full object-contain" alt="Spotify Banner" />
				</div>
				<p className="text-white text-[48px] font-bold mx-5 px-4 pt-4 bg-[#171717] rounded-t-xl mt-4">{welcomeMessage}</p>
				<p className="text-white text-[20px] mx-5 px-4 pb-4 bg-[#171717] rounded-b-xl">
					Este es un proyecto realizado para mi portfolio personal, el cual utiliza:
				</p>
				<div className="pl-5 text-white list-disc flex flex-wrap my-4 bg-[#171717]">
					<p className="mr-3 p-6 text-md sm:text-xl rounded-xl hover:bg-[#363636] bg-[#2a2a2a] my-2">React</p>
					<p className="mr-3 p-6 text-md sm:text-xl rounded-xl hover:bg-[#363636] bg-[#2a2a2a] my-2">Redux Toolkit</p>
					<p className="mr-3 p-6 text-md sm:text-xl rounded-xl hover:bg-[#363636] bg-[#2a2a2a] my-2">React Query</p>
					<p className="mr-3 p-6 text-md sm:text-xl rounded-xl hover:bg-[#363636] bg-[#2a2a2a] my-2">Sweetalert2</p>
					<p className="mr-3 p-6 text-md sm:text-xl rounded-xl hover:bg-[#363636] bg-[#2a2a2a] my-2">Tailwind CSS</p>
					<p className="mr-3 p-6 text-md sm:text-xl rounded-xl hover:bg-[#363636] bg-[#2a2a2a] my-2">Spotify API</p>
				</div>
				<div className="text-white flex flex-col lg:flex-row sm:items-center px-5 w-full">
					<a
						href="https://github.com/TiagoRojas/spotify-copy"
						target="_blank"
						rel="noreferrer"
						className="flex flex-row bg-[#2a2a2a] hover:bg-[#363636] text-black font-bold w-full h-full overflow-hidden items-center rounded-lg mt-5 sm:mr-3 md:mt-0"
					>
						<img src={githubLogo} className="bg-white w-32 h-auto p-2" alt="Github Logo" />
						<p className="text-white text-xl sm:text-[24px] ml-1">Link al repositorio</p>
					</a>
					<a
						href="https://www.linkedin.com/in/rojastiago/"
						target="_blank"
						rel="noreferrer"
						className="flex flex-row bg-[#2a2a2a] hover:bg-[#363636] text-black font-bold w-full h-full overflow-hidden items-center rounded-lg mt-5 sm:mr-3 md:mt-0"
					>
						<img src={linkedinLogo} className="bg-white w-32 h-auto p-2" alt="Linkedin Logo" />
						<p className="text-white text-xl sm:text-[24px] ml-1">Link a LinkedIn</p>
					</a>
				</div>
				<p className="text-xl p-4 sm:mx-12 mx-4 mt-4 rounded-xl bg-[#171717]">
					Estas en el modo Offline.. pero que eso no te desanime!
					<br />A diferencia del modo online, en donde unicamente puedes escuchar un fragmento de la cancion que quieras, aqui puedes escuchar la cancion completa de
					las siguientes musicas:
				</p>
			</div>
			<Cards data={data} type="dataProps" />
			<Player />
		</div>
	);
}

export default OfflineModeView;
