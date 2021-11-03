import './styles.scss';

import { SocketContext } from "context/socket";
import { ApiGameLoop, ApiGameSettings, ApiUserStatus } from "models/apiTypes";
import GameBall from "models/GameBall";
import Player from "models/Player";
import { User } from "models/User";
import GameResults from "pages/Game/GameResults";
import React, { useEffect, useMemo } from "react";
import { Fade } from "react-awesome-reveal";
import { Link } from 'react-router-dom';

interface GameCanvasProps {
	watchMode: boolean,
	currentUser: User,
	gameSettingsRef: React.MutableRefObject<ApiGameSettings | null>,
	gameRef: React.MutableRefObject<{ runs: boolean, interval: null | NodeJS.Timeout }>,
	setStatus: React.Dispatch<React.SetStateAction<ApiUserStatus>>
}

const GameCanvas = ({ watchMode, currentUser, gameSettingsRef, gameRef, setStatus }: GameCanvasProps) => {
	const socket = React.useContext(SocketContext);
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const leftPlayer = useMemo(() => new Player(), []);
	const rightPlayer = useMemo(() => new Player(), []);
	const ball = useMemo(() => new GameBall(), []);

	const score = useMemo(() => ({ leftPlayer: 0, rightPlayer: 0 }), []);

	const [gameResults, setGameResults] = React.useState<{ winner: string } | null>(null);

	useEffect(() => {
		const gameResultsHandler = (e: string) => {
			const data: { winner: string } = JSON.parse(e);
			setGameResults(data);
		};

		const gameLoopHandler = (e: string) => {
			const data: ApiGameLoop = JSON.parse(e);

			if (data.b) {
				ball.xPosition = data.b.x;
				ball.yPosition = data.b.y;
			}
			if (data.lP)
				leftPlayer.yPosition = data.lP.y;
			if (data.rP)
				rightPlayer.yPosition = data.rP.y;
		};

		const gameScoreHandler = (e: string) => {
			const data = JSON.parse(e);
			score.leftPlayer = data.leftPlayer;
			score.rightPlayer = data.rightPlayer;
		};

		const playSoundHandler = (e: string) => {
			let a: HTMLAudioElement | null = null;
			if (e === 'pong-sound-1') {
				a = new Audio('/audio/pong-sound-1.wav');
				a.volume = 0.17;
			} else if (e === 'pong-sound-2') {
				a = new Audio('/audio/pong-sound-2.wav');
				a.volume = 0.17;
			} else if (e === 'pong-sound-3') {
				a = new Audio('/audio/pong-sound-3.wav');
				a.volume = 0.1;
			}
			if (a) {
				a.play()
					.then()
					.catch(() => {});
			}
		};

		socket.on('gameResults', data => gameResultsHandler(data));
		socket.on('gameLoop', data => gameLoopHandler(data));
		socket.on('gameScore', data => gameScoreHandler(data));
		socket.on('playSound', data => playSoundHandler(data));
		console.log('[GameCanvas] socket listeners added');

	}, [ball, leftPlayer, rightPlayer, score, socket]);

	const playerWidth = gameSettingsRef.current?.playerWidth || 15;
	const playerMargin = gameSettingsRef.current?.playerMargin || 15;
	const playerHeight = gameSettingsRef.current?.playerHeight || 100;

	useEffect(() => {
		if (watchMode)
			return ;

		const keyDownHandler = (e: KeyboardEvent) => {
			const gameSettings = gameSettingsRef.current;
			if (!gameSettings)
				return ;

			let currentPlayer;
			if (currentUser.username === leftPlayer.username)
				currentPlayer = leftPlayer;
			else if (currentUser.username === rightPlayer.username)
				currentPlayer = rightPlayer;
			else
				return ;

			if (['ArrowDown', 'ArrowUp'].indexOf(e.key) !== -1) {
				if (e.key === 'ArrowDown' && currentPlayer.controls.arrowDown)
					return ;
				if (e.key === 'ArrowUp' && currentPlayer.controls.arrowUp)
					return ;
				const data = {
					login: currentUser.username,
					gameId: gameSettingsRef.current?.id,
					key: e.key
				};
				socket.emit('keyDown', JSON.stringify(data));
				if (e.key === 'ArrowDown')
					currentPlayer.controls.arrowDown = true;
				else if (e.key === 'ArrowUp')
					currentPlayer.controls.arrowUp = true;
			}
		};

		const keyUpHandler = (e: KeyboardEvent) => {
			const gameSettings = gameSettingsRef.current;
			if (!gameSettings)
				return ;

			let currentPlayer;
			if (currentUser.username === leftPlayer.username)
				currentPlayer = leftPlayer;
			else if (currentUser.username === rightPlayer.username)
				currentPlayer = rightPlayer;
			else
				return ;

			if (['ArrowDown', 'ArrowUp'].indexOf(e.key) !== -1) {
				const data = {
					login: currentUser.username,
					gameId: gameSettingsRef.current?.id,
					key: e.key
				};
				socket.emit('keyUp', JSON.stringify(data));
				if (e.key === 'ArrowDown')
					currentPlayer.controls.arrowDown = false;
				else if (e.key === 'ArrowUp')
					currentPlayer.controls.arrowUp = false;
			}
		};

		document.addEventListener('keydown', keyDownHandler);
		document.addEventListener('keyup', keyUpHandler);
		return () => {
			document.removeEventListener('keydown', keyDownHandler);
			document.removeEventListener('keyup', keyUpHandler);
		};
	}, []);

	useEffect(() => {
		let gameRuns = true;

		const drawBackground = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
			ctx.beginPath();
			ctx.fillStyle = '#111';
			ctx.rect(0, 0, canvas.width, canvas.height);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#ccc';
			const dividerCount = 25;
			const dividerWidth = 5;
			const dividerSpace = 15;
			const dividerHeight = (canvas.height - dividerSpace * (dividerCount - 1)) / dividerCount;
			for (let i = 0; i < canvas.height; i += dividerHeight + 15)
				ctx.rect((canvas.width - dividerWidth) / 2, i, dividerWidth, dividerHeight);
			ctx.fill();
			ctx.closePath();
		};

		const drawLeftRectangle = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
			ctx.rect(playerMargin, leftPlayer.yPosition, playerWidth, playerHeight);
			ctx.fill();
		};

		const putScore = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
			ctx.beginPath();
			ctx.fillStyle = '#fff';
			ctx.font = '42px \'Press Start 2P\', cursive';
			ctx.textAlign = 'right';
			ctx.fillText(`${score.leftPlayer}`, canvas.width / 2 - 50, 70, 100);
			ctx.textAlign = 'left';
			ctx.fillText(`${score.rightPlayer}`, canvas.width / 2 + 50, 70, 100);
			ctx.closePath();
		};

		const drawRightRectangle = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
			ctx.rect(canvas.width - playerWidth - playerMargin, rightPlayer.yPosition, playerWidth, playerHeight);
			ctx.fill();
		};

		const drawBall = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
			ctx.rect(ball.xPosition, ball.yPosition, ball.size, ball.size);
			ctx.fill();
		};

		const render = () => {
			const canvas = canvasRef.current;
			if (!canvas) {
				console.log('[render] cannot get canvas');
				return ;
			}
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				console.log('[render] cannot get ctx');
				return ;
			}

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			drawBackground(canvas, ctx);
			putScore(canvas, ctx);

			ctx.beginPath();
			ctx.fillStyle = '#29aa44';
			drawLeftRectangle(canvas, ctx);
			drawRightRectangle(canvas, ctx);
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#fff';
			drawBall(canvas, ctx);
			ctx.closePath();
		};

		const runGame = () => {
			console.log('!!! [runGame] !!!');
			let fpsInterval: number, now: number, then: number, elapsed: number;
			const fps = 60;

			const animate = () => {
				if (!gameRuns)
					return ;

				requestAnimationFrame(animate);
				now = Date.now();
				elapsed = now - then;
				if (elapsed > fpsInterval) {
					then = now - (elapsed % fpsInterval);
					render();
				}
			};

			fpsInterval = 1000 / fps;
			then = Date.now();
			animate();
		};

		const prepareGame = () => {
			const canvas = canvasRef.current;
			if (!canvas)
				return ;

			const gameSettings = gameSettingsRef.current;
			if (!gameSettings)
				return ;

			ball.angle = 0;
			ball.speed = gameSettings.ballSpeed;
			ball.size = gameSettings.ballSize;
			ball.xPosition = -ball.size;
			ball.yPosition = 0;
			leftPlayer.yPosition = Math.round((canvas.height - playerHeight) / 2);
			rightPlayer.yPosition = Math.round((canvas.height - playerHeight) / 2);
			leftPlayer.username = gameSettings.leftPlayer.login;
			rightPlayer.username = gameSettings.rightPlayer.login;

			render();
		};

		prepareGame();

		// if (!gameRef.current.runs)
			runGame();

		return () => {
			gameRuns = false;
			console.log('[GameCanvas] cleanup');
		};
	}, []);

	return (
		<div className='game-container'>
			<div className='info-board'>
				<Link to={ `/users/${gameSettingsRef.current?.leftPlayer.login}` } className='info-board-user info-board-left-user'>
					<div
						className='info-board-user-img'
						style={ { backgroundImage: `url(${ gameSettingsRef.current?.leftPlayer.url_avatar })` } }
					/>
					<div className='info-board-user-name'>{ gameSettingsRef.current?.leftPlayer.login }</div>
				</Link>
				<Link to={ `/users/${gameSettingsRef.current?.rightPlayer.login}` } className='info-board-user info-board-right-user'>
					<div className='info-board-user-name'>{ gameSettingsRef.current?.rightPlayer.login }</div>
					<div
						className='info-board-user-img'
						style={ { backgroundImage: `url(${ gameSettingsRef.current?.rightPlayer.url_avatar })` } }
					/>
				</Link>
			</div>
			<canvas
				id="game-canvas"
				width="1024px"
				height="600px"
				ref={ canvasRef }
			/>
			{
				gameResults &&
					<Fade
						className='game-results-wrapper'
						duration={ 500 }
					>
						<GameResults
							winner={ gameResults.winner }
							loser={
								(gameResults.winner === gameSettingsRef.current?.leftPlayer.login
								? gameSettingsRef.current?.rightPlayer.login
								: gameSettingsRef.current?.leftPlayer.login) || ''
							}
							gameRef={ gameRef }
							setStatus={ setStatus }
						/>
					</Fade>
			}
		</div>
	);
};

export default GameCanvas;
