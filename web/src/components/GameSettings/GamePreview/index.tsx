import { BallType } from "components/GameSettings";
import styled from "styled-components";

const Game = styled.div`
	border: 1px solid white;
	margin-bottom: 40px;
	width: 370px;
	height: 217px; // (width / 1.7)
	border-radius: 15px;
	background: black;
	position: relative;
`;

const Paddle = styled.div`
	position: absolute;
	top: 50%;
	left: 9px;
	transform: translateY(-50%);
	width: 9px;
	height: 59px;
	background: ${(props) => props.color || '#29aa44'};
`;

const EnemyPaddle = styled(Paddle)`
	right: 9px;
	left: initial;
`;

const Ball = styled.div<{color: string}>`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: ${(props) => props.color || '#ffffff'};
	width: 9px;
	height: 9px;
`;

const BallCircle = styled(Ball)`
	border-radius: 50%;
`;

interface GamePreviewProps {
	userColor: string;
	enemyColor: string;
	ballColor: string;
	ballType: BallType;
}

const GamePreview = ({ userColor, enemyColor, ballColor, ballType }: GamePreviewProps) => {
	return (
		<Game>
			<Paddle color={userColor}/>
			<EnemyPaddle color={enemyColor}/>
			{ballType === BallType.Square && (
				<Ball color={ballColor}/>
			)}
			{ballType === BallType.Circle && (
				<BallCircle color={ballColor}/>
			)}
		</Game>
	);
};

export default GamePreview;
