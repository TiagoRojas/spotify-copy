import {useEffect} from "react";
import {useLazyGetNewReleasesQuery} from "../../store/api/spotifyApi";
import {useDispatch, useSelector} from "react-redux";
import {changeData} from "../../store/slice/spotifySlice";
import Cards from "../Cards";
import {DotWave} from "@uiball/loaders";

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
			{newReleasesData.length < 1 ? (
				<div className="w-full h-screen flex justify-center items-center">
					<DotWave size={47} speed={1} color="white" />
				</div>
			) : (
				<>
					<p className="text-[30px] sm:text-[48px] font-bold pl-4">Nuevos lanzamientos:</p>
					<Cards type="newReleases" />
				</>
			)}
		</div>
	);
}

export default NewReleases;
