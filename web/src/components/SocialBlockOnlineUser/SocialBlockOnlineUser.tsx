import { faTv } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useHistory } from "react-router-dom";

import { getWatchGame } from "../../api/social";
import { ApiUpdateUser, ApiUserStatus } from "../../models/ApiTypes";

interface SocialBlockOnlineUserProps {
	user: ApiUpdateUser;
}

export const SocialBlockOnlineUser = ({ user }: SocialBlockOnlineUserProps) => {
	const history = useHistory();
	let statusDescription: string | JSX.Element;
	let statusColor: string;

	if (user.status === ApiUserStatus.Regular) statusDescription = 'In main menu';
	else if (user.status === ApiUserStatus.InGame)
		statusDescription = (
			<div>
				<span>In game</span>
				<button
					title="Watch game"
					className="social-block-user-watch-btn"
					onClick={async () => {
						await getWatchGame(user.login).
						finally(() => history.push('/game'));
						// await axios.get('/games/watchGame', {
						// 	params: { gamerLogin: user.login },
						// 	headers: { Authorization: `Bearer ${getToken()}` },
						// });
						// history.push('/game');
					}}
				>
					<FontAwesomeIcon icon={faTv} />
				</button>
			</div>
		);
	else if (user.status === ApiUserStatus.Offline) statusDescription = 'Offline';
	else statusDescription = 'Searching game';

	if (user.status === ApiUserStatus.InGame) statusColor = 'purple';
	else if (user.status === ApiUserStatus.Offline) statusColor = 'transparent';
	else statusColor = user.status;

	return (
		<li className="social-block-user">
			<div className="social-block-user-img" style={{ backgroundImage: `url(${user.url_avatar})` }}>
				<div className="user-status" style={{ backgroundColor: statusColor }} />
			</div>
			<Link to={`/users/${user.login}`} className="social-block-user-username">
				{user.login}
			</Link>
			<div className="social-block-user-status-description">{statusDescription}</div>
		</li>
	);
};