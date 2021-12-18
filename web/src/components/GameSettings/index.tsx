import GamePreview from "components/GameSettings/GamePreview";
import React from "react";
import styled from "styled-components";

const SettingsForm = styled.form`
	position: absolute;
	top: calc(100% + 15px);
	left: 50%;
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

const SaveButton = styled.button`
	font-size: 1em;
	padding: 10px 0;
	border-radius: 15px;
	cursor: pointer;
	font-weight: bold;
	background: #29aa44;
	border: none;
	outline: none;
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: all 0.05s ease-in;

	&::selection {
		background: #2c3e50;
	}
	&:hover {
		background: #21b941;
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

const GameSettings = () => {
	const [enemyColor, setEnemyColor] = React.useState('#aa0000');
	const [userColor, setUserColor] = React.useState('#29aa44');

	const saveSettings = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<SettingsForm
			onSubmit={saveSettings}
			onClick={(e) => e.stopPropagation()}
		>
			<Section>
				<SectionName>Paddle color</SectionName>
				<input placeholder='yours'/>
				<input placeholder={'enemy\'s'}/>
			</Section>
			<Section>
				<SectionName>Maybe background?</SectionName>
				<input placeholder='Some background input' disabled/>
			</Section>
			<GamePreview/>
			<SaveButton type='submit'>
				Save
			</SaveButton>
		</SettingsForm>
	);
};

export default GameSettings;
