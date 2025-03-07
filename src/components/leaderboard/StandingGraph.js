"use client";

import {TrendingUp} from "lucide-react";
import {Bar, BarChart, CartesianGrid, XAxis} from "recharts";

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

const allInfo = {
	game: 6,
};

function nopositioncalc() {
	return allInfo.game - (this.first + this.second + this.third);
}

const chartData = [
	{
		player: "Aunt Sabrina",
		first: 3,
		second: 1,
		third: 0,
		get noposition() {
			return nopositioncalc.call(this);
		},
	},
	{
		player: "Grandma",
		first: 2,
		second: 0,
		third: 1,
		get noposition() {
			return nopositioncalc.call(this);
		},
	},
	{
		player: "Hannah",
		first: 1,
		second: 4,
		third: 1,
		get noposition() {
			return nopositioncalc.call(this);
		},
	},
	{
		player: "Julian",
		first: 1,
		second: 0,
		third: 0,
		get noposition() {
			return nopositioncalc.call(this);
		},
	},
	{
		player: "Landon",
		first: 1,
		second: 1,
		third: 0,
		get noposition() {
			return nopositioncalc.call(this);
		},
	},
	{
		player: "Mom",
		first: 0,
		second: 1,
		third: 1,
		get noposition() {
			return nopositioncalc.call(this);
		},
	},
	{
		player: "Christine",
		first: 0,
		second: 0,
		third: 0,
		get noposition() {
			return nopositioncalc.call(this);
		},
	},
].sort((a, b) => b.first - a.first);

const chartConfig = {
	first: {
		label: "First",
		color: "#10b981",
	},
	second: {
		label: "Second",
		color: "#F9C74F",
	},
	third: {
		label: "Third",
		color: "#F94144",
	},
	noposition: {
		label: "No Position",
		color: "#484848",
	},
};

export function StandingGraph() {
	return (
		<Card className="w-full shadow-none">
			<CardHeader>
				<CardTitle>Leaderboard - Standings</CardTitle>
				<CardDescription>Jan - Dec 2025</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="player"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip content={<ChartTooltipContent hideLabel />} />
						<ChartLegend content={<ChartLegendContent />} />

						<Bar
							dataKey="first"
							stackId="a"
							fill="var(--color-first)"
							radius={[0, 0, 4, 4]}
							fillOpacity={0.4}
						/>
						<Bar
							dataKey="second"
							stackId="a"
							fill="var(--color-second)"
							radius={[0, 0, 0, 0]}
							fillOpacity={0.4}
						/>
						<Bar
							dataKey="third"
							stackId="a"
							fill="var(--color-third)"
							radius={[0, 0, 0, 0]}
							fillOpacity={0.4}
						/>

						<Bar
							dataKey="noposition"
							stackId="a"
							fill="var(--color-noposition)"
							radius={[4, 4, 0, 0]}
							fillOpacity={0.4}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					Organized by first position <TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					Data from the last 12 months
				</div>
			</CardFooter>
		</Card>
	);
}
