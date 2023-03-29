import {useDispatch} from "react-redux";
import {useGetTrackQuery} from "../store/api/spotifyApi";
import {addData} from "../store/slice/spotifySlice";

const SearchData = ({value, token, offset}) => {
	const dispatch = useDispatch();
	const {data} = useGetTrackQuery({value: value, accessCode: token, offset});
	dispatch(addData({data: data, type: "search"}));
};
export default SearchData;
