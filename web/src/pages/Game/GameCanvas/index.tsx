import './styles.scss';

import { SocketContext } from "context/socket";
import { ApiGameLoop, ApiGameSettings, ApiUpdateUser, ApiUserStatus } from "models/apiTypes";
import GameBall from "models/GameBall";
import Player from "models/Player";
import { User } from "models/User";
import GameResults from "pages/Game/GameResults";
import React, { useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import { setInterval } from "timers";

interface GameCanvasProps {
	enemyInfo: ApiUpdateUser | null,
	currentUser: User,
	eventSourceRef: React.MutableRefObject<EventSource | null>,
	gameSettingsRef: React.MutableRefObject<ApiGameSettings | null>,
	gameRef: React.MutableRefObject<{ runs: boolean, interval: null | NodeJS.Timeout }>,
	setStatus: React.Dispatch<React.SetStateAction<ApiUserStatus>>
}

const GameCanvas = ({ enemyInfo, currentUser, eventSourceRef, gameSettingsRef, gameRef, setStatus }: GameCanvasProps) => {
	const socket = React.useContext(SocketContext);
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const leftPlayer = new Player();
	const rightPlayer = new Player();
	const ball = new GameBall();

	const score = { leftPlayer: 0, rightPlayer: 0 };

	const [gameResults, setGameResults] = React.useState<{ winner: string } | null>(null);
	const [leftPlayerImg, setLeftPlayerImg]  = React.useState('');
	const [rightPlayerImg, setRightPlayerImg]  = React.useState('');

	React.useEffect(() => {
		if (gameRef.current.runs)
			return ;

		const eventSource = eventSourceRef.current;
		if (!eventSource)
			return ;

		const gameResultsHandler = (e: any) => {
			const data: { winner: string } = JSON.parse(e.data);
			setGameResults(data);
		};

		const gameLoopHandler = (e: any) => {
			const gameSettings = gameSettingsRef.current;
			if (!gameSettings)
				return ;

			const data: ApiGameLoop = JSON.parse(e.data);
			if (data.b) {
				ball.xPosition = data.b.x;
				ball.yPosition = data.b.y;
			}
			if (data.lP)
				leftPlayer.yPosition = data.lP.y;
			if (data.rP)
				rightPlayer.yPosition = data.rP.y;
		};

		const gameScoreHandler = (e: any) => {
			const data = JSON.parse(e.data);
			score.leftPlayer = data.leftPlayer;
			score.rightPlayer = data.rightPlayer;
		};

		const playSoundHandler = (e: any) => {
			// let a: HTMLAudioElement | null = null;
			// if (e.data === 'pong-sound-1') {
			// 	a = new Audio('/audio/pong-sound-1.wav');
			// 	a.volume = 0.17;
			// } else if (e.data === 'pong-sound-2') {
			// 	a = new Audio('/audio/pong-sound-2.wav');
			// 	a.volume = 0.17;
			// } else if (e.data === 'pong-sound-3') {
			// 	a = new Audio('/audio/pong-sound-3.wav');
			// 	a.volume = 0.1;
			// }
			// if (a) {
			// 	a.play()
			// 		.then()
			// 		.catch(() => console.log('audio play error'));
			// }
		};

		eventSource.addEventListener('gameResults', gameResultsHandler);
		eventSource.addEventListener('gameLoop', gameLoopHandler);
		eventSource.addEventListener('gameScore', gameScoreHandler);
		eventSource.addEventListener('playSound', playSoundHandler);
		console.log('[Game] eventSource listeners added');

		// return () => {
		// 	// if (gameCpy.runs)
		// 	// 	return ;
		//
		// 	eventSource.removeEventListener('gameResults', gameResultsHandler);
		// 	eventSource.removeEventListener('gameLoop', gameLoopHandler);
		// 	eventSource.removeEventListener('gameScore', gameScoreHandler);
		// 	eventSource.removeEventListener('playSound', playSoundHandler);
		// 	console.log('[Game] eventSource listeners removed');
		// };
	});

	// const playerWidth = 15;
	// const playerMargin = 15;
	// const playerHeight = 150;
	const playerWidth = gameSettingsRef.current?.playerWidth || 15;
	const playerMargin = gameSettingsRef.current?.playerMargin || 15;
	const playerHeight = gameSettingsRef.current?.playerHeight || 100;

	useEffect(() => {
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
	});

	useEffect(() => {
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

		const drawUserRectangle = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
			if (leftPlayer.username === currentUser.username)
				ctx.rect(playerMargin, leftPlayer.yPosition, playerWidth, playerHeight);
			else if (rightPlayer.username === currentUser.username)
				ctx.rect(canvas.width - playerWidth - playerMargin, rightPlayer.yPosition, playerWidth, playerHeight);
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

		const drawEnemyRectangle = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
			if (leftPlayer.username === currentUser.username)
				ctx.rect(canvas.width - playerWidth - playerMargin, rightPlayer.yPosition, playerWidth, playerHeight);
			else if (rightPlayer.username === currentUser.username)
				ctx.rect(playerMargin, leftPlayer.yPosition, playerWidth, playerHeight);
			ctx.fill();
		};

		const drawBall = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
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

			drawBackground(canvas, ctx);
			putScore(canvas, ctx);

			ctx.beginPath();
			ctx.fillStyle = '#29aa44';
			drawUserRectangle(canvas, ctx);
			drawEnemyRectangle(canvas, ctx);
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = '#fff';
			drawBall(canvas, ctx);
			ctx.closePath();
		};

		const runGame = () => {
			const fps = 60;
			gameRef.current.interval = setInterval(render, 1000 / fps);
			gameRef.current.runs = true;
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
			leftPlayer.username = gameSettings.leftPlayerUsername;
			rightPlayer.username = gameSettings.rightPlayerUsername;

			if (leftPlayer.username === enemyInfo?.login) {
				setLeftPlayerImg(enemyInfo?.url_avatar);
				setRightPlayerImg(currentUser.urlAvatar);
			} else {
				setLeftPlayerImg(currentUser.urlAvatar);
				setRightPlayerImg(enemyInfo?.url_avatar || '');
			}

			render();
		};

		prepareGame();

		let timeUntilStart = 3;
		// setInfoBoardContent(<div className='info-board-timer'>{timeUntilStart}</div>);
		// const interval = setInterval(() => {
		// 	--timeUntilStart;
		// 	if (timeUntilStart === 0 && enemyInfo) {
		// 		setInfoBoardContent(<div/>);
		// 		runGame();
		// 		clearInterval(interval);
		// 	} else {
		// 		setInfoBoardContent(<div>{timeUntilStart}</div>);
		// 	}
		// }, 1000);

		if (!gameRef.current.runs)
			setTimeout(runGame, timeUntilStart * 1000);

		// return () => {
		// 	if (gameRef.current.runs && gameRef.current.interval) {
		// 		clearInterval(gameRef.current.interval);
		// 		gameRef.current.runs = false;
		// 		console.log('[GameCanvas] interval cleared');
		// 	}
		// };
	});

	return (
		<div className='game-container'>
			<div className='info-board'>
				<div className='info-board-user info-board-left-user'>
					<div
						className='info-board-user-img'
						style={{ backgroundImage: `url(${leftPlayerImg})` }}
					/>
					<div className='info-board-user-name'>{gameSettingsRef.current?.leftPlayerUsername}</div>
				</div>
				<div className='info-board-user info-board-right-user'>
					<div className='info-board-user-name'>{gameSettingsRef.current?.rightPlayerUsername}</div>
					<div
						className='info-board-user-img'
						style={{ backgroundImage: `url(${rightPlayerImg})` }}
					/>
				</div>
			</div>
			<canvas
				id="game-canvas"
				width="1024px"
				height="600px"
				ref={canvasRef}
			/>
			{
				gameResults &&
					<Fade
						className='game-results-wrapper'
						duration={500}
					>
						<GameResults
							winner={gameResults.winner}
							loser={
								(gameResults.winner === gameSettingsRef.current?.leftPlayerUsername
								? gameSettingsRef.current?.rightPlayerUsername
								: gameSettingsRef.current?.leftPlayerUsername) || ''
							}
							gameRef={gameRef}
							setStatus={setStatus}
						/>
					</Fade>
			}
		</div>
	);
};

export default GameCanvas;
