import History from "@/components/leaderboard/History";
import Standings from "@/components/leaderboard/Standings";
import Leaderboard from "@/components/leaderboard/Leaderboard";

export default function Home() {
	return (
		<>
			<Standings />
			<Leaderboard />
			<History />
		</>
	);
}
