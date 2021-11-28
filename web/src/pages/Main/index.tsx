import './styles.scss';

import { useAppSelector } from "app/hooks";
import Header from "components/Header";
import { SocketContext } from "context/socket";
import { ApiUpdateUser, ApiUserStatus } from "models/apiTypes";
import FindGame from "pages/Main/FindGame";
import Messenger from "pages/Main/Messenger";
import RecentGames from "pages/Main/RecentGames";
import Social from "pages/Main/Social";
import React from 'react';
import { Fade } from 'react-awesome-reveal';
import { useHistory } from "react-router-dom";

interface MainProps {
	status: ApiUserStatus,
	setStatus: React.Dispatch<React.SetStateAction<ApiUserStatus>>,
	enemyRef: React.MutableRefObject<ApiUpdateUser | null>,
	onlineUsers: ApiUpdateUser[],
	enemyIsReady: boolean
}

const Main: React.FC<MainProps> = ({
																		 status,
																		 setStatus,
																		 enemyRef,
																		 onlineUsers,
																		 enemyIsReady
	}) => {
	const history = useHistory();
	const socket = React.useContext(SocketContext);
	const { currentUser } = useAppSelector(state => state.currentUser);

	// Redirect to /game
	React.useEffect(() => {
		if (status === ApiUserStatus.InGame)
			history.push('/game');
	});

	if (!currentUser.isAuthorized())
		return (
			<div className='main'>
				<div className='main-container'>
					<Header
						status={ status }
					/>
					<div>[TMP] Authorizing { socket.id ? '...' : '[No socket]' }</div>
				</div>
			</div>
		);

	return (
		<div className='main'>
			<div className='main-container'>
				<Header
					status={ status }
				/>
				<div className='main-top'>
					<div className='main-center'>
						<Fade
							triggerOnce={ true }
							style={ { position: 'relative', zIndex: 9 } }
						>
							<FindGame
								currentUser={ currentUser }
								status={ status }
								setStatus={ setStatus }
								enemyRef={ enemyRef }
								enemyIsReady={ enemyIsReady }
							/>
						</Fade>
						<Fade
							delay={ 100 }
							triggerOnce={ true }
							style={ { position: 'relative', zIndex: 8 } }
						>
							<RecentGames/>
						</Fade>
					</div>
					<div className='main-right'>
						<Fade
							delay={ 100 }
							triggerOnce={ true }
							className='main-block social'
						>
							<Social
								onlineUsers={ onlineUsers.filter(usr => usr.login !== currentUser.username) }
							/>
						</Fade>
					</div>
				</div>
				<Fade
					delay={ 400 }
					triggerOnce={ true }
				>
					<Messenger/>
				</Fade>
			</div>
		</div>
	);
};

export default Main;
