import './styles.scss'

import axios from "axios";
import React from 'react';

import { User } from "../../../models/User";

interface FindGameProps {
	currentUser: User
}

const FindGame = (props: FindGameProps) => {
	const findGame = () => {
		axios.get('/ladder/gameStatus', {
			params: {
				login: props.currentUser.username,
				status: 'yellow'
			}
		})
			.then(r => console.log(r))
	}

	return (
		<button onClick={findGame}>Find game</button>
	)
}

export default FindGame;
