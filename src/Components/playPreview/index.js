import "react-circular-progressbar/dist/styles.css";
import "./style.css";
import playButton from "../../assets/playButton.png";
import {CircularProgressbar} from "react-circular-progressbar";
import ProgressProvider from "../ProgressProvider";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import useMusic from "../../hooks/useMusic";
import heart from "../../assets/heart.png";
import heartFilled from "../../assets/heartFilled.png";
import {updateCheckedPlaylist} from "../../store/slice/spotifySlice";

export default function PlayPreview({music, img, musicName, autors, i, checkId, length, type}) {
	const code = useSelector((state) => state.data.code);
	const playing = useSelector((state) => state.spotifyData.isPlaying);
	let valueTime = useSelector((state) => state.spotifyData.timestamp);
	let currentAudio = useSelector((state) => state.spotifyData.currentPlaying.audio);
	const checked = useSelector((state) => state.spotifyData.isChecked);
	const currentPlaylistId = useSelector((state) => state.spotifyData.data.userPlaylist.id);
	const lastCheckedId = useSelector((state) => state.spotifyData.checkedPlaylistId);
	let playlist = useSelector((state) => state.spotifyData.checkListPlaylist);

	const dispatch = useDispatch();
	const [playingNow, setPlayingNow] = useState();
	const [error, setError] = useState(false);
	const {start, stop} = useMusic();

	// This function start from 0 the track and adds to "playingNow" variable so the ternary operator from "return" change what's returning
	const startPlay = ({i, index, musicName, img, autors}) => {
		let audio = document.querySelector(`.audio${i}`);
		setPlayingNow("." + audio.classList[0]);
		if (playingNow !== currentAudio) {
			start({i, item: {itemId: "audio" + i, musicName, img, autors}});
		} else {
			stop(i);
			setPlayingNow("");
		}
	};

	// This function resets and stop the music
	const handleReset = ({index}) => {
		stop(index);
	};
	let newData = [];
	useEffect(() => {
		if (checkId.length === 1 && currentPlaylistId !== lastCheckedId) {
			dispatch(updateCheckedPlaylist({checked: false}));
		}
		//This part check if checkIdList length is exactly 10, and if is true then refetch with checkIdList
		if (checkId.length === length) {
			if (checkId[0] === undefined || checked === true) return;
			dispatch(updateCheckedPlaylist({checked: false}));
			if (checkId.length <= 50) {
				fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${checkId}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${code}`
					}
				})
					.then((res) => res.json())
					.then((data) => {
						data.map((item, i) => {
							let heartElement = document.querySelector(".heart" + i);
							if (item) {
								heartElement.src = heartFilled;
							} else heartElement.src = heart;
						});
					});
			}
			if (checkId.length >= 51) {
				const half = Math.ceil(checkId.length / 2);
				const firstHalf = checkId.slice(0, half);
				const secondHalf = checkId.slice(half);
				Promise.all([
					fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${firstHalf}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${code}`
						}
					}).then((res) => res.json()),
					fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${secondHalf}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${code}`
						}
					}).then((res) => res.json())
				]).then((data) => {
					data.map((item, i) => {
						newData = [...newData, ...item];
						if (newData.length === length) {
							dispatch(updateCheckedPlaylist({playlist: newData, checked: true}));
						}
					});
				});
			}
		} else return;
	}, [checkId]);

	// This useEffect checks if data is true or false depending if user has the track added to favorites on Spotify and changes the image heart src
	useEffect(() => {
		if (playlist === undefined || playlist.length !== length) return;
		if (playlist.length === checkId.length) {
			playlist.map((item, i) => {
				let image = document.querySelector(".heart" + i);
				if (item) {
					image.src = heartFilled;
				} else image.src = heart;
			});
		}
	}, [playlist]);

	switch (type) {
		case "album":
			return (
				<div className={"flex flex-row items-center divtest" + i} onClick={() => startPlay(i)} key={"playPreview" + i}>
					<audio src={music} className={`audio${i}`} onEnded={() => handleReset({index: i})} />
				</div>
			);
		default:
			return (
				<>
					<div className={"flex flex-row items-center divtest" + i} onClick={() => startPlay(i)} key={"playPreview" + i}>
						<audio src={music} className={`audio${i}`} onEnded={() => handleReset({index: i})} />
						<img src={img} alt={musicName} className="imagePlayer" />
						{playing && playingNow === currentAudio ? (
							<ProgressProvider valueStart={0} valueEnd={valueTime}>
								{(value) => <CircularProgressbar value={value} maxValue={29.779592} className="musicRadial" />}
							</ProgressProvider>
						) : (
							<img src={playButton} alt="playbutton" className="playButton" />
						)}
					</div>
				</>
			);
	}
}
