import userIcon from "../assets/userIcon.png";
import githubLogo from "../assets/github-logo.png";
import linkedinLogo from "../assets/linkedin.png";
import portfolioLogo from "../assets/portfolio.png";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import {useSelector} from "react-redux";
import {handleScroll} from "../Components/complements";
import spotifyBanner from "../assets/banner.png";
import {useEffect, useState} from "react";

function OnlineMode() {
	const currentMode = useSelector((state) => state.spotifyData.mode);
	const userData = useSelector((state) => state.data.userData);
	const [welcomeMessage, setWelcomeMessage] = useState("");

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
					<div className="w-full lg:h-[350px] md:h-[300px] h-[150px] sm:pt-10">
						<img src={spotifyBanner} className="w-full h-full object-contain" />
					</div>
					<p className="text-white text-[48px] mx-5 font-bold pl-5 rounded-t-xl mt-4">{welcomeMessage}</p>
					<p className="text-white text-[20px] mx-5 pl-5 rounded-b-xl">Este es un proyecto realizado para mi portfolio personal, el cual utiliza:</p>
					<div className="pl-5 text-white list-disc flex flex-wrap my-4">
						<p className="mr-3 p-6 text-md sm:text-xl rounded-xl hover:bg-[#363636] bg-[#2a2a2a] my-2">React</p>
						<p className="mr-3 p-6 text-md sm:text-xl rounded-xl hover:bg-[#363636] bg-[#2a2a2a] my-2">Redux Toolkit</p>
						<p className="mr-3 p-6 text-md sm:text-xl rounded-xl hover:bg-[#363636] bg-[#2a2a2a] my-2">React Query</p>
						<p className="mr-3 p-6 text-md sm:text-xl rounded-xl hover:bg-[#363636] bg-[#2a2a2a] my-2">Sweetalert2</p>
						<p className="mr-3 p-6 text-md sm:text-xl rounded-xl hover:bg-[#363636] bg-[#2a2a2a] my-2">Tailwind CSS</p>
						<p className="mr-3 p-6 text-md sm:text-xl rounded-xl hover:bg-[#363636] bg-[#2a2a2a] my-2">Spotify API</p>
					</div>
					<div className="text-white flex flex-col lg:flex-row sm:items-center px-5 mb-32 w-full">
						<a
							href="https://github.com/TiagoRojas/spotify-copy"
							target="_blank"
							className="flex flex-row bg-[#2a2a2a] text-black font-bold w-full h-full overflow-hidden items-center rounded-lg mt-5 sm:mr-3 md:mt-0"
						>
							<img src={githubLogo} className="bg-white w-32 h-auto p-2" />
							<p className="text-white text-xl sm:text-[24px] ml-1">Link al repositorio</p>
						</a>
						{/* <a
							href=""
							target="_blank"
							className="flex flex-row bg-[#2a2a2a] text-black font-bold h-32 w-full md:w-96 overflow-hidden items-center rounded-xl mt-5 mr-3 md:mt-0"
						>
							<img src={portfolioLogo} className="bg-white w-32 h-auto p-2" />
							<p className="text-white text-[24px] ml-1">Link a mi Portfolio</p>
						</a> */}
						<a
							href="https://www.linkedin.com/in/rojastiago/"
							target="_blank"
							className="flex flex-row bg-[#2a2a2a] text-black font-bold w-full h-full overflow-hidden items-center rounded-lg mt-5 sm:mr-3 md:mt-0"
						>
							<img src={linkedinLogo} className="bg-white w-32 h-auto p-2" />
							<p className="text-white text-xl sm:text-[24px] ml-1">Link a LinkedIn</p>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OnlineMode;
