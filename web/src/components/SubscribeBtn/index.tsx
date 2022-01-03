import {faUserCheck, faUserFriends, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import React from "react";

import {subscribe, unsubscribe} from "../../api/subscribe";
import {ApiUserExpand} from "../../models/ApiTypes";
import {User} from "../../models/User";
import {getTargetUser} from "../../utils/getTargetUser";
import {getToken} from "../../utils/token";
import CircleLoading from "../CircleLoading";

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

	React.useEffect(() => {
		const currUser = getTargetUser(allUsers, currentUser.username, 'login'); // allUsers.find((usr) => usr.login === currentUser.username);

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

	if (subscribeBtnState === SubscribeBtnState.Default)
		return (
			<button
				className="user-profile-header-subscribe-btn user-profile-header-subscribe-btn-default"
				onClick={() => {
					setSubscribeBtnLoading(true);
					subscribe(targetLogin)
						.then(() => setSubscribeBtnState(SubscribeBtnState.Subscribed))
						.catch(() => {})
						.finally(() => setSubscribeBtnLoading(false));
				}}
				title="Subscribe"
			>
				Subscribe
				<FontAwesomeIcon icon={faUserPlus} />
			</button>
		);

	if (subscribeBtnState === SubscribeBtnState.Subscribed)
		return (
			<button
				className="user-profile-header-subscribe-btn user-profile-header-subscribe-btn-subscribed"
				onClick={() => {
					setSubscribeBtnLoading(true);
					unsubscribe(targetLogin)
						.then(() => setSubscribeBtnState(SubscribeBtnState.Default))
						.catch(() => {})
						.finally(() => setSubscribeBtnLoading(false));
				}}
				title="Unsubscribe"
			>
				Subscribed
				<FontAwesomeIcon icon={faUserCheck} />
			</button>
		);

	if (subscribeBtnState === SubscribeBtnState.AcceptFriendship)
		return (
			<button
				className="user-profile-header-subscribe-btn user-profile-header-subscribe-btn-accept"
				onClick={() => {
					setSubscribeBtnLoading(true);
					subscribe(targetLogin)
						.then(() => setSubscribeBtnState(SubscribeBtnState.Default))
						.catch(() => {})
						.finally(() => setSubscribeBtnLoading(false));
				}}
				title="Subscribe"
			>
				Accept
				<FontAwesomeIcon icon={faUserCheck} />
			</button>
		);

	return (
		<button
			className="user-profile-header-subscribe-btn user-profile-header-subscribe-btn-friends"
			onClick={() => {
				setSubscribeBtnLoading(true);
				unsubscribe(targetLogin)
					.then(() => setSubscribeBtnState(SubscribeBtnState.Default))
					.catch(() => {})
					.finally(() => setSubscribeBtnLoading(false));
			}}
			title="Unsubscribe"
		>
			Friend
			<FontAwesomeIcon icon={faUserFriends} />
		</button>
	);
};