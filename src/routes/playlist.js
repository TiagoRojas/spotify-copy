import {useDispatch, useSelector} from "react-redux";
import Cards from "../Components/Cards";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import {createRandomString} from "../Components/complements";
import {
	useLazyAddPlaylistFavoriteQuery,
	useLazyCheckUserFollowPlaylistQuery,
	useLazyFetchUserPlaylistQuery,
	useLazyGetPlaylistQuery,
	useLazyRemovePlaylistFavoriteQuery
} from "../store/api/spotifyApi";
import {useEffect} from "react";
import {changeData} from "../store/slice/spotifySlice";
import {DotWave} from "@uiball/loaders";
import {useNavigate} from "react-router-dom";
import leftArrow from "../assets/leftArrow.png";
import heartFilled from "../assets/heartFilled.png";
import heart from "../assets/heart.png";
import useMusic from "../hooks/useMusic";
import {updatePlaylist} from "../store/slice/dataSlice";
function Playlist() {
	const [fetchUserPlaylist, resultsPlaylist] = useLazyFetchUserPlaylistQuery();
	const code = useSelector((state) => state.data.code);
	const userData = useSelector((state) => state.data.userData);
	const dispatch = useDispatch();
	const [getPlaylist, results] = useLazyGetPlaylistQuery();
	const [checkUserFollowPlaylist, resultsFollows] = useLazyCheckUserFollowPlaylistQuery();
	const [addPlaylist, resultsAdded] = useLazyAddPlaylistFavoriteQuery();
	const [removePlaylist, resultsRemoved] = useLazyRemovePlaylistFavoriteQuery();
	const playlistLength = useSelector((state) => state.spotifyData.data.userPlaylist.tracks.length);
	const playlistInfo = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo);
	const id = useSelector((state) => state.spotifyData.showingPlaylist.id);
	const navigate = useNavigate();
	const {reset} = useMusic();

	useEffect(() => {
		if (results.data === undefined) {
			getPlaylist({token: code, id});
			checkUserFollowPlaylist({token: code, id, userId: userData.id});
		} else {
			dispatch(changeData({data: results.data, image: results.data.images[0]?.url, type: "playlist"}));
		}
	}, [results.data]);

	useEffect(() => {
		if (code === "") {
			navigate("/");
		}
	}, [code]);

	useEffect(() => {
		fetchUserPlaylist({token: code});
	}, [resultsAdded, resultsRemoved, code, fetchUserPlaylist]);

	const handleReturn = () => {
		reset();
		navigate(-1);
	};

	useEffect(() => {
		if (resultsPlaylist.data) dispatch(updatePlaylist(resultsPlaylist.data.items));
	}, [resultsPlaylist, dispatch]);

	const handleFollowOrRemove = () => {
		let heartElement = document.querySelector(".heartPlaylist");
		if (heartElement.src === heartFilled) {
			removePlaylist({token: code, id});
			heartElement.src = heart;
		} else {
			addPlaylist({token: code, id});
			heartElement.src = heartFilled;
		}
	};

	return (
		<div className="min-h-screen min-w-screen bg-zinc-900">
			<SideMenu />
			{playlistLength >= 1 ? (
				<>
					<div
						className="sm:pl-52 w-full text-white font-bold h-[500px] pl-5 z-[1]"
						style={{background: `linear-gradient(180deg, ${createRandomString(6)} 0%, rgba(0,0,0,0) 100%)`}}
					>
						<img src={leftArrow} alt="left arrow" className="sm:ml-0 w-8 h-7 invert z-10 relative top-14 sm:top-5 left-10" onClick={() => handleReturn()} />
						<div className="flex items-center h-[250px] sm:pl-5">
							{playlistInfo.img !== undefined ? <img src={playlistInfo.img} className="w-24 h-24 sm:w-48 sm:h-48 shadow-lg shadow-black" /> : null}
							<div className="items-center pl-2">
								<p className="sm:text-[18px]">PLAYLIST</p>
								<div className="flex-auto w-max flex-wrap items-center">
									<p className="text-[24px] sm:text-[38px] align-middle truncate" title={playlistInfo.name}>
										{playlistInfo.name}
									</p>
									{resultsFollows.data === undefined ? null : (
										<img
											src={resultsFollows.data[0] ? heartFilled : heart}
											alt="heart"
											className={"w-8 h-7 cursor-pointer heartPlaylist"}
											onClick={() => handleFollowOrRemove()}
										/>
									)}
								</div>
								<p className="sm:text-[18px]">
									{playlistInfo.owner}
									<> &middot;</>
									<i className="sm:text-[18px] not-italic"> {playlistInfo.followers} me gusta, </i>
									<i className="sm:text-[18px] not-italic">
										{playlistLength} {playlistLength <= 1 ? "cancion" : "canciones"}
									</i>
								</p>
							</div>
						</div>
					</div>
					<div className="relative bottom-52 sm:pl-52 z-10">
						<div className="bg-black/[0.3]">
							<Cards type="playlistView" />
						</div>
					</div>
				</>
			) : (
				<div className="w-full h-screen flex justify-center items-center">
					<DotWave size={47} speed={1} color="white" />
				</div>
			)}
			<Player />
		</div>
	);
}

export default Playlist;
