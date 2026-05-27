"use client";

import { TrendingUp, BarChart2 } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
	first: {
		label: "1st Place",
		color: "#47B39C",
	},
	second: {
		label: "2nd Place",
		color: "#FBBE53",
	},
	third: {
		label: "3rd Place",
		color: "#DE6552",
	},
	noposition: {
		label: "No Position",
		color: "#cbd5e1",
	},
};

export function StandingGraph({ data, year, totalGames }) {
	const chartData = data
		.map((team) => ({
			player: team.name,
			first: team.first,
			second: team.second,
			third: team.third,
			noposition: Math.max(0, totalGames - (team.first + team.second + team.third)),
		}))
		.sort((a, b) => b.first - a.first);

	return (
		<Card className="w-full border border-slate-200 dark:border-zinc-800 shadow-md rounded-2xl bg-white dark:bg-zinc-900/50 overflow-hidden transition-all hover:shadow-lg">
			<CardHeader className="bg-slate-50/50 dark:bg-zinc-900/80 border-b border-slate-100 dark:border-zinc-800 pb-4">
				<div className="flex items-center gap-2">
					<BarChart2 className="h-5 w-5 text-indigo-500" />
					<div>
						<CardTitle className="text-base font-extrabold text-slate-800 dark:text-zinc-100">
							Trophy Standings
						</CardTitle>
						<CardDescription className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
							Podium distribution stack for {year}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-6">
				<ChartContainer config={chartConfig} className="min-h-[220px] w-full">
					<BarChart accessibilityLayer data={chartData} margin={{ top: 12, left: 8, right: 8, bottom: 4 }}>
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
							content={<ChartTooltipContent className="rounded-xl border border-slate-200 dark:border-zinc-800 shadow-lg bg-white/95 dark:bg-zinc-950/95" />}
						/>
						<ChartLegend content={<ChartLegendContent className="text-[10px] font-semibold text-slate-500 mt-4" />} />

						<Bar
							dataKey="first"
							stackId="a"
							fill="var(--color-first)"
							maxBarSize={45}
						/>
						<Bar
							dataKey="second"
							stackId="a"
							fill="var(--color-second)"
							maxBarSize={45}
						/>
						<Bar
							dataKey="third"
							stackId="a"
							fill="var(--color-third)"
							maxBarSize={45}
						/>
						<Bar
							dataKey="noposition"
							stackId="a"
							fill="var(--color-noposition)"
							maxBarSize={45}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-xs border-t border-slate-100 dark:border-zinc-800 pt-4 bg-slate-50/20 dark:bg-zinc-900/10 p-4">
				<div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-zinc-300">
					<TrendingUp className="h-4 w-4 text-indigo-500" />
					<span>Sorted by number of first place victories</span>
				</div>
				<div className="leading-none text-slate-400 dark:text-zinc-500">
					This stack displays game standings out of {totalGames} total season matches.
				</div>
			</CardFooter>
		</Card>
	);
}
