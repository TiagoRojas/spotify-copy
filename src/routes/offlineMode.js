import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";

function OfflineModeView() {
	return (
		<div className="flex justify-center items-center bg-zinc-900 h-screen text-white">
			<SideMenu />
			<Player />
		</div>
	);
}

export default OfflineModeView;
