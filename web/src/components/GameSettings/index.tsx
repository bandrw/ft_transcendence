import GamePreview from "components/GameSettings/GamePreview";
import React from "react";
import { HexColorPicker } from "react-colorful";
import styled from "styled-components";

const SettingsForm = styled.form`
	position: absolute;
	top: -150px;
	left: calc(100% + 100px);
	background: #2c2f3a;
	padding: 20px 40px;
	box-sizing: border-box;
	width: 450px;
	border-radius: 18px;
	box-shadow: 0 0 20px #1a1b1f;
	display: flex;
	flex-direction: column;
	align-content: center;
	justify-content: center;
`;

const Section = styled.section`
	margin-top: 10px;
	margin-bottom: 40px;

	.react-colorful {
		height: 150px;
		width: 150px;
	}
	.react-colorful__hue {
		height: 20px;
	}
	.react-colorful__hue-pointer, 
	.react-colorful__saturation-pointer {
		width: 18px;
		height: 18px;
	}
`;

const SectionName = styled.p`
	text-align: left;
	font-size: 20px;
	margin-bottom: 15px;
	font-weight: bold;
	position: relative;
	width: -moz-fit-content;
	width: fit-content;
	
	&::selection {
		background-color: #29aa44;
	}
`;

const SettingsLine = styled.div`
	display: flex;
	justify-content: space-between;
`;

const ColorPicker = styled.div`
	p {
		margin-bottom: 5px;
		text-align: left;
		padding-left: 5px;
		color: #eee;
		
		&::selection {
			background-color: #29aa44;
		}
	}
`;

const ResetButton = styled.button`
	font-size: 1em;
	padding: 10px 0;
	border-radius: 15px;
	cursor: pointer;
	font-weight: bold;
	background: none;
	border: 2px solid #29aa44;
	outline: none;
	color: #29aa44;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.05s ease-in;
	&::selection {
		background: #2c3e50;
	}
	&:hover {
		background: #21b941;
		color: white;
	}
	&:active {
		opacity: 0.8;
	}
	&:disabled {
		opacity: 0.8;
		cursor: not-allowed;
		&:hover {
			background: #29aa44;
		}
	}
`;

const BallTypePicker = styled.div`
	display: flex;
	width: 150px;
	justify-content: space-around;
	align-items: center;
`;

const RectanglePreview = styled.div`
	width: 20px;
	height: 20px;
	background: #aaa;
`;

const CirclePreview = styled.div`
	width: 20px;
	height: 20px;
	background: #aaa;
	border-radius: 50%;
`;

const BallTypeButton = styled.button<{isActive: boolean}>`
	width: 50px;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${(props) => props.isActive ? '#373c4f' : 'none'};
	outline: none;
	border: none;
	font-size: 24px;
	color: #aaa;
	cursor: pointer;
	transition: all 0.1s ease-in-out;
	border-radius: 10px;

	&:hover {
		background: #373c4f;
	}

	&:active {
		opacity: 0.8;
	}
`;

/**
 * Returns user's paddle color from localStorage, or default value - #29aa44
 */
export const getUserColor = () => {
	return localStorage.getItem('userPaddleColor') || '#29aa44';
};

/**
 * Returns enemy's paddle color from localStorage, or default value - #aa0000
 */
export const getEnemyColor = () => {
	return localStorage.getItem('enemyPaddleColor') || '#29aa44';
};

/**
 * Returns ball color from localStorage, or default value - #ffffff
 */
export const getBallColor = () => {
	return localStorage.getItem('ballColor') || '#ffffff';
};

export enum BallType {
	Square = 'square',
	Circle = 'circle'
}

/**
 * Returns ball type from localStorage, or default value - BallType.Square
 */
export const getBallType = (): BallType => {
	return localStorage.getItem('ballType') as BallType || BallType.Square;
};

const GameSettings = () => {
	const [enemyColor, setEnemyColor] = React.useState<string>(getEnemyColor());
	const [userColor, setUserColor] = React.useState<string>(getUserColor());
	const [ballColor, setBallColor] = React.useState<string>(getBallColor());
	const [ballType, setBallType] = React.useState<BallType>(getBallType());

	const saveSettings = React.useCallback(() => {
		localStorage.setItem('userPaddleColor', userColor);
		localStorage.setItem('enemyPaddleColor', enemyColor);
		localStorage.setItem('ballColor', ballColor);
		localStorage.setItem('ballType', ballType);
	}, [ballColor, ballType, enemyColor, userColor]);

	const resetToDefaults = () => {
		localStorage.removeItem('userPaddleColor');
		localStorage.removeItem('enemyPaddleColor');
		localStorage.removeItem('ballColor');
		localStorage.removeItem('ballType');
		setEnemyColor(getEnemyColor());
		setUserColor(getUserColor());
		setBallColor(getBallColor());
		setBallType(BallType.Square);
	};

	// Saving settings
	React.useEffect(() => {
		return () => {
			saveSettings();
		};
	}, [saveSettings]);

	return (
		<SettingsForm
			onSubmit={(e) => e.preventDefault()}
			onClick={(e) => e.stopPropagation()}
		>
			<Section>
				<SectionName>Paddle</SectionName>
				<SettingsLine>
					<ColorPicker>
						<p>Yours</p>
						<HexColorPicker color={userColor} onChange={setUserColor}/>
					</ColorPicker>
					<ColorPicker>
						<p>{'Enemy\'s'}</p>
						<HexColorPicker color={enemyColor} onChange={setEnemyColor}/>
					</ColorPicker>
				</SettingsLine>
			</Section>
			<Section>
				<SectionName>Ball</SectionName>
				<SettingsLine>
					<BallTypePicker>
						<BallTypeButton onClick={() => setBallType(BallType.Square)} isActive={ballType === BallType.Square}>
							<RectanglePreview/>
						</BallTypeButton>
						<BallTypeButton onClick={() => setBallType(BallType.Circle)} isActive={ballType === BallType.Circle}>
							<CirclePreview/>
						</BallTypeButton>
					</BallTypePicker>
					<HexColorPicker color={ballColor} onChange={setBallColor}/>
				</SettingsLine>
			</Section>
			<GamePreview
				userColor={userColor}
				enemyColor={enemyColor}
				ballColor={ballColor}
				ballType={ballType}
			/>
			<ResetButton onClick={resetToDefaults}>
				Reset to defaults
			</ResetButton>
		</SettingsForm>
	);
};

export default GameSettings;
