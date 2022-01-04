import {faUserCheck, faUserFriends, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {subscribe, unsubscribe} from "api/subscribe";
import CircleLoading from "components/CircleLoading";
import {ApiUserExpand} from "models/ApiTypes";
import {User} from "models/User";
import React from "react";
import {getTargetUser} from "utils/getTargetUser";

enum SubscribeBtnState {
	Default,
	Subscribed,
	AcceptFriendship,
	InFriendship,
}

interface SubscribeBtnProps {
	currentUser: User;
	targetLogin: string;
	allUsers: ApiUserExpand[];
}

export const SubscribeBtn = ({currentUser, targetLogin, allUsers}: SubscribeBtnProps) => {
	const [subscribeBtnState, setSubscribeBtnState] = React.useState(SubscribeBtnState.Default);
	const [subscribeBtnLoading, setSubscribeBtnLoading] = React.useState(false);

	const clickHandler = (
		action: typeof subscribe | typeof unsubscribe,
		btnState: SubscribeBtnState = SubscribeBtnState.Default) => () => {
		setSubscribeBtnLoading(true);
		action(targetLogin)
			.then(() => setSubscribeBtnState(btnState))
			.catch(() => {})
			.finally(() => setSubscribeBtnLoading(false));
	};

	React.useEffect(() => {
		const currUser = getTargetUser(allUsers, currentUser.username, 'login');
		// allUsers.find((usr) => usr.login === currentUser.username);

		if (!currUser) return;

		if (currUser.subscriptions.find((s) => s.login === targetLogin)) {
			if (currUser.subscribers.find((s) => s.login === targetLogin))
				setSubscribeBtnState(SubscribeBtnState.InFriendship);
			else setSubscribeBtnState(SubscribeBtnState.Subscribed);
		} else if (currUser.subscribers.find((s) => s.login === targetLogin)) {
			setSubscribeBtnState(SubscribeBtnState.AcceptFriendship);
		} else {
			setSubscribeBtnState(SubscribeBtnState.Default);
		}
	}, [allUsers, currentUser.username, targetLogin]);

	if (subscribeBtnLoading)
		return (
			<button className="user-profile-header-subscribe-btn">
				<CircleLoading bgColor="#fff" width="35px" height="35px" />
			</button>
		);

	const statusToProps = {
		[SubscribeBtnState.Default]: {
			className: 'user-profile-header-subscribe-btn-default',
			onClick: clickHandler(subscribe, SubscribeBtnState.Subscribed),
			title: 'Subscribe',
			text: 'Subscribe',
			icon: faUserPlus,
		},
		[SubscribeBtnState.Subscribed]: {
			className: 'user-profile-header-subscribe-btn-subscribed',
			onClick: clickHandler(unsubscribe),
			title: 'Unsubscribe',
			text: 'Subscribed',
			icon: faUserCheck,
		},
		[SubscribeBtnState.AcceptFriendship]: {
			className: 'user-profile-header-subscribe-btn-accept',
			onClick: clickHandler(subscribe),
			title: 'Subscribe',
			text: 'Accept',
			icon: faUserCheck,
		},
		[SubscribeBtnState.InFriendship]: {
			className: 'user-profile-header-subscribe-btn-friends',
			onClick: clickHandler(unsubscribe),
			title: 'Unsubscribe',
			text: 'Friend',
			icon: faUserFriends,
		},
	};

	const { className, onClick, title, text, icon } = statusToProps[subscribeBtnState];

	return (
		<button
			className={`user-profile-header-subscribe-btn ${className}`}
			onClick={onClick}
			title={title}
		>
			{text}
			<FontAwesomeIcon icon={icon} />
		</button>
	);
};
