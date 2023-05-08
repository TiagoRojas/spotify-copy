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
import portfolioLogo from "../assets/portfolio.png";
function OfflineModeView() {
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
		<div className="bg-zinc-900 min-w-screen min-h-screen text-white">
			<SideMenu />
			<div className="sm:pt-4 pt-20 w-full">
				<img src={spotifyBanner} className="lg:w-[700px] xl:w-[1000px] w-[400px] sm:pl-52 mx-auto" />
				<p className="text-white text-[20px] sm:ml-52 pl-5 pb-10">
					Hola! Este es un proyecto realizado para mi portfolio personal, el cual utiliza:
					<ul className="pl-5 text-white list-disc">
						<li>React</li>
						<li>Redux Toolkit</li>
						<li>React Query</li>
						<li>Sweetalert2</li>
						<li>Spotify API</li>
						<li>Tailwind CSS</li>
					</ul>
				</p>
				<div className="text-white flex flex-col lg:flex-row sm:items-center sm:ml-52 mx-5 pl-5">
					<a
						href=""
						target="_blank"
						className="flex flex-row bg-[#2a2a2a] text-black font-bold h-32 w-full md:w-96 overflow-hidden items-center rounded-xl mt-5 mr-3 lg:mt-0"
					>
						<img src={githubLogo} className="bg-white w-32 h-auto p-2" />
						<p className="text-white text-[24px] ml-1">Link al repositorio</p>
					</a>
					<a
						href=""
						target="_blank"
						className="flex flex-row bg-[#2a2a2a] text-black font-bold h-32 w-full md:w-96 overflow-hidden items-center rounded-xl mt-5 mr-3 lg:mt-0"
					>
						<img src={portfolioLogo} className="bg-white w-32 h-auto p-2" />
						<p className="text-white text-[24px] ml-1">Link a mi Portfolio</p>
					</a>
					<a
						href=""
						target="_blank"
						className="flex flex-row bg-[#2a2a2a] text-black font-bold h-32 w-full md:w-96 overflow-hidden items-center rounded-xl mt-5 mr-3 lg:mt-0"
					>
						<img src={linkedinLogo} className="bg-white w-32 h-auto p-2" />
						<p className="text-white text-[24px] ml-1">Link a LinkedIn</p>
					</a>
				</div>
				<p className="sm:ml-52 text-xl px-4 sm:px-12 pt-5">
					Estas en el modo Offline.. pero que eso no te desanime!
					<br />
					<br /> A diferencia del modo online, en donde unicamente puedes escuchar un fragmento de la cancion que quieras, aqui puedes escuchar la cancion completa
					de las siguientes musicas:
				</p>
				<Cards data={data} type="dataProps" />
			</div>
			<Player />
		</div>
	);
}

export default OfflineModeView;
