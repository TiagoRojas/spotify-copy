import React, {useState} from "react";
import {millisToMinutesAndSeconds} from "./complements";
import PlayPreview from "./playPreview";
import heart from "../assets/heart.png";
import heartFilled from "../assets/heartFilled.png";
import playBtnGreen from "../assets/playBtnGreen.png";
import defaultArtist from "../assets/defaultArtist.png";

import {useLazyAddTrackFavoriteQuery, useLazyGetAlbumQuery, useLazyRemoveTrackFavoriteQuery} from "../store/api/spotifyApi";
import {useDispatch, useSelector} from "react-redux";
import {changeOffset, changeShowingAlbum} from "../store/slice/spotifySlice";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import useMusic from "../hooks/useMusic";
import playButton from "../assets/playButton.png";
export default function CardsTracks({data, type}) {
	const navigate = useNavigate();
	const code = useSelector((state) => state.data.code);
	const [removeTrackFavorite, resultsRemove] = useLazyRemoveTrackFavoriteQuery();
	const [addTrackFavorite, resultsAdd] = useLazyAddTrackFavoriteQuery();
	const dispatch = useDispatch();
	const {start, pause, resume, stop} = useMusic();
	const tracksData = useSelector((state) => state.spotifyData.data.tracks);
	const albumData = useSelector((state) => state.spotifyData.data.albums);
	const artistData = useSelector((state) => state.spotifyData.data.artists);
	const likedSongsData = useSelector((state) => state.spotifyData.trackFavList);
	const newReleasesData = useSelector((state) => state.spotifyData.data.newReleases);
	const showingPlaylist = useSelector((state) => state.spotifyData.showingPlaylist);
	const [currentHover, setCurrentHover] = useState("");
	const [currentPlaying, setCurrentPlaying] = useState("none");
	const [artistHover, setArtistHover] = useState("");
	const [imageId, setImageId] = useState(0);
	let checkIdList = [];
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

	const offset = useSelector((state) => state.spotifyData.offset);
	const offsetSubtract = () => {
		if (offset >= 10) {
			dispatch(changeOffset(-10));
		} else return;
	};
	const offsetAdd = () => {
		dispatch(changeOffset(10));
	};
	useEffect(() => {
		if (code === "") {
			navigate("/");
		}
	}, [code]);
	const handleSearchPlaylist = ({id, name}) => {
		dispatch(changeShowingAlbum({id}));
		navigate(`/album/${name}`);
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
			return <div>todo</div>;
		case "album":
			return (
				<div className="pl-52 pb-32 flex flex-row min-w-screen flex-wrap">
					{albumData.map((item, i) => {
						return (
							<div
								key={"album" + i}
								className="flex flex-col items-center justify-center m-3 w-52 p-5 bg-zinc-800 hover:bg-zinc-700 duration-200 rounded-md"
								onClick={() => handleSearchPlaylist({id: item.id, name: item.name})}
							>
								<img src={item.images[0].url} alt={"image of " + item.name} className="w-52 h-auto object-cover rounded-md" />
								<div className="self-start w-40 items-center h-10">
									<p className="text-white truncate font-bold">{item.name}</p>
									<div className="flex flex-row text-gray-400 text-sm text-center text-m flex items-center">
										{item.release_date.slice(0, 4)}
										<p className="font-bold text-xl text mx-1">&middot;</p>
										{item.artists.map((item, index) => (index >= 1 ? ", " + item.name : item.name))}
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
								onClick={() => handleSearchPlaylist({id: item.id, name: item.name})}
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
				<div className="pb-32 sm:ml-52 px-5 justify-center">
					<div className="grid grid-cols-[2rem,10rem,2fr] grid-flow-col w-full text-white px-4 py-1 border-b border-neutral-500">
						<p>#</p>
						<p>TITULO</p>
						<p className="col-span-2 justify-self-center pr-8 ">AUTORES</p>
						<p className="px-8 ">time</p>
					</div>
					{data.map((item, i) => {
						return (
							<div
								key={"dataProp" + i}
								className="grid grid-cols-[2rem,10rem,2fr] grid-flow-col items-center p-3 rounded text-lg hover:bg-zinc-700 h-20 cursor-default"
								onMouseEnter={() => setCurrentHover("item" + i)}
								onMouseLeave={() => setCurrentHover("")}
							>
								<div className="mx-3 justify-self-center inline-block">
									{currentHover === "item" + i ? (
										<img src={playButton} className="h-5 w-auto invert mr-5" onClick={() => handlePlay({autors: item.artists, i, musicName: item.name})} />
									) : (
										<p className="text-white text-sm text-center mr-5">{i + 1}</p>
									)}
								</div>
								<audio src={item.preview_url} className={`audio` + i} />
								<p className="text-white justify-self-start w-max">{item.name}</p>
								<div className="text-white flex flex-row w-full justify-evenly select-none">
									{item.artists.map((artist, artistsIndex) => (artistsIndex >= 1 ? ", " + artist.name : artist.name))}
								</div>
								<div className="justify-end flex flex-row w-10 justify-self-end ">
									{currentHover === "item" + i ? (
										<img src={heart} alt="heart" className={"w-8 h-auto cursor-pointer heart" + i} onClick={() => addRemoveFav({id: item.id, i})} />
									) : null}
								</div>
								<div className="px-8 justify-start">
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
						<p className="col-span-2 pr-8 hidden sm:block">ALBUM</p>
						<p className="px-8 ">time</p>
					</div>
					{likedSongsData.map((item, i) => (
						<div
							key={"likedSong" + i}
							className="grid grid-cols-[1.5rem,6fr,6fr] grid-flow-col w-full sm:my-5 my-2 items-center hover:bg-black/[0.4] py-8 rounded-lg sm:py-0"
							onMouseEnter={() => setCurrentHover("item" + i)}
							onMouseLeave={() => setCurrentHover("")}
						>
							<div className="flex items-center">
								{currentHover === "item" + i ? (
									<img
										src={playButton}
										className="h-5 w-auto invert mr-5"
										onClick={() => handlePlay({autors: item.track.artists, i, musicName: item.track.name, img: item.track.album.images[0].url})}
									/>
								) : (
									<p className="text-white text-sm text-center mr-5">{i + 1}</p>
								)}
							</div>
							<div className="flex flex-row items-center truncate">
								<audio src={item.track.preview_url} className={`audio` + i} />
								<img src={item.track.album.images[1].url} className="w-16 h-16 mr-2 hidden sm:block" />
								<p className="text-white text-center truncate">{item.track.name}</p>
							</div>
							<p className="text-white text-start w-32 hidden sm:block">{item.track.artists.map((artist, i) => (i >= 1 ? ", " + artist.name : artist.name))}</p>
							<div className="px-8 flex flex-row justify-self-end">
								<img src={heartFilled} alt="heart" className={"w-6 h-5 cursor-pointer mr-10 heart" + i} onClick={() => addRemoveFav({id: item.track.id, i})} />
								<p className="text-white w-full text-center">{millisToMinutesAndSeconds(item.track.duration_ms)}</p>
							</div>
						</div>
					))}
				</div>
			);
		case "playlist":
			return (
				<>
					<div className="grid sm:grid-cols-[1.5rem,6fr,6fr] grid-flow-col w-full text-white py-1 border-b border-neutral-500 px-4">
						<p>#</p>
						<p>TITULO</p>
						<p className="col-span-2 pr-8 hidden sm:inline">ARTISTS</p>
						<p className="px-8 sm:justify-self-start justify-self-end">time</p>
					</div>
					{showingPlaylist.map((item, i) => (
						<div
							key={"likedSong" + i}
							className="grid grid-cols-[1.5rem,6fr,6fr] grid-flow-col w-full my-5 select-none px-2 sm:px-4"
							onMouseEnter={() => setCurrentHover("item" + i)}
							onMouseLeave={() => setCurrentHover("")}
						>
							<div className="flex items-center">
								{currentHover === "item" + i ? (
									<img
										src={playButton}
										className="h-5 w-auto invert mr-5"
										onClick={() => handlePlay({autors: item.artists, i, musicName: item.name, music: item.preview_url, img: item.album.images[0].url})}
									/>
								) : (
									<p className="text-white text-sm text-center mr-5">{i + 1}</p>
								)}
							</div>
							<div className="flex flex-row items-center truncate col-span-2">
								<audio src={item.preview_url} className={`audio` + i} />
								<img src={item.album.images[1].url} className="hidden sm:inline w-16 h-16 mr-2" />
								<p className="text-white text-center truncate">{item.name}</p>
							</div>
							<p className="text-white text-start sm:w-32 hidden sm:inline">{item.artists.map((artist, i) => (i >= 1 ? ", " + artist.name : artist.name))}</p>
							<div className="px-8 flex flex-row justify-self-end">
								<img src={heart} alt="heart" className={"w-5 h-5 sm:w-8 sm:h-8 cursor-pointer mr-10 heart" + i} onClick={() => addRemoveFav({id: item.id, i})} />
								<p className="text-white w-full text-center">{millisToMinutesAndSeconds(item.duration_ms)}</p>
							</div>
						</div>
					))}
				</>
			);
		case "tracks":
			return (
				<div className="ml-52 mb-32 px-12 flex flex-row min-w-screen flex-wrap">
					<div className="grid grid-cols-[1.5rem,6fr,6fr] grid-flow-col w-full text-white py-1 border-b border-neutral-500 px-5 mx-auto">
						<p>#</p>
						<p>TITULO</p>
						<p className="col-span-2 pr-8 ">ALBUM</p>
						<p className="px-8 ">time</p>
					</div>
					{tracksData.map((item, i) => (
						<div
							key={"likedSong" + i}
							className="grid grid-cols-[1.5rem,6fr,6fr] grid-flow-col w-full my-5"
							onMouseEnter={() => setCurrentHover("item" + i)}
							onMouseLeave={() => setCurrentHover("")}
						>
							<div className="flex items-center">
								{currentHover === "item" + i ? (
									<img src={playButton} className="h-5 w-auto invert mr-5" onClick={() => handlePlay({autors: item.artists, i, musicName: item.name})} />
								) : (
									<p className="text-white text-sm text-center mr-5">{i + 1}</p>
								)}
							</div>
							<div className="flex flex-row items-center truncate">
								<audio src={item.preview_url} className={`audio` + i} />
								<img src={item.album.images[1].url} className="w-16 h-16 mr-2" />
								<p className="text-white text-center truncate">{item.name}</p>
							</div>
							<p className="text-white text-start w-32">{item.artists.map((artist, i) => (i >= 1 ? ", " + artist.name : artist.name))}</p>
							<div className="px-8 flex flex-row justify-self-end">
								<img src={heart} alt="heart" className={"w-8 h-8 cursor-pointer mr-10 heart" + i} onClick={() => addRemoveFav({id: item.id, i})} />
								<p className="text-white w-full text-center">{millisToMinutesAndSeconds(item.duration_ms)}</p>
							</div>
						</div>
					))}
				</div>
			);
		case "artists":
			return (
				<div className="ml-52 mb-32 flex flex-row flex-wrap">
					{artistData.map((item, i) => (
						<div
							className="bg-[#181818] hover:bg-zinc-800 rounded-xl ml-4 p-2 flex flex-col justify-center text-white mt-5 duration-300"
							onMouseEnter={() => setArtistHover("artist" + i)}
							onMouseLeave={() => setArtistHover("")}
						>
							{item?.images[0]?.url ? (
								<img src={item.images[0].url} alt={"artistsPicture" + i} className="rounded-full w-48 h-48 shadow-lg shadow-black my-3" />
							) : (
								<img src={defaultArtist} alt={"artistsPicture" + i} className="bg-[#282828] rounded-full w-48 h-48 shadow-lg shadow-black my-3 p-5" />
							)}
							<div className="absolute">
								{artistHover === "artist" + i ? (
									<img src={playBtnGreen} className="rounded-full w-14 h-14 shadow-lg shadow-black my-3 relative top-12 left-32 cursor-pointer" />
								) : null}
							</div>
							<div className=" mx-3">
								<p>{item.name}</p>
								<p className="font-bold">Artista</p>
							</div>
						</div>
					))}
				</div>
			);
		case "todo":
			return <div>view</div>;
	}
}
