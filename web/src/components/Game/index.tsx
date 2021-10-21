import './styles.scss';

import { SocketContext } from "context/socket";
import { GameLoop, UpdateUser } from "models/apiTypes";
import GameBall from "models/GameBall";
import Player from "models/Player";
import { User } from "models/User";
import React, { useEffect } from 'react';
import { clearInterval, setInterval } from "timers";

interface GameProps {
	setInfoBoardContent: React.Dispatch<React.SetStateAction<JSX.Element> >,
	enemyInfo: UpdateUser | null,
	currentUser: User,
	gameLoopRef: React.MutableRefObject<GameLoop>,
	gameIdRef: React.MutableRefObject<number | null>
}

const Game = ({ setInfoBoardContent, enemyInfo, currentUser, gameLoopRef, gameIdRef }: GameProps) => {
	if (!enemyInfo)
		throw Error('No enemy info');

	const socket = React.useContext(SocketContext);
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const player = new Player();
	const enemy = new Player();
	const ball = new GameBall();

	const playerWidth = 15;
	const playerMargin = 15;
	const playerHeight = 150;

	const clearPositions = () => {
		const canvas = canvasRef.current;
		if (!canvas)
			return ;
		player.yPosition = Math.round((canvas.height - playerHeight) / 2);
		enemy.yPosition = Math.round((canvas.height - playerHeight) / 2);
		ball.xPosition = Math.round((canvas.width - ball.size) / 2);
		ball.yPosition = Math.round((canvas.height - ball.size) / 2);
		ball.angle = 2 * Math.PI * Math.random();
	};

	const drawUserRectangle = () => {
		const canvas = canvasRef.current;
		if (!canvas)
			return ;
		const ctx = canvas.getContext('2d');
		if (!ctx)
			return ;
		ctx.rect(playerMargin, player.yPosition, playerWidth, playerHeight);
		ctx.fill();
	};

	const drawEnemyRectangle = () => {
		const canvas = canvasRef.current;
		if (!canvas)
			return ;
		const ctx = canvas.getContext('2d');
		if (!ctx)
			return ;
		ctx.rect(canvas.width - playerWidth - playerMargin, enemy.yPosition, playerWidth, playerHeight);
		ctx.fill();
	};

	const drawBall = () => {
		const canvas = canvasRef.current;
		if (!canvas)
			return ;
		const ctx = canvas.getContext('2d');
		if (!ctx)
			return ;
		ctx.rect(ball.xPosition, ball.yPosition, ball.size, ball.size);
		ctx.fill();
	};

	const render = () => {
		const canvas = canvasRef.current;
		if (!canvas)
			return ;
		const ctx = canvas.getContext('2d');
		if (!ctx)
			return ;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.fillStyle = '#2c3e50';
		drawUserRectangle();
		drawEnemyRectangle();
		ctx.closePath();

		ctx.beginPath();
		ctx.fillStyle = '#42b983';
		drawBall();
		ctx.closePath();
	};

	const prepareGame = () => {
		clearPositions();
		render();
	};

	const runGame = () => {
		let fpsInterval: number, now: number, then: number, elapsed: number;
		const fps = 60;

		const updatePositions = () => {
			const gameLoop = gameLoopRef.current;
			player.yPosition = gameLoop.leftPlayer.y;
			enemy.yPosition = gameLoop.rightPlayer.y;
			ball.yPosition = gameLoop.ball.y;
			ball.xPosition = gameLoop.ball.x;
		};

		const animate = () => {
			requestAnimationFrame(animate);
			now = Date.now();
			elapsed = now - then;
			if (elapsed > fpsInterval) {
				then = now - (elapsed % fpsInterval);

				updatePositions();
				render();

			}
		};

		fpsInterval = 1000 / fps;
		then = Date.now();
		animate();
	};

	const keyDownHandler = (e: KeyboardEvent) => {
		if (['ArrowDown', 'ArrowUp'].indexOf(e.key) !== -1) {
			const data = {
				login: currentUser.username,
				gameId: gameIdRef.current,
				key: e.key
			};
			socket.emit('keyDown', JSON.stringify(data));
		}
		// if (e.key === 'ArrowDown')
		// 	controlsRef.current.arrowDown = true;
		// else if (e.key === 'ArrowUp')
		// 	controlsRef.current.arrowUp = true;
	};

	const keyUpHandler = (e: KeyboardEvent) => {
		if (['ArrowDown', 'ArrowUp'].indexOf(e.key) !== -1) {
			const data = {
				login: currentUser.username,
				gameId: gameIdRef.current,
				key: e.key
			};
			socket.emit('keyUp', JSON.stringify(data));
		}
		// if (e.key === 'ArrowDown')
		// 	controlsRef.current.arrowDown = false;
		// else if (e.key === 'ArrowUp')
		// 	controlsRef.current.arrowUp = false;
	};

	useEffect(() => {
		document.addEventListener('keydown', keyDownHandler);
		document.addEventListener('keyup', keyUpHandler);
		return () => {
			document.removeEventListener('keydown', keyDownHandler);
			document.removeEventListener('keyup', keyUpHandler);
		};
	});

	useEffect(prepareGame);

	useEffect(() => {
		let timeUntilStart = 3;
		setInfoBoardContent(<div>{timeUntilStart}</div>);
		const interval = setInterval(() => {
			--timeUntilStart;
			if (timeUntilStart === 0) {
				setInfoBoardContent(
					<div>
						<span>{currentUser.username}</span>
						<span style={{ margin: '0 10px' }}>VS</span>
						<span>{enemyInfo.login}</span>
					</div>
				);
				runGame();
				clearInterval(interval);
			} else {
				setInfoBoardContent(<div>{timeUntilStart}</div>);
			}
		}, 1000);
	}, []);

	return (
		<canvas
			id="game-canvas"
			width="1024px"
			height="600px"
			ref={canvasRef}
		/>
	);
};

export default Game;
