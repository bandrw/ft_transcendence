import "./styles.scss";

import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "hook/reduxHooks";
import { ApiUserExpand, ApiUserStatus } from "models/ApiTypes";
import React from "react";
import { Link } from "react-router-dom";

interface FriendsListProps {
	friends: ApiUserExpand[];
}

const getStatusDescription = (status: ApiUserStatus) => {
	if (status === ApiUserStatus.Regular)
		return 'Online';

	if (status === ApiUserStatus.Offline)
		return 'Offline';

	if (status === ApiUserStatus.Searching || status === ApiUserStatus.FoundEnemy || status === ApiUserStatus.Accepted)
		return 'Searching game';

	if (status === ApiUserStatus.InGame)
		return 'In game';

	return '';
};

const FriendsList = ({ friends }: FriendsListProps) => {
	const { onlineUsers } = useAppSelector((state) => state.onlineUsers);

	return (
		<div className="list-section">
			<div className="list-section-title">
				<p>Friends</p>
			</div>
			{friends.length === 0 ? (
				<div className="list-section-list">
					<div className="list-section-empty">
						No friends yet
						<FontAwesomeIcon icon={faUserFriends} />
					</div>
				</div>
			) : (
				<div className="list-section-list friends-list">
					{friends.map((friend) => {
						let statusColor = 'transparent';
						let statusDescription = 'Offline';
						const user = onlineUsers.find((usr) => usr.id === friend.id);

						if (user) {
							statusColor = user.status;
							statusDescription = getStatusDescription(user.status);
						}

						return (
							<div key={friend.id} className="list-section-list-friend">
								<div
									className="list-section-list-user-img"
									style={{ backgroundImage: `url(${friend.url_avatar})` }}
								>
									<div className="user-status" style={{ backgroundColor: statusColor }} />
								</div>
								<Link to={`/users/${friend.login}`} className="list-section-list-user-username">
									{friend.login}
								</Link>
								<div className="list-section-list-user-status-description">{statusDescription}</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default FriendsList;
