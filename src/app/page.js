import History from "@/features/leaderboard/components/History";
import Standings from "@/features/leaderboard/components/Standings";
import Leaderboard from "@/features/leaderboard/components/Leaderboard";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function Home() {
	return (
		<>
			<Standings />
			<Leaderboard />
			<History />
		</>
	);
}
