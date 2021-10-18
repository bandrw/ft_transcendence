import './styles.scss';

import { UserStatus } from "apiTypes/apiTypes";
import Game from "components/Game";
import Header from "components/Header";
import { User } from "models/User";
import FindGame from "pages/Main/FindGame";
import React from 'react';
import { useHistory } from "react-router-dom";

interface MainProps {
	currentUser: User,
	setCurrentUser: React.Dispatch<React.SetStateAction<User> >,
	status: UserStatus,
	setStatus: React.Dispatch<React.SetStateAction<UserStatus> >
}

const Main = ({ currentUser, setCurrentUser, status, setStatus }: MainProps) => {
	const history = useHistory();

	React.useEffect(() => {
		if (!currentUser.isAuthorized())
			history.push('/login');
	}, [history, currentUser]);

	return (
		<div className='main-container'>
			<Header
				currentUser={currentUser}
				setCurrentUser={setCurrentUser}
				status={status}
			/>
			{
				status !== UserStatus.InGame
					?	<FindGame
							currentUser={currentUser}
							status={status}
							setStatus={setStatus}
						/>
					:	<div className='main-tmp'>
							<Game
								currentUser={currentUser}
								setCurrentUser={setCurrentUser}
							/>
						</div>
			}
		</div>
	);
};

export default Main;
