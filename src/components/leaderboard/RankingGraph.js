"use client";

import { TrendingUp, Award } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, Tooltip } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
	points: {
		label: "Season Points",
		color: "#47B39C",
	},
};

export function RankingGraph({ data, year }) {
	const chartData = data
		.map((team) => ({
			player: team.name,
			points: team.points,
		}))
		.sort((a, b) => b.points - a.points);

	return (
		<Card className="w-full border border-slate-200 dark:border-zinc-800 shadow-md rounded-2xl bg-white dark:bg-zinc-900/50 overflow-hidden transition-all hover:shadow-lg">
			<CardHeader className="bg-slate-50/50 dark:bg-zinc-900/80 border-b border-slate-100 dark:border-zinc-800 pb-4">
				<div className="flex items-center gap-2">
					<Award className="h-5 w-5 text-indigo-500" />
					<div>
						<CardTitle className="text-base font-extrabold text-slate-800 dark:text-zinc-100">
							Points Distribution
						</CardTitle>
						<CardDescription className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
							Active standings summary for {year}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-6">
				<ChartContainer config={chartConfig} className="min-h-[220px] w-full">
					<BarChart accessibilityLayer data={chartData} margin={{ top: 24, left: 8, right: 8, bottom: 4 }}>
						<CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.08)" strokeDasharray="3 3" />
						<XAxis
							dataKey="player"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
							className="text-[10px] font-bold text-slate-400 dark:text-zinc-500"
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel className="rounded-xl border border-slate-200 dark:border-zinc-800 shadow-lg bg-white/95 dark:bg-zinc-950/95" />}
						/>
						<Bar
							dataKey="points"
							fill="var(--color-points)"
							maxBarSize={45}
						>
							<LabelList
								position="top"
								offset={10}
								className="fill-slate-700 dark:fill-zinc-300 font-extrabold text-[10px] font-mono"
								fontSize={10}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-xs border-t border-slate-100 dark:border-zinc-800 pt-4 bg-slate-50/20 dark:bg-zinc-900/10 p-4">
				<div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-zinc-300">
					<TrendingUp className="h-4 w-4 text-indigo-500" />
					<span>Sorted by total podium scoring points</span>
				</div>
				<div className="leading-none text-slate-400 dark:text-zinc-500">
					Rankings calculate points based on gold, silver, and bronze trophies.
				</div>
			</CardFooter>
		</Card>
	);
}
