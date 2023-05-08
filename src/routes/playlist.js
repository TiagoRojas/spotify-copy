import {useDispatch, useSelector} from "react-redux";
import Cards from "../Components/Cards";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import {createRandomString} from "../Components/complements";
import {useLazyGetPlaylistQuery} from "../store/api/spotifyApi";
import {useEffect} from "react";
import {changeData} from "../store/slice/spotifySlice";
import {DotWave} from "@uiball/loaders";

function Playlist() {
	const code = useSelector((state) => state.data.code);
	const dispatch = useDispatch();
	const [getPlaylist, results] = useLazyGetPlaylistQuery();
	const playlistLength = useSelector((state) => state.spotifyData.data.userPlaylist.tracks.length);
	const playlitsInfo = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo);
	const id = useSelector((state) => state.spotifyData.showingPlaylist.id);

	useEffect(() => {
		if (results.data === undefined) {
			getPlaylist({token: code, id});
		} else {
			dispatch(changeData({data: results.data, image: results.data.images[0]?.url, type: "playlist"}));
		}
	}, [results.data]);
	return (
		<div className="min-h-screen min-w-screen bg-zinc-900">
			<SideMenu />
			{playlistLength >= 1 ? (
				<>
					<div
						className="absolute sm:pl-52 w-full text-white font-bold h-[500px] pl-12 z-[1]"
						style={{background: `linear-gradient(180deg, ${createRandomString(6)} 0%, rgba(0,0,0,0) 100%)`}}
					>
						<div className="flex items-center h-[250px] sm:pl-5">
							{playlitsInfo.img !== undefined ? <img src={playlitsInfo.img} className="w-24 h-24 sm:w-48 sm:h-48 shadow-lg shadow-black" /> : null}
							<div className="items-center pl-2">
								<p className="sm:text-[18px]">PLAYLIST</p>
								<p className="text-[24px] sm:text-[38px] align-middle">{playlitsInfo.name}</p>
								<p className="sm:text-[18px]">
									{playlitsInfo.owner}
									<> &middot;</>
									<i className="sm:text-[18px] not-italic"> {playlitsInfo.followers} me gusta, </i>
									<i className="sm:text-[18px] not-italic">
										{playlistLength} {playlistLength <= 1 ? "cancion" : "canciones"}
									</i>
								</p>
							</div>
						</div>
					</div>
					<div className="sm:pl-52 pt-52 sm:pt-64 relative z-10">
						<div className=" pt-5 bg-black/[0.3]">
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
