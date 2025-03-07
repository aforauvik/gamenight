import History from "@/components/leaderboard/History";
import Standings from "@/components/leaderboard/Standings";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import {Chart} from "@/components/leaderboard/Charts";
import {StandingGraph} from "@/components/leaderboard/StandingGraph";
import {RankingGraph} from "@/components/leaderboard/RankingGraph";
import {ModeToggle} from "@/components/mode-toggler";

export default function Home() {
	return (
		<>
			<Standings />
			<Leaderboard />
			<History />
		</>
	);
}
