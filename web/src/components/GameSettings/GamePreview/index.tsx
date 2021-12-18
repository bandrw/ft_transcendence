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
	background: #29aa44;
`;

const EnemyPaddle = styled(Paddle)`
	right: 9px;
	left: initial;
`;

const Ball = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: white;
	width: 9px;
	height: 9px;
`;

const GamePreview = () => {
	return (
		<Game>
			<Paddle/>
			<EnemyPaddle/>
			<Ball/>
		</Game>
	);
};

export default GamePreview;
