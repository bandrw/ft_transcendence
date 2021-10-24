import './styles.scss';

import { SocketContext } from "context/socket";
import { GameLoop, UpdateUser } from "models/apiTypes";
import GameBall from "models/GameBall";
import Player from "models/Player";
import { User } from "models/User";
import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { clearInterval, setInterval } from "timers";

interface GameProps {
	enemyInfo: UpdateUser | null,
	currentUser: User,
	gameLoopRef: React.MutableRefObject<GameLoop>,
	gameIdRef: React.MutableRefObject<number | null>,
	eventSourceRef: React.MutableRefObject<EventSource | null>
}

const Game = ({ enemyInfo, currentUser, gameLoopRef, gameIdRef, eventSourceRef }: GameProps) => {
	const history = useHistory();

	React.useEffect(() => {
		if (!enemyInfo)
			history.push('/');
	}, [history, enemyInfo]);

	const [infoBoardContent, setInfoBoardContent] = React.useState<JSX.Element>(<div>Welcome to the game!</div>);
	const score = { leftPlayer: 0, rightPlayer: 0 };
	const controls = {
		arrowDown: false,
		arrowUp: false
	};

	const gameLoopHandler = (e: any) => {
		gameLoopRef.current = JSON.parse(e.data);
	};

	const gameScoreHandler = (e: any) => {
		const data = JSON.parse(e.data);
		score.leftPlayer = data.leftPlayer;
		score.rightPlayer = data.rightPlayer;
	};

	const playSoundHandler = (e: any) => {
		let a: HTMLAudioElement | null = null;
		if (e.data === 'pong-sound-1') {
			a = new Audio('/audio/pong-sound-1.wav');
			a.volume = 0.17;
		} else if (e.data === 'pong-sound-2') {
			a = new Audio('/audio/pong-sound-2.wav');
			a.volume = 0.17;
		} else if (e.data === 'pong-sound-3') {
			a = new Audio('/audio/pong-sound-3.wav');
			a.volume = 0.1;
		}
		if (a) {
			a.play()
				.then()
				.catch(() => console.log('audio play error'));
		}
	};

	React.useEffect(() => {
		const eventSource = eventSourceRef.current;
		if (!eventSource)
			return ;

		eventSource.addEventListener('gameLoop', gameLoopHandler);
		eventSource.addEventListener('gameScore', gameScoreHandler);
		eventSource.addEventListener('playSound', playSoundHandler);
		console.log('[Game] eventSource listeners added');

		return () => {
			eventSource.removeEventListener('gameLoop', gameLoopHandler);
			eventSource.removeEventListener('gameScore', gameScoreHandler);
			eventSource.removeEventListener('playSound', playSoundHandler);
			console.log('[Game] eventSource listeners removed');
		};
	}, [eventSourceRef]);

	const socket = React.useContext(SocketContext);
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const player = new Player();
	const enemy = new Player();
	const ball = new GameBall();

	const playerWidth = 15;
	const playerMargin = 15;
	const playerHeight = 150;

	const drawBackground = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
		ctx.beginPath();
		ctx.fillStyle = '#000';
		ctx.rect(0, 0, canvas.width, canvas.height);
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
		ctx.rect(playerMargin, player.yPosition, playerWidth, playerHeight);
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
		ctx.rect(canvas.width - playerWidth - playerMargin, enemy.yPosition, playerWidth, playerHeight);
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

	const prepareGame = () => {
		const canvas = canvasRef.current;
		if (!canvas)
			return ;
		player.yPosition = Math.round((canvas.height - playerHeight) / 2);
		enemy.yPosition = Math.round((canvas.height - playerHeight) / 2);
		ball.xPosition = -ball.size;
		ball.yPosition = 0;
		ball.angle = 2 * Math.PI * Math.random();

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
			if (e.key === 'ArrowDown' && controls.arrowDown)
				return ;
			if (e.key === 'ArrowUp' && controls.arrowUp)
				return ;
			const data = {
				login: currentUser.username,
				gameId: gameIdRef.current,
				key: e.key
			};
			socket.emit('keyDown', JSON.stringify(data));
			if (e.key === 'ArrowDown')
				controls.arrowDown = true;
			else if (e.key === 'ArrowUp')
				controls.arrowUp = true;
		}
	};

	const keyUpHandler = (e: KeyboardEvent) => {
		if (['ArrowDown', 'ArrowUp'].indexOf(e.key) !== -1) {
			const data = {
				login: currentUser.username,
				gameId: gameIdRef.current,
				key: e.key
			};
			socket.emit('keyUp', JSON.stringify(data));
			if (e.key === 'ArrowDown')
				controls.arrowDown = false;
			else if (e.key === 'ArrowUp')
				controls.arrowUp = false;
		}
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
			if (timeUntilStart === 0 && enemyInfo) {
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
	}, [currentUser.username, enemyInfo]);

	return (
		<div className='game-container'>
			<div className='info-board'>
				{infoBoardContent}
			</div>
			<canvas
				id="game-canvas"
				width="1024px"
				height="600px"
				ref={canvasRef}
			/>
		</div>
	);
};

export default Game;
