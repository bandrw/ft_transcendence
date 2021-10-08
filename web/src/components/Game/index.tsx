import './styles.scss'

import React, { useEffect } from 'react';

import GameBall from "../../classes/GameBall";
import Player from "../../classes/Player";
import { User } from "../../classes/User";

interface GameProps {
	currentUser: User,
	setCurrentUser: (arg0: User) => void
}

const Game = (_: GameProps) => {
	const canvasRef = React.createRef<HTMLCanvasElement>()

	const player = new Player()
	const enemy = new Player()
	const ball = new GameBall()
	const controls = {
		arrowUp: false,
		arrowDown: false
	}

	const runGame = () => {
		const canvas = canvasRef.current
		if (!canvas)
			throw Error('Cannot get canvas')
		const ctx = canvas.getContext('2d');
		if (!ctx)
			throw Error('Cannot get canvas context')

		const playerWidth = 15;
		const playerMargin = 15;
		const playerHeight = 150;
		const playerStep = 5;
		player.yPosition = Math.round((canvas.height - playerHeight) / 2)
		enemy.yPosition = Math.round((canvas.height - playerHeight) / 2)
		ball.xPosition = Math.round(canvas.width / 2)
		ball.yPosition = Math.round(canvas.height / 2)

		const drawUserRectangle = () => {
			ctx.rect(playerMargin, player.yPosition, playerWidth, playerHeight);
			ctx.fill();
		}

		const drawEnemyRectangle = () => {
			ctx.rect(canvas.width - playerWidth - playerMargin, enemy.yPosition, playerWidth, playerHeight);
			ctx.fill();
		}

		const drawBall = () => {
			ctx.rect(ball.xPosition, ball.yPosition, ball.size, ball.size)
			ctx.fill()
		}

		let fpsInterval: number, now: number, then: number, elapsed: number;
		const fps = 60

		const animate = () => {
			requestAnimationFrame(animate);
			now = Date.now();
			elapsed = now - then;
			if (elapsed > fpsInterval) {
				then = now - (elapsed % fpsInterval);

				// Calculating positions (needs to be done in server)
				if (ball.xPosition < 0)
					ball.angle = Math.PI - ball.angle
				if (ball.xPosition + ball.size > canvas.width)
					ball.angle = Math.PI - ball.angle
				if (ball.yPosition + ball.size > canvas.height)
					ball.angle = -ball.angle
				if (ball.yPosition < 0)
					ball.angle = -ball.angle

				ball.xPosition += Math.cos(ball.angle) * ball.speed
				ball.yPosition += Math.sin(ball.angle) * ball.speed
				if (controls.arrowUp && player.yPosition >= playerStep)
					player.yPosition -= playerStep
				if (controls.arrowDown && player.yPosition < canvas.height - playerHeight)
					player.yPosition += playerStep
				enemy.yPosition = ball.yPosition - playerHeight / 2

				// Render
				ctx.clearRect(0, 0, canvas.width, canvas.height)
				ctx.beginPath()
				ctx.fillStyle = '#2c3e50'
				drawUserRectangle()
				drawEnemyRectangle()
				ctx.closePath()

				ctx.beginPath()
				ctx.fillStyle = '#42b983'
				drawBall()
				ctx.closePath()

			}
		}

		fpsInterval = 1000 / fps;
		then = Date.now();
		animate();
	}

	const moveDown = (e: KeyboardEvent) => {
		if (e.key === 'ArrowDown')
			controls.arrowDown = true
		else if (e.key === 'ArrowUp')
			controls.arrowUp = true
	}

	const moveUp = (e: KeyboardEvent) => {
		if (e.key === 'ArrowDown')
			controls.arrowDown = false
		else if (e.key === 'ArrowUp')
			controls.arrowUp = false
	}

	useEffect(() => {
		document.addEventListener('keydown', moveDown);
		document.addEventListener('keyup', moveUp);
		return () => {
			document.removeEventListener('keydown', moveDown)
			document.removeEventListener('keyup', moveUp)
		}
	})


	useEffect(() => runGame())

	return (
		<canvas
			id="game-canvas"
			width="1024px"
			height="600px"
			ref={canvasRef}
		/>
	)
}

export default Game;
