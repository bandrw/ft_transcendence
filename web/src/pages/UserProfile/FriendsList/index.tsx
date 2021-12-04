import './styles.scss';

import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ApiUserExpand } from "models/ApiTypes";
import React from "react";
import { Link } from "react-router-dom";

interface FriendsListProps {
	friends: ApiUserExpand[]
}

const FriendsList = ({ friends }: FriendsListProps) => {
	return (
		<div className='list-section'>
			<div className='list-section-title'>
				<p>Friends</p>
			</div>
			<div className='list-section-list'>
				{
					friends.length === 0 &&
					<div className='list-section-empty'>
						No friends yet
						<FontAwesomeIcon icon={ faUserFriends }/>
					</div>
				}
				{
					friends.map((friend, i) => {
						let statusColor = 'transparent';
						let statusDescription = 'Offline';

						return (
							<div key={ i } className='list-section-list-friend'>
								<div
									className='list-section-list-user-img'
									style={ { backgroundImage: `url(${ friend.url_avatar })` } }
								>
									<div className='user-status' style={ { backgroundColor: statusColor } }/>
								</div>
								<Link to={ `/users/${ friend.login }` } className='list-section-list-user-username'>
									{ friend.login }
								</Link>
								<div className='list-section-list-user-status-description'>
									{ statusDescription }
								</div>
							</div>
						);
					})
				}
			</div>
		</div>
	);
};

export default FriendsList;
