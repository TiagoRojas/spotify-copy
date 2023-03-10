import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {millisToMinutesAndSeconds} from "./complements";
import PlayPreview from "./playPreview";
import LeftArrow from "../assets/leftArrow.png";
import RightArrow from "../assets/rightArrow.png";
import {changeId, changeOffset} from "../store/slice/spotifySlice";
import heart from "../assets/heart.png";
import heartFilled from "../assets/heartFilled.png";
import {useAddTrackFavoriteQuery, useRemoveTrackFavoriteQuery} from "../store/api/spotifyApi";

export default function CardsTracks({token}) {
	const dispatch = useDispatch();
	const spotifyData = useSelector((state) => state.spotifyData.data) || [];
	const blank = useSelector((state) => state.spotifyData.isBlank);
	const offset = useSelector((state) => state.spotifyData.offset);
	const [tracks, setTracks] = useState([]);
	const [id, setId] = useState("");
	const {refetch: refetchRemove} = useRemoveTrackFavoriteQuery({id, token}, {manual: true});
	const {refetch: refetchAdd} = useAddTrackFavoriteQuery({id, token}, {manual: true});
	useEffect(() => {
		if (!blank) {
			setTracks(spotifyData.tracks);
		}
	}, [spotifyData]);
	const offsetSubtract = () => {
		if (offset >= 10) {
			dispatch(changeOffset(-10));
		} else return;
	};
	const offsetAdd = () => {
		dispatch(changeOffset(10));
	};

	const addRemoveFav = ({id, i}) => {
		let image = document.querySelector(".heart" + i);
		setId(id);
		if (image.src === heartFilled) {
			refetchRemove();
			image.src = heart;
		} else {
			image.src = heartFilled;
			refetchAdd();
		}
	};

	return blank ? (
		<div className="flex justify-center items-center w-screen my-auto" key={"container"}>
			<p className="text-white my-52 text-xl font-bold">Busca una cancion</p>
		</div>
	) : (
		<>
			{tracks.map((item, i) => {
				return (
					<div key={"card" + i} className="grid grid-cols-6 auto-rows-auto items-center w-full p-3 rounded text-lg hover:text-xl hover:bg-zinc-700">
						<p className="text-white text-sm">{i + 1}</p>
						<div>
							<img src={heart} alt="heart" className={"w-6 h-auto heart" + i} onClick={() => addRemoveFav({id: item.id, i})} />
						</div>
						<PlayPreview music={item.preview_url} img={item.album.images[1].url} name={item.name} i={i} key={"audio" + i} id={item.id} token={token} />
						<div>
							<p className="text-white mx-auto">{item.name}</p>
							<div className="flex flex-row text-gray-500 text-sm">
								{item.artists.length > 1 ? (
									item.artists.map((artist, index) => {
										return (
											<p>
												{artist.name}
												{index < 1 ? <i className="pr-1">,</i> : ""}
											</p>
										);
									})
								) : (
									<p>{item.artists[0].name}</p>
								)}
							</div>
						</div>
						<p className="text-white w-full text-center">{millisToMinutesAndSeconds(item.duration_ms)}</p>
						<p className="text-white">{item.album?.name}</p>
					</div>
				);
			})}
			<div className="flex mt-5">
				<img src={LeftArrow} onClick={() => offsetSubtract()} className="invert w-5 h-auto" />
				<p className="text-white">{offset / 10}</p>
				<img src={RightArrow} onClick={() => offsetAdd()} className="invert w-5 h-auto" />
			</div>
		</>
	);
}
