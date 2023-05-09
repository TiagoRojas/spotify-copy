import Cards from "../Components/Cards";
import Search from "../Components/search";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import logo from "../assets/logo2.png";
import userIcon from "../assets/userIcon.png";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {useEffect} from "react";
import {changeOffset} from "../store/slice/spotifySlice";
import NewReleases from "../Components/newReleases/NewReleases";
import {handleScroll} from "../Components/complements";
import {useNavigate} from "react-router-dom";
import {DotWave} from "@uiball/loaders";

function SearchView() {
	const navigate = useNavigate();
	const code = useSelector((state) => state.data.code);
	const userData = useSelector((state) => state.data.userData);
	const [dataType, setDataType] = useState("todo");
	const dispatch = useDispatch();
	const offset = useSelector((state) => state.spotifyData.offset);
	const searchValue = useSelector((state) => state.spotifyData.searchValue);
	const tracks = useSelector((state) => state.spotifyData.data.tracks);
	let timer;
	function onlyOne(checkbox) {
		var checkboxes = document.querySelectorAll(".option");
		checkboxes.forEach((item) => {
			item !== checkbox ? item.classList.remove("invert") : checkbox.classList.add("invert");
		});
	}
	const handleSelectDataType = ({e, type}) => {
		onlyOne(e.target);
		setDataType(type);
	};
	window.addEventListener("scroll", () => {
		clearTimeout(timer);
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
			timer = setTimeout(() => {
				dispatch(changeOffset(offset + 21));
			}, 1000);
		}
	});
	useEffect(() => {
		window.addEventListener("scroll", () => handleScroll({currentMode: "online"}));
	}, []);
	useEffect(() => {
		if (code === "") {
			navigate("/");
		}
	}, [code]);
	return (
		<div>
			<div>
				<SideMenu />
				<div className="sm:fixed flex flex-col sm:flex-row items-center justify-center pt-2 sm:pt-5 sm:pl-52 z-10 duration-200 w-full searchElement">
					<div className="text-white flex flex-row items-center justify-end w-full p-5 inline sm:hidden">
						<img src={userIcon} className="h-6 w-auto invert" />
						<p>{userData.display_name}</p>
					</div>
					<div className="flex flex-row w-full px-3">
						<img src={logo} alt="Brand Logo" className="w-auto h-16 ml-5 hidden sm:inline" />
						<Search accessToken={code} userType={userData.product} />
					</div>
					<div className="text-white flex flex-row items-center justify-center w-[200px] hidden sm:inline">
						<img src={userIcon} className="h-6 w-auto invert" />
						<p>{userData.display_name}</p>
					</div>
				</div>
				<Player />
			</div>
			{searchValue === "" ? (
				<NewReleases />
			) : (
				<div className="sm:pl-52 pt-5 sm:pt-36 lg:pt-28 text-white flex select-none overflow-x-scroll dataTypeElement pr-5 sm:px-0">
					<p className="p-3 bg-[#232323] hover:bg-[#2a2a2a] rounded-[20px] ml-3 sm:ml-10 invert option" onClick={(e) => handleSelectDataType({e, type: "todo"})}>
						Todo
					</p>
					<p className="p-3 bg-[#232323] hover:bg-[#2a2a2a] rounded-[20px] ml-3 option" onClick={(e) => handleSelectDataType({e, type: "playlist"})}>
						Playlist
					</p>
					<p className="p-3 bg-[#232323] hover:bg-[#2a2a2a] rounded-[20px] ml-3 option" onClick={(e) => handleSelectDataType({e, type: "artists"})}>
						Artistas
					</p>
					<p className="p-3 bg-[#232323] hover:bg-[#2a2a2a] rounded-[20px] ml-3 option" onClick={(e) => handleSelectDataType({e, type: "tracks"})}>
						Canciones
					</p>
					<p className="p-3 bg-[#232323] hover:bg-[#2a2a2a] rounded-[20px] ml-3 option" onClick={(e) => handleSelectDataType({e, type: "album"})}>
						Albumes
					</p>
				</div>
			)}
			{searchValue === "" ? null : <Cards type={dataType} />}
		</div>
	);
}

export default SearchView;
