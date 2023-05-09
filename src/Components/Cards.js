import {useState} from "react";
import {millisToMinutesAndSeconds} from "./complements";
import heart from "../assets/heart.png";
import heartFilled from "../assets/heartFilled.png";
import playBtnGreen from "../assets/playBtnGreen.png";
import defaultArtist from "../assets/defaultArtist.png";
import timeIcon from "../assets/timeIcon.png";
import {useLazyAddTrackFavoriteQuery, useLazyCheckTrackExistQuery, useLazyRemoveTrackFavoriteQuery} from "../store/api/spotifyApi";
import {useDispatch, useSelector} from "react-redux";
import {changeOffset, changeShowingAlbum, updateShowingPlaylist} from "../store/slice/spotifySlice";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import useMusic from "../hooks/useMusic";
import playButton from "../assets/playButton.png";
import CheckComponent from "./checkComponent";

export default function Cards({data, type}) {
	const navigate = useNavigate();
	const code = useSelector((state) => state.data.code);
	const mode = useSelector((state) => state.spotifyData.mode);
	const [removeTrackFavorite, resultsRemove] = useLazyRemoveTrackFavoriteQuery();
	const [addTrackFavorite, resultsAdd] = useLazyAddTrackFavoriteQuery();
	const dispatch = useDispatch();
	const {start, stop} = useMusic();
	const tracksData = useSelector((state) => state.spotifyData.data.tracks);
	const playlistData = useSelector((state) => state.spotifyData.data.playlists);
	const albumData = useSelector((state) => state.spotifyData.data.albums);
	const artistData = useSelector((state) => state.spotifyData.data.artists);
	const likedSongsData = useSelector((state) => state.spotifyData.trackFavList);
	const newReleasesData = useSelector((state) => state.spotifyData.data.newReleases);
	const userPlaylist = useSelector((state) => state.spotifyData.data.userPlaylist.tracks);
	const currentMode = useSelector((state) => state.spotifyData.mode);

	const [currentHover, setCurrentHover] = useState("");
	const [currentPlaying, setCurrentPlaying] = useState("none");

	let idList = [];
	const addRemoveFav = ({id, i}) => {
		let heartElement = document.querySelector(".heart" + i);
		if (heartElement.src === heart) {
			addTrackFavorite({id, token: code});
		} else {
			removeTrackFavorite({id, token: code});
		}
		changeHeartSrc(i);
	};

	function changeHeartSrc(i) {
		let heartElement = document.querySelector(".heart" + i);
		if (heartElement.src === heart) {
			heartElement.src = heartFilled;
		} else heartElement.src = heart;
	}
	useEffect(() => {
		if (code === "") {
			navigate("/");
		}
	}, [code]);
	const handleSearchAlbum = ({id, name}) => {
		dispatch(changeShowingAlbum({id}));
		navigate(`/search/album/${name}`);
	};
	const handlePlay = ({musicName, autors, img, i, music}) => {
		if (currentPlaying !== "audio" + i) {
			setCurrentPlaying("audio" + i);
			start({i, item: {itemId: "audio" + i, musicName, img, autors}, music});
		} else {
			setCurrentPlaying("");
			stop(i);
		}
	};
	const handleStop = (i) => {
		stop(i);
	};
	const handleSearchPlaylist = ({id, name, img, owner}) => {
		dispatch(updateShowingPlaylist(id));
		navigate("/search/playlist/" + id);
	};

	// This is for detecting if one audio is playing at the moment so the others stops
	const audios = document.querySelectorAll("audio");
	function pauseOtherAudios({target}) {
		for (const audio of audios) {
			if (audio !== target) {
				audio.pause();
			}
		}
	}
	for (const audio of audios) {
		audio.addEventListener("play", pauseOtherAudios);
	}

	switch (type) {
		case "todo":
			return (
				<div className="sm:pl-52 flex flex-col sm:grid sm:grid-cols-5 select-text sm:mx-5 w-screen">
					<div className="text-white col-span-3 mx-5">
						<p className="sm:text-[48px] font-bold select-none">Albums</p>
						<div className="flex md:justify-evenly flex-wrap">
							{albumData.slice(0, 6).map((item, i) => {
								return (
									<div className="truncate hover:bg-zinc-800 p-2 group w-24 h-auto md:w-40 md:h-40 flex flex-col items-center">
										<img src={item.images[0].url} className="w-20 sm:w-28 sm:h-auto aspect-square" />
										<div className="absolute">
											<img
												src={playBtnGreen}
												className="rounded-full w-8 lg:w-12 lg:h-12 shadow-lg shadow-black my-3 relative opacity-0 top-14 lg:left-12 group-hover:opacity-100 group-hover:top-10 duration-300 cursor-pointer"
												onClick={() => handleSearchAlbum({id: item.id, name: item.name})}
											/>
										</div>
										<p className="truncate self-start sm:ml-4">{item.name}</p>
									</div>
								);
							})}
						</div>
					</div>
					<div className="text-white col-span-2 mx-5">
						<p className="sm:text-[48px] font-bold select-none">Canciones</p>
						{tracksData.slice(0, 4).map((item, i) => {
							idList = [...idList, item.id];
							return (
								<div className="truncate hover:bg-[#181818] p-2 flex items-center group">
									<audio src={item.preview_url} className={`audio` + i} />
									<img src={item.album.images[0].url} className="w-20 sm:w-12 h-auto rounded" />
									{i >= tracksData.slice(0, 4).length - 1 ? <CheckComponent ids={idList} /> : null}
									<div className="absolute flex items-center justify-center">
										<img
											src={playButton}
											className="select-none invert w-6 sm:w-6 h-auto my-3 relative left-7 sm:left-3 cursor-pointer opacity-0 top-5 group-hover:opacity-100 group-hover:top-0 duration-300"
											onClick={() => handlePlay({autors: item.artists, i, musicName: item.name, img: item.album.images[0].url, music: item.preview_url})}
										/>
									</div>
									<div className="w-[32rem] ml-2 truncate">
										<p className="truncate" title={item.name}>
											{item.name}
										</p>
										<p className="text-gray-500 truncate text-[12px] text-start select-none">
											{item.artists.map((artist, i) => (i >= 1 ? ", " + artist.name : artist.name))}
										</p>
									</div>
									<div className="w-full flex items-center justify-items-end justify-end">
										<img
											src={heart}
											alt="heart"
											className={"w-6 h-6 hidden group-hover:inline cursor-pointer heart" + i}
											onClick={() => addRemoveFav({id: item.id, i})}
										/>
										<p className="mx-5">{millisToMinutesAndSeconds(item.duration_ms)}</p>
									</div>
								</div>
							);
						})}
					</div>
					<div className="text-white col-span-5 pb-32 mx-5">
						<p className="sm:text-[48px] font-bold select-none">Artistas</p>
						<div className="flex flex-row flex-wrap items-center justify-between">
							{artistData.slice(0, 10).map((item, i) => {
								return (
									<div className="bg-[#181818] mt-2 rounded hover:bg-[#27272a] duration-300 sm:mt-1 p-1 w-28 sm:w-40 justify-center sm:h-48 grid grid-flow-row items-center mx-1">
										{item?.images[0]?.url ? (
											<img
												src={item.images[0].url}
												alt={"artistsPicture" + i}
												className="rounded-full w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 shadow-lg shadow-black my-3 mx-auto sm:mx-0"
											/>
										) : (
											<img
												src={defaultArtist}
												alt={"artistsPicture" + i}
												className="bg-[#282828] rounded-full w-24 h-24 sm:w-36 sm:h-36 shadow-lg shadow-black my-3 p-5 mx-auto"
											/>
										)}
										<p className="w-full truncate">{item.name}</p>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			);
		case "album":
			return (
				<div className="sm:pl-52 pb-32 flex flex-row min-w-screen flex-wrap justify-evenly">
					{albumData.map((item, i) => {
						return (
							<div
								key={"album" + i}
								className="flex flex-col items-center justify-center m-3 w-40 sm:w-52 p-3 sm:p-5 bg-zinc-800 hover:bg-zinc-700 duration-200 rounded-md"
								onClick={() => handleSearchAlbum({id: item.id, name: item.name})}
							>
								<img src={item.images[0].url} alt={"image of " + item.name} className="w-52 h-auto object-cover rounded-md" />
								<div className="self-start w-40 items-center h-10">
									<p className="text-white truncate font-bold">{item.name}</p>
									<div className="flex flex-row text-gray-400 text-sm text-center text-m flex items-center">
										{item.release_date.slice(0, 4)}
										<p className="font-bold text-xl text mx-1">&middot;</p>
										<p className="truncate" title={item.artists.map((item, index) => (index >= 1 ? " " + item.name : item.name))}>
											{item.artists.map((item, index) => (index >= 1 ? ", " + item.name : item.name))}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			);
		case "newReleases":
			return (
				<div className="pb-36 sm:pb-32 flex flex-row min-w-screen flex-wrap justify-center">
					{newReleasesData.map((item, i) => {
						return (
							<div
								key={"release" + i}
								className="flex flex-col items-center justify-center m-3 w-52 p-5 bg-zinc-800 hover:bg-zinc-700 duration-200 rounded-md"
								onClick={() => handleSearchAlbum({id: item.id, name: item.name})}
							>
								<img src={item.images[0].url} alt={"image of " + item.name} className="w-52 h-auto object-cover rounded-md" />
								<div className="self-start w-40 items-center h-10">
									<p className="text-white truncate font-bold" title={item.name}>
										{item.name}
									</p>
									<div className="flex flex-row text-gray-400 text-sm text-center text-m flex items-center">
										{item.release_date.slice(0, 4)}
										<p className="font-bold text-xl text mx-1">&middot;</p>
										<p className="text-start whitespace-nowrap truncate">{item.artists.map((item, index) => (index >= 1 ? ", " + item.name : item.name))}</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			);
		case "dataProps":
			return (
				<div className="sm:ml-52 mb-24 pb-4 sm:pb-0 sm:mb-32 lg:px-12 px-2 flex flex-row min-w-screen flex-wrap">
					<div className="grid grid-cols-[1.5rem,6fr,6fr] grid-flow-col w-full text-white py-1 border-b border-neutral-500 px-2 sm:px-5 mx-auto items-center">
						<p>#</p>
						<p>TITULO</p>
						<p className="col-span-2 pr-8 hidden sm:inline">ALBUM</p>
						<img src={timeIcon} className="w-8 h-8 invert mr-6 justify-self-end" />
					</div>
					{data.map((item, i) => {
						idList = [...idList, item.id];
						return (
							<div
								key={"dataProp" + i}
								className="grid grid-cols-[1.5rem,6fr,6fr] grid-flow-col items-center sm:p-3 px-2 rounded text-lg hover:bg-[#2a2a2a]/[.5] h-20 sm:h-auto cursor-default group w-full"
								onMouseEnter={() => setCurrentHover("item" + i)}
								onMouseLeave={() => setCurrentHover("")}
							>
								<div className="justify-self-center inline-block">
									<img
										src={playButton}
										className="h-5 w-5 invert mr-4 mb-1 hidden group-hover:inline"
										onClick={() => handlePlay({autors: item.artists, i, musicName: item.name, music: item.preview_url, img: item?.cover})}
									/>
									<p className="text-white text-sm mr-5 group-hover:hidden">{i + 1}</p>
								</div>
								<div className="flex items-center w-full col-span-2 sm:col-span-1">
									{i >= data.length - 1 && mode === "online" ? <CheckComponent ids={idList} /> : null}
									<audio src={item.preview_url} className={`audio` + i} />
									{item.cover ? <img src={item.cover} className="inline w-16 h-16 mr-2" /> : null}
									<p className="text-white justify-self-start">{item.name}</p>
								</div>
								<p className="text-white text-start w-32 hidden sm:inline">
									{item.artists.map((artist, artistsIndex) => (artistsIndex >= 1 ? ", " + artist.name : artist.name))}
								</p>
								{currentMode !== "offline" ? (
									<div className="justify-end flex flex-row w-10 justify-self-end ">
										<img
											src={heart}
											alt="heart"
											className={"w-8 h-auto cursor-pointer hidden group-hover:inline heart" + i}
											onClick={() => addRemoveFav({id: item.id, i})}
										/>
									</div>
								) : null}
								<div className="sm:px-8 justify-start mr-6 sm:mr-0">
									<p className="text-white w-full text-center">{millisToMinutesAndSeconds(item.duration_ms)}</p>
								</div>
							</div>
						);
					})}
				</div>
			);
		case "likedSongs":
			return (
				<div className="flex flex-row min-w-screen flex-wrap">
					<div className="grid grid-cols-[1.5rem,6fr,6fr] grid-flow-col w-full text-white py-1 border-b border-neutral-500">
						<p>#</p>
						<p>TITULO</p>
						<p className="col-span-2 pr-8 hidden md:block">ALBUM</p>
						<img src={timeIcon} className="w-8 h-8 invert mr-8 justify-self-end" />
					</div>
					{likedSongsData.map((item, i) => (
						<div
							key={"likedSong" + i}
							className="grid grid-cols-[1.5rem,6fr,6fr] grid-flow-col w-full my-3 md:my-2 items-center hover:bg-black/[0.4] p-3 md:p-2 rounded-lg"
							onMouseEnter={() => setCurrentHover("item" + i)}
							onMouseLeave={() => setCurrentHover("")}
						>
							<div className="flex items-center">
								{currentHover === "item" + i ? (
									<img
										src={playButton}
										className="h-5 w-auto invert mr-5"
										onClick={() =>
											handlePlay({autors: item.track.artists, i, musicName: item.track.name, img: item.track.album.images[0].url, music: item.track.preview_url})
										}
									/>
								) : (
									<p className="text-white text-sm text-center mr-5">{i + 1}</p>
								)}
							</div>
							<div className="flex flex-row items-center truncate">
								<audio src={item.track.preview_url} className={`audio` + i} />
								<img src={item.track.album.images[1].url} className="w-16 h-16 mr-2 inline" />
								<p className="text-white text-center truncate">{item.track.name}</p>
							</div>
							<p className="text-white text-start w-32 hidden md:block">{item.track.artists.map((artist, i) => (i >= 1 ? ", " + artist.name : artist.name))}</p>
							<div className="px-8 flex flex-row justify-self-end">
								<img src={heartFilled} alt="heart" className={"w-6 h-5 cursor-pointer mr-10 heart" + i} onClick={() => addRemoveFav({id: item.track.id, i})} />
								<p className="text-white w-full text-center">{millisToMinutesAndSeconds(item.track.duration_ms)}</p>
							</div>
						</div>
					))}
				</div>
			);
		case "playlistView":
			return (
				<>
					<div className="grid sm:grid-cols-[1.5rem,6fr,6fr] grid-flow-col w-full text-white py-1 border-b border-neutral-500 px-4 select-none">
						<p>#</p>
						<p>TITULO</p>
						<p className="col-span-2 pr-8 hidden md:inline">ARTISTS</p>
						<img src={timeIcon} className="w-8 h-8 invert mr-8 justify-self-end" />
					</div>
					{userPlaylist.map((item, i) => {
						idList = [...idList, item.track.id];
						return (
							<div
								key={"likedSong" + i}
								className="grid grid-cols-[1.5rem,6fr,6fr] grid-flow-col w-full mt-5 select-none px-2 sm:px-4 items-center group"
								onMouseEnter={() => setCurrentHover("item" + i)}
								onMouseLeave={() => setCurrentHover("")}
							>
								<div className="flex items-center">
									<img
										src={playButton}
										className="h-5 w-auto invert mr-5 hidden group-hover:inline"
										onClick={() =>
											handlePlay({autors: item.track.artists, i, musicName: item.track.name, music: item.track.preview_url, img: item.track.album.images[0].url})
										}
									/>

									<p className="text-white text-sm text-center mr-5 inline group-hover:hidden">{i + 1}</p>
								</div>
								<div className="flex flex-row items-center truncate">
									{i >= userPlaylist.length - 1 ? <CheckComponent ids={idList} /> : null}
									<audio src={item.track.preview_url} className={`audio` + i} />
									<img src={item.track.album.images[1].url} className="inline w-16 h-16 mr-2" />
									<p className="text-white text-center truncate">{item.track.name}</p>
								</div>
								<p
									className="text-white text-start w-full truncate sm:text-ellipsis hidden md:inline"
									title={item.track.artists.map((artist, i) => (i >= 1 ? " " + artist.name : artist.name))}
								>
									{item.track.artists.map((artist, i) => (i >= 1 ? ", " + artist.name : artist.name))}
								</p>
								<div className="px-8 flex flex-row justify-self-end">
									<img src={heart} alt="heart" className={"w-5 h-5 sm:w-8 sm:h-8 cursor-pointer mr-10 heart" + i} onClick={() => addRemoveFav({id: item.track.id, i})} />
									<p className="text-white w-full text-center">{millisToMinutesAndSeconds(item.track.duration_ms)}</p>
								</div>
							</div>
						);
					})}
				</>
			);
		case "tracks":
			return (
				<div className="sm:ml-52 mb-32 lg:px-12 px-2 flex flex-row min-w-screen flex-wrap">
					<div className="grid grid-cols-[1.5rem,6fr,6fr] grid-flow-col w-full text-white py-1 border-b border-neutral-500 px-2 sm:px-5 mx-auto">
						<p>#</p>
						<p>TITULO</p>
						<p className="col-span-2 pr-8 hidden sm:inline">ALBUM</p>
						<img src={timeIcon} className="w-8 h-8 invert mr-6 justify-self-end" />
					</div>
					{tracksData.map((item, i) => {
						idList = [...idList, item.id];
						return (
							<div key={"likedSong" + i} className="grid grid-cols-[1.5rem,7fr,6fr] grid-flow-col w-full my-5 group">
								<div className="flex justify-center items-center">
									<img
										src={playButton}
										className="h-5 w-auto invert hidden group-hover:inline"
										onClick={() => handlePlay({autors: item.artists, i, musicName: item.name, img: item.album.images[0].url, music: item.preview_url})}
									/>
									<p className="text-white text-sm text-center group-hover:hidden">{i + 1}</p>
								</div>
								{i >= tracksData.length - 1 ? <CheckComponent ids={idList} /> : null}
								<div className="flex flex-row items-center truncate px-1 col-span-3 sm:col-span-1">
									<audio src={item.preview_url} className={`audio` + i} onEnded={() => handleStop(i)} />
									<img src={item.album.images[1].url} className="w-16 h-16 mr-2 hidden sm:inline" />
									<p className="text-white text-center truncate mr-1">{item.name}</p>
								</div>
								<p className="text-white text-start w-32 hidden sm:inline">{item.artists.map((artist, i) => (i >= 1 ? ", " + artist.name : artist.name))}</p>
								<div className="px-8 flex flex-row justify-self-end">
									<img src={heart} alt="heart" className={"w-8 h-8 cursor-pointer mr-10 heart" + i} onClick={() => addRemoveFav({id: item.id, i})} />
									<p className="text-white w-full text-center">{millisToMinutesAndSeconds(item.duration_ms)}</p>
								</div>
							</div>
						);
					})}
				</div>
			);
		case "artists":
			return (
				<div className="sm:ml-52 mb-32 flex flex-row flex-wrap justify-evenly">
					{artistData.map((item, i) => (
						<div className="bg-[#181818] rounded pb-3 hover:bg-zinc-800 w-max sm:ml-4 flex flex-col items-center justify-center text-white mt-5 duration-300 group">
							{item?.images[0]?.url ? (
								<img src={item.images[0].url} alt={"artistsPicture" + i} className="rounded-full w-32 sm:w-36 sm:h-36 shadow-lg shadow-black my-3" />
							) : (
								<img src={defaultArtist} alt={"artistsPicture" + i} className="bg-[#282828] rounded-full sm:w-36 sm:h-36 shadow-lg shadow-black my-3 p-5" />
							)}
							<div className="absolute">
								<img
									src={playBtnGreen}
									className="rounded-full w-14 h-14 shadow-lg shadow-black my-3 relative top-16 left-12 cursor-pointer opacity-0 group-hover:opacity-100 group-hover:top-10 duration-300"
								/>
							</div>
							<div className="w-36 sm:w-48 mx-3">
								<p>{item.name}</p>
								<p className="font-bold">Artista</p>
							</div>
						</div>
					))}
				</div>
			);
		case "playlist":
			return (
				<div className="sm:ml-52 mb-32 flex flex-row flex-wrap justify-evenly">
					{playlistData.map((item, i) => {
						return (
							<div
								className="bg-[#181818] pb-3 hover:bg-zinc-800 ml-4 flex flex-col items-center justify-center text-white mt-5 duration-300 group"
								onClick={() => handleSearchPlaylist({id: item.id, name: item.name, img: item.images[0], owner: item.owner})}
							>
								{item?.images[0]?.url ? (
									<img src={item.images[0].url} alt={"artistsPicture" + i} className="rounded w-36 h-36 shadow-lg shadow-black my-3" />
								) : (
									<img src={defaultArtist} alt={"artistsPicture" + i} className="rounded bg-[#282828] w-36 h-36 shadow-lg shadow-black my-3" />
								)}
								<div className="absolute">
									<img
										src={playBtnGreen}
										className="rounded-full w-14 h-14 shadow-lg shadow-black my-3 relative top-16 left-16 cursor-pointer opacity-0 group-hover:opacity-100 group-hover:top-12 duration-300"
									/>
								</div>
								<div className="mx-3 w-36 sm:w-48">
									<p className="truncate">{item.name}</p>
									<p className="font-bold">Artista</p>
								</div>
							</div>
						);
					})}
				</div>
			);
	}
}
