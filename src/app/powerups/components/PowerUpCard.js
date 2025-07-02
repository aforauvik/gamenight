"use client";
import {useState} from "react";
import {motion} from "framer-motion";
import {Card, CardContent} from "@/components/ui/card";
import {cn} from "@/lib/utils";

const PowerUpCard = ({powerUp, number}) => {
	const [isFlipped, setIsFlipped] = useState(false);

	return (
		<div
			className="w-full h-64 perspective-1000 cursor-pointer relative"
			onClick={() => setIsFlipped(!isFlipped)}
		>
			<motion.div
				className="relative w-full h-full transition-transform duration-500 transform-style-3d"
				animate={{rotateY: isFlipped ? 180 : 0}}
				transition={{duration: 0.1}}
			>
				{/* Front of card */}
				<Card className="absolute w-full h-full backface-hidden overflow-hidden">
					<div
						className="absolute inset-0 bg-cover bg-center bg-no-repeat"
						style={{backgroundImage: 'url("/powerup4.jpeg")'}}
					>
						<div className="absolute inset-0 bg-red-500/10" />
					</div>
					<CardContent className="relative flex flex-col items-center justify-center h-full text-white p-6">
						<div className="absolute top-1 left-4 bg-emerald-500 rounded-full w-8 h-8 flex items-center justify-center">
							<span className="text-white font-bold">{number}</span>
						</div>
						{/* <h3 className="text-2xl font-bold mb-2">Power Up</h3>
						<p className="text-center">Click to reveal</p> */}
					</CardContent>
				</Card>

				{/* Back of card */}
				<Card className="absolute w-full h-full backface-hidden bg-gray-100 rotate-y-180">
					<CardContent className="flex flex-col items-center justify-center h-full text-black p-6">
						<div className="absolute top-4 left-4 bg-black/20 rounded-full w-8 h-8 flex items-center justify-center">
							<span className="text-black font-bold">{number}</span>
						</div>
						<h3 className="text-2xl font-bold mb-2">{powerUp.name}</h3>
						<p className="text-center text-sm">{powerUp.description}</p>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
};

export default PowerUpCard;
