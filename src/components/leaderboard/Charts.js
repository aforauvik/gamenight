"use client";

import {TrendingUp} from "lucide-react";
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
	{month: "January", desktop: 186, mobile: 150, amt: 10},
	{month: "February", desktop: 210, mobile: 200, amt: 30},
	{month: "March", desktop: 237, mobile: 120, amt: 20},
	{month: "April", desktop: 73, mobile: 190, amt: 10},
	{month: "May", desktop: 209, mobile: 130, amt: 40},
	{month: "June", desktop: 214, mobile: 140, amt: 20},
];

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "#43AA8B",
	},
	mobile: {
		label: "Mobile",
		color: "#F9C74F",
	},
	amt: {
		label: "Amt",
		color: "#F94144",
	},
};

export function Chart() {
	return (
		<Card className="w-1/2">
			<CardHeader>
				<CardTitle>Area Chart - Stacked</CardTitle>
				<CardDescription>
					Showing total visitors for the last 6 months
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
					<AreaChart data={chartData} margin={{left: 12, right: 12}}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="dot" />}
						/>
						<Area
							dataKey="amt"
							type="natural"
							fill="var(--color-amt)"
							fillOpacity={0.4}
							stroke="var(--color-amt)"
							stackId="a"
						/>
						<Area
							dataKey="mobile"
							type="natural"
							fill="var(--color-mobile)"
							fillOpacity={0.4}
							stroke="var(--color-mobile)"
							stackId="a"
						/>
						<Area
							dataKey="desktop"
							type="natural"
							fill="var(--color-desktop)"
							fillOpacity={0.4}
							stroke="var(--color-desktop)"
							stackId="a"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
			<CardFooter>
				<div className="flex w-full items-start gap-2 text-sm">
					<div className="grid gap-2">
						<div className="flex items-center gap-2 font-medium leading-none">
							Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
						</div>
						<div className="flex items-center gap-2 leading-none text-muted-foreground">
							January - June 2024
						</div>
					</div>
				</div>
			</CardFooter>
		</Card>
	);
}
