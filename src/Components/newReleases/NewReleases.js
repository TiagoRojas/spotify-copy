import {useEffect} from "react";
import {useLazyGetNewReleasesQuery} from "../../store/api/spotifyApi";
import {useDispatch, useSelector} from "react-redux";
import {changeData} from "../../store/slice/spotifySlice";
import CardsTracks from "../Cards";

function NewReleases() {
	const token = useSelector((state) => state.data.code);
	const newReleasesData = useSelector((state) => state.spotifyData.data.newReleases);
	const [getNewReleases, results] = useLazyGetNewReleasesQuery();
	const dispatch = useDispatch();
	useEffect(() => {
		if (results.data === undefined) {
			getNewReleases({token: token});
		} else {
			dispatch(changeData({data: results.data.albums.items, type: "newReleases"}));
		}
	}, [results.data]);
	return (
		<div className="sm:pl-52 sm:pt-24 text-white">
			<p className="text-[30px] sm:text-[48px] font-bold pl-4">Nuevos lanzamientos:</p>
			{newReleasesData === [] ? null : <CardsTracks type="newReleases" />}
		</div>
	);
}

export default NewReleases;
