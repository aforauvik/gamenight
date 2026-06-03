"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { joinGameRoom } from "@/features/game/services/gameService";
import { Sparkles, Gamepad2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function JoinPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [serverError, setServerError] = useState("");
	
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			pin: "",
			nickname: "",
		}
	});

	const onSubmit = async (values) => {
		setIsLoading(true);
		setServerError("");
		try {
			const { player, game } = await joinGameRoom(values.pin.trim(), values.nickname.trim());
			
			// Store session details in sessionStorage
			sessionStorage.setItem("gamenight_player_id", player.id);
			sessionStorage.setItem("gamenight_player_name", player.name);
			sessionStorage.setItem("gamenight_game_id", game.id);
			sessionStorage.setItem("gamenight_game_pin", game.pin);

			router.push("/play");
		} catch (error) {
			setServerError(error.message || "Failed to join room. Verify the PIN is correct.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4 py-8">
			{/* Back Link */}
			<div className="mb-6 w-full max-w-md">
				<Link href="/" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors">
					<ArrowLeft className="h-3.5 w-3.5" />
					<span>Back to Home</span>
				</Link>
			</div>

			<Card className="w-full max-w-md bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 shadow-md rounded-2xl overflow-hidden">
				<CardHeader className="text-center pt-8 pb-4 border-b border-slate-100 dark:border-zinc-800">
					<div className="mx-auto bg-indigo-50 dark:bg-indigo-950/40 p-3 rounded-2xl w-fit mb-3 border border-indigo-100 dark:border-indigo-900/30">
						<Gamepad2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
					</div>
					<CardTitle className="text-2xl font-extrabold tracking-tight flex items-center justify-center gap-1.5 text-slate-800 dark:text-zinc-100">
						Join Game Night
						<Sparkles className="h-5 w-5 text-indigo-500" />
					</CardTitle>
					<CardDescription className="text-slate-500 dark:text-zinc-400 text-sm mt-1">
						Enter the room PIN and your nickname to join the lobby
					</CardDescription>
				</CardHeader>
				<CardContent className="py-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						{serverError && (
							<div className="p-3.5 text-xs font-bold rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30">
								⚠️ {serverError}
							</div>
						)}

						<div className="space-y-2">
							<label htmlFor="pin" className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-zinc-500">
								Room PIN Code
							</label>
							<input
								id="pin"
								placeholder="Enter 4-Digit PIN"
								maxLength={4}
								className={`w-full bg-slate-50 dark:bg-zinc-900/50 border ${
									errors.pin ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 dark:border-zinc-800 focus:ring-indigo-500"
								} text-slate-900 dark:text-zinc-100 font-mono font-bold tracking-widest text-center text-lg p-3 rounded-xl focus:outline-none focus:ring-2 transition-all`}
								{...register("pin", {
									required: "PIN is required",
									pattern: {
										value: /^[0-9]{4}$/,
										message: "PIN must be exactly 4 digits",
									},
								})}
							/>
							{errors.pin && (
								<p className="text-xs font-semibold text-rose-500">{errors.pin.message}</p>
							)}
						</div>

						<div className="space-y-2">
							<label htmlFor="nickname" className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-zinc-500">
								Your Nickname
							</label>
							<input
								id="nickname"
								placeholder="e.g. Grandma, Hannah, Julian"
								className={`w-full bg-slate-50 dark:bg-zinc-900/50 border ${
									errors.nickname ? "border-rose-500 focus:ring-rose-500" : "border-slate-200 dark:border-zinc-800 focus:ring-indigo-500"
								} text-slate-900 dark:text-zinc-100 font-bold p-3 rounded-xl focus:outline-none focus:ring-2 transition-all`}
								{...register("nickname", {
									required: "Nickname is required",
									minLength: {
										value: 2,
										message: "Nickname must be at least 2 characters",
									},
									maxLength: {
										value: 15,
										message: "Nickname must not exceed 15 characters",
									},
								})}
							/>
							{errors.nickname && (
								<p className="text-xs font-semibold text-rose-500">{errors.nickname.message}</p>
							)}
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-sm transition-all mt-2"
						>
							{isLoading ? "Joining..." : "Enter Lobby"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
