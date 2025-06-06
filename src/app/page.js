import History from "@/components/leaderboard/History";
import Standings from "@/components/leaderboard/Standings";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import {Chart} from "@/components/leaderboard/Charts";
import {StandingGraph} from "@/components/leaderboard/StandingGraph";
import {RankingGraph} from "@/components/leaderboard/RankingGraph";
import {ModeToggle} from "@/components/mode-toggler";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Home() {
	return (
		<>
			{/* <div className="flex justify-end px-4 lg:px-40 py-4">
				<Link href="/pointcalculation">
					<Button variant="outline">Point Calculation</Button>
				</Link>
			</div> */}
			<Standings />
			<Leaderboard />
			<History />
		</>
	);
}
