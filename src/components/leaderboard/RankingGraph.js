"use client";

import {TrendingUp} from "lucide-react";
import {Bar, BarChart, CartesianGrid, LabelList, XAxis} from "recharts";

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

const chartData = [
	{month: "Aunt Sabrina", points: 11},
	{month: "Grandma", points: 7},
	{month: "Hannah", points: 11},
	{month: "Julian", points: 3},
	{month: "Landon", points: 5},
	{month: "Mom", points: 3},
	{month: "Christine", points: 0},
].sort((a, b) => b.points - a.points);

const chartConfig = {
	points: {
		label: "Points",
		color: "#10b981",
	},
};

export function RankingGraph() {
	return (
		<Card className="w-full shadow-none">
			<CardHeader>
				<CardTitle>Leaderboard - Points</CardTitle>
				<CardDescription>Jan - Dec 2025</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
					<BarChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 20,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Bar
							dataKey="points"
							fill="var(--color-points)"
							fillOpacity={0.4}
							radius={8}
						>
							<LabelList
								position="top"
								offset={12}
								className="fill-foreground"
								fontSize={12}
							/>
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					Organized by total points <TrendingUp className="h-4 w-4" />
				</div>
				<div className="leading-none text-muted-foreground">
					Data from the last 12 months
				</div>
			</CardFooter>
		</Card>
	);
}
