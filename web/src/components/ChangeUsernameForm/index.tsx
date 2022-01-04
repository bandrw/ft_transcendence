import React from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import * as EditUser from "../../api/editUser";
import { useAppSelector } from "../../hook/reduxHooks";
import { getTargetUser } from "../../utils/getTargetUser";

const TextInput = styled.input`
	margin: 10px 0;
	font-size: 1em;
	background: none;
	outline: none;
	color: white;
	padding: 10px 25px;
	border: 1px solid #2c3e50;
	border-radius: 15px;
	transition: all 0.1s ease-in;

	&::selection {
		background: #29aa44;
	}

	&:focus {
		border-color: #29aa44;
	}
`;

interface ChangeUsernameType {
	newUsername: string;
}

export const ChangeUsernameForm = () => {
	const history = useHistory();
	const { socket } = useAppSelector((state) => state.socket);
	const { allUsers } = useAppSelector((state) => state.allUsers);
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { register, handleSubmit } = useForm<ChangeUsernameType>();
	const [usernameInput, setUsernameInput] = React.useState<string>(currentUser.username);

	const usernameIsValid = () => {
		return !(
			usernameInput.length < 4 ||
			usernameInput.length > 16 ||
			getTargetUser(allUsers, usernameInput, 'login')
			// allUsers.find((usr) => usr.login === usernameInput)
		);
	};

	const changeUsername = ({ newUsername }: ChangeUsernameType) => {
		if (!usernameIsValid()) return;

		EditUser.updateUserName(newUsername, socket.id)
			.then(() => history.push(`/users/${newUsername}`));
	};

	return (
		<form onSubmit={handleSubmit(changeUsername)}>
			<p>Change username</p>
			<TextInput
				type="text"
				{...register('newUsername')}
				placeholder="Enter new username"
				defaultValue={currentUser.username}
				onChange={(e) => setUsernameInput(e.target.value)}
				required
			/>
			<button className="edit-window-btn" type="submit" disabled={!usernameIsValid()}>
				Save
			</button>
		</form>
	);
};