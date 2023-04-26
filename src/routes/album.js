import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLazyGetAlbumQuery} from "../store/api/spotifyApi";
import {useEffect} from "react";
import {changeShowingAlbum} from "../store/slice/spotifySlice";
import CardsTracks from "../Components/Cards";
import {useNavigate} from "react-router-dom";
import SideMenu from "../Components/sideMenu";
import Player from "../Components/player";
import leftArrow from "../assets/leftArrow.png";
import {createRandomString, handleScroll} from "../Components/complements";
function Album() {
	const code = useSelector((state) => state.data.code);
	const albumId = useSelector((state) => state.spotifyData.showingAlbum.id);
	const [getAlbum, results] = useLazyGetAlbumQuery();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	useEffect(() => {
		if (results.data === undefined) {
			getAlbum({id: albumId, token: code});
		} else {
			dispatch(changeShowingAlbum({data: results.data, id: albumId}));
		}
	}, [results.data]);

	useEffect(() => {
		if (code === "") {
			navigate("/");
		}
	}, [code]);
	return (
		<div className="min-w-screen min-h-screen bg-zinc-900">
			<SideMenu />
			<div
				className="absolute w-full flex flex-row bg-gradient-to-b sm:pl-52 h-[700px]"
				style={{background: `linear-gradient(180deg, ${createRandomString(6)} 0%, rgba(0,0,0,0) 100%)`}}
			>
				<img src={leftArrow} alt="left arrow" className="ml-5 sm:ml-0 w-8 h-7 invert z-10 relative top-10 left-10" onClick={() => navigate(-1)} />
				<div className="flex flex-row relative top-16">
					<img src={results.data?.images[0].url} className="h-48 sm:h-72 sm:w-72 mr-5 mt-5 rounded" />
					<div className="flex flex-col pt-10">
						<p className="text-white select-none">{results.data?.album_type === "single" ? "SENCILLO" : "ALBUM"}</p>
						<p className="text-white text-[38px] sm:text-[48px] font-bold">{results.data?.name}</p>
						<p className="text-white select-none">
							{results.data?.release_date.slice(0, 4)}
							<> &#183; </> {results.data?.tracks.items.length}
							{results.data?.tracks.items.length > 1 ? " canciones" : " canción"}
						</p>
					</div>
				</div>
			</div>
			<div className="relative w-full h-full flex flex-col justify-center items-center mr-8 z-[1] sm:pt-8">
				<div className="mt-72 sm:mt-96 bg-black/[0.3] w-full px-4 pt-5">
					{results.data !== undefined ? <CardsTracks data={results.data.tracks.items} type="dataProps" /> : null}
				</div>
			</div>
			<Player />
		</div>
	);
}

export default Album;
