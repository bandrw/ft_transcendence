import './styles.scss';

import {
	faBullhorn,
	faCheck,
	faChevronLeft,
	faCommentSlash,
	faCrown,
	faLock,
	faPaperPlane,
	faPlay,
	faSignOutAlt,
	faSlidersH,
	faTimes,
	faTimesCircle,
	faVolumeMute,
	faVolumeUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from 'app/hooks';
import { getToken } from 'app/token';
import axios from 'axios';
import * as bcryptjs from 'bcryptjs';
import { SocketContext } from 'context/socket';
import { ApiChannelExpand, ApiChannelMember, ApiChatExpand, ApiMessage, ApiUserExpand } from 'models/ApiTypes';
import moment from 'moment';
import CreateChannel from 'pages/Main/Messenger/Chat/CreateChannel';
import CreateChat from 'pages/Main/Messenger/Chat/CreateChat';
import Message from 'pages/Main/Messenger/Chat/Message';
import React from 'react';
import { Link } from 'react-router-dom';

interface ChatProps {
	selectedChat: ApiChatExpand | null;
	selectedChannel: ApiChannelExpand | null;
	closeSelectedChat: () => void;
	messages: ApiMessage[];
	chatState: string;
	setDefaultChatState: () => void;
	setSettingsChatState: () => void;
	chats: ApiChatExpand[];
	channels: ApiChannelExpand[];
}

const Chat = ({
	selectedChat,
	selectedChannel,
	closeSelectedChat,
	messages,
	chatState,
	setDefaultChatState,
	setSettingsChatState,
	chats,
	channels,
}: ChatProps) => {
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { allUsers } = useAppSelector((state) => state.allUsers);
	const socket = React.useContext(SocketContext);
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [joinPassword, setJoinPassword] = React.useState('');
	const chatsToCreate: ApiUserExpand[] = allUsers.filter(
		(usr) =>
			!chats.find((chat) => chat.userOne.id === usr.id || chat.userTwo.id === usr.id) &&
			usr.id !== currentUser.id,
	);
	const [joinError, setJoinError] = React.useState<string>('');
	const [duelStatus, setDuelStatus] = React.useState<string>('green');
	const [localDuelStatus, setLocalDuelStatus] = React.useState<string>('green');
	const [showMuteChoices, setShowMuteChoices] = React.useState<number | null>(null);
	const [channelSettingsIsPrivate, setChannelSettingsIsPrivate] = React.useState<boolean | null>(null);
	const [channelPasswordChangeErrors, setChannelPasswordChangeErrors] = React.useState<string>('');
	const [channelNewPassword, setChannelNewPassword] = React.useState<string>('');
	const [showChatMuteChoices, setShowChatMuteChoices] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (selectedChannel) setChannelSettingsIsPrivate(selectedChannel.isPrivate);
	}, [selectedChannel]);

	// Click outside of ChatMuteChoices
	React.useEffect(() => {
		const windowClickHandler = () => {
			if (showChatMuteChoices) setShowChatMuteChoices(false);
		};

		window.addEventListener('click', windowClickHandler);

		return () => {
			window.removeEventListener('click', windowClickHandler);
		};
	}, [showChatMuteChoices]);

	// Click outside of MuteChoices (for channel settings)
	React.useEffect(() => {
		const windowClickHandler = () => {
			if (showMuteChoices) setShowMuteChoices(null);
		};

		window.addEventListener('click', windowClickHandler);

		return () => {
			window.removeEventListener('click', windowClickHandler);
		};
	}, [showMuteChoices]);

	const getChatCompanion = React.useCallback(
		(chat: ApiChatExpand) => (chat.userOne?.login === currentUser.username ? chat.userTwo : chat.userOne),
		[currentUser.username],
	);

	const sendMsg = (e: React.FormEvent) => {
		e.preventDefault();

		if (!inputRef.current) return;

		const text = inputRef.current.value.trim();

		if (text.length === 0) return;

		if (selectedChat) {
			const data = {
				text,
				chatId: selectedChat.id,
			};
			socket.emit('sendMessage', JSON.stringify(data));
			inputRef.current.value = '';
		}

		if (selectedChannel) {
			const data = {
				text,
				channelId: selectedChannel.id,
			};
			socket.emit('sendMessage', JSON.stringify(data));
			inputRef.current.value = '';
		}
	};

	React.useEffect(() => {
		const duelStatusHandler = (s: string) => {
			setDuelStatus(s);
		};

		socket.on('duelStatus', duelStatusHandler);

		return () => {
			socket.off('duelStatus', duelStatusHandler);

			if (selectedChat) {
				const companion = getChatCompanion(selectedChat);
				socket.emit('cancelDuel', JSON.stringify({ enemyId: companion.id }));
			}
		};
	}, [currentUser.username, getChatCompanion, selectedChat, socket]);

	if (chatState === 'newChat')
		return (
			<CreateChat setDefaultChatState={setDefaultChatState} chatsToCreate={chatsToCreate} allUsers={allUsers} />
		);

	if (chatState === 'newChannel') return <CreateChannel setDefaultChatState={setDefaultChatState} />;

	if (chatState === 'settings') {
		if (selectedChannel) {
			const MuteButton = ({ member }: { member: ApiChannelMember }) => {
				const mute = (unbanDate: number | null) => {
					const data = {
						channelId: selectedChannel.id,
						memberId: member.id,
						unbanDate: unbanDate === null ? null : moment(unbanDate).format('YYYY-MM-DD HH:mm:ss'),
					};
					axios
						.post('/channels/muteMember', data, { headers: { Authorization: `Bearer ${getToken()}` } })
						.catch(() => {});
					setShowMuteChoices(null);
				};

				const unmute = () => {
					const data = {
						channelId: selectedChannel.id,
						memberId: member.id,
					};
					axios
						.post('/channels/unmuteMember', data, { headers: { Authorization: `Bearer ${getToken()}` } })
						.catch(() => {});
					setShowMuteChoices(null);
				};

				if (currentUser.id === member.id || member.id === selectedChannel.ownerId || member.isAdmin)
					return <div style={{ width: 34 }} />;

				return (
					<div className="ban-button-wrapper">
						<button
							className="ban-button"
							onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
								e.stopPropagation();
								setShowMuteChoices((prev) => (prev === member.id ? null : member.id));
							}}
						>
							<FontAwesomeIcon icon={faVolumeMute} />
						</button>
						{showMuteChoices === member.id && (
							<div className="ban-button-choices-wrapper" onClick={(e) => e.stopPropagation()}>
								<div className="ban-button-choices">
									<button
										className="ban-button-choices-mute-btn"
										onClick={() => mute(Date.now() + 3600 * 1000)}
									>
										Mute for 1 hour
									</button>
									<button
										className="ban-button-choices-mute-btn"
										onClick={() => mute(Date.now() + 8 * 3600 * 1000)}
									>
										Mute for 8 hours
									</button>
									<button className="ban-button-choices-mute-btn" onClick={() => mute(null)}>
										Mute forever
									</button>
									<button className="ban-button-choices-unmute-btn" onClick={() => unmute()}>
										Unmute
									</button>
								</div>
							</div>
						)}
					</div>
				);
			};

			const MuteIndicator = ({ member }: { member: ApiChannelMember }) => {
				const ban = member.banLists.find(
					(list) =>
						list.channelId === selectedChannel.id &&
						(list.unbanDate === null || new Date(list.unbanDate) >= new Date()),
				);

				if (ban)
					return (
						<span
							className="messenger-chat-settings-members-list__member-mute"
							data-muted-until={
								ban.unbanDate === null
									? 'Muted'
									: `Muted until ${moment(ban.unbanDate).format('DD MMMM YYYY, HH:mm')}`
							}
						>
							<FontAwesomeIcon icon={faCommentSlash} />
						</span>
					);

				return <span className="messenger-chat-settings-members-list__member-mute" />;
			};

			const MembersList = () => {
				if (selectedChannel.ownerId === currentUser.id)
					return (
						<div className="messenger-chat-settings-members-list">
							{selectedChannel.members.map((member) => {
								return (
									<div key={member.id} className="messenger-chat-settings-members-list__member">
										<span className="messenger-chat-settings-members-list__member-user">
											<span
												className="messenger-chat-settings-members-list__member-img"
												style={{ backgroundImage: `url(${member.url_avatar})` }}
											/>
											<Link
												to={`/users/${member.login}`}
												className="messenger-chat-settings-members-list__member-login"
											>
												{member.login}
											</Link>
										</span>
										<MuteIndicator member={member} />
										<div className="messenger-chat-settings-members-list__member-status">
											{selectedChannel.ownerId === member.id ? (
												<FontAwesomeIcon icon={faCrown} />
											) : (
												// eslint-disable-next-line jsx-a11y/control-has-associated-label
												<button
													className={`toggle-btn ${member.isAdmin && 'toggle-btn-active'}`}
													data-description={
														member.isAdmin ? 'Switch to member' : 'Switch to admin'
													}
													onClick={() => {
														const data = {
															channelId: selectedChannel.id,
															memberId: member.id,
															status: '',
														};

														if (member.isAdmin) {
															data.status = 'member';
														} else {
															data.status = 'admin';
														}
														axios
															.put('/channels/updateMemberStatus', data, {
																headers: { Authorization: `Bearer ${getToken()}` },
															})
															.catch(() => {});
													}}
												/>
											)}
										</div>
										<MuteButton member={member} />
									</div>
								);
							})}
						</div>
					);

				if (selectedChannel.members.find((m) => m.id === currentUser.id)?.isAdmin)
					return (
						<div className="messenger-chat-settings-members-list">
							{selectedChannel.members.map((member) => {
								return (
									<div key={member.id} className="messenger-chat-settings-members-list__member">
										<div className="messenger-chat-settings-members-list__member-user">
											<div
												className="messenger-chat-settings-members-list__member-img"
												style={{ backgroundImage: `url(${member.url_avatar})` }}
											/>
											<Link
												to={`/users/${member.login}`}
												className="messenger-chat-settings-members-list__member-login"
											>
												{member.login}
											</Link>
										</div>
										<MuteIndicator member={member} />
										<div className="messenger-chat-settings-members-list__member-status">
											{(() => {
												if (selectedChannel.ownerId === member.id) {
													return <FontAwesomeIcon icon={faCrown} />;
												}

												if (member.isAdmin) {
													return 'admin';
												}

												return '';
											})()}
										</div>
										<MuteButton member={member} />
									</div>
								);
							})}
						</div>
					);

				return (
					<div className="messenger-chat-settings-members-list">
						{selectedChannel.members.map((member) => {
							return (
								<div key={member.id} className="messenger-chat-settings-members-list__member">
									<div className="messenger-chat-settings-members-list__member-user">
										<div
											className="messenger-chat-settings-members-list__member-img"
											style={{ backgroundImage: `url(${member.url_avatar})` }}
										/>
										<Link
											to={`/users/${member.login}`}
											className="messenger-chat-settings-members-list__member-login"
										>
											{member.login}
										</Link>
									</div>
									<MuteIndicator member={member} />
									<div className="messenger-chat-settings-members-list__member-status">
										{(() => {
											if (selectedChannel.ownerId === member.id) {
												return <FontAwesomeIcon icon={faCrown} />;
											}

											if (member.isAdmin) {
												return 'admin';
											}

											return '';
										})()}
									</div>
								</div>
							);
						})}
					</div>
				);
			};

			return (
				<div className="messenger-chat">
					<div className="messenger-chat-info">
						<button onClick={() => setDefaultChatState()} style={{ marginRight: 15 }}>
							<FontAwesomeIcon style={{ marginTop: 2 }} icon={faChevronLeft} />
						</button>
						<div className="messenger-chat-info-channel">Settings</div>
						<button className="messenger-chat-close-btn" onClick={closeSelectedChat} title="Close">
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>
					<div className="messenger-chat-settings">
						<div className="messenger-chat-settings-title">
							{selectedChannel.isPrivate && <FontAwesomeIcon icon={faLock} />}
							{selectedChannel.title}
						</div>
						<div className="messenger-chat-settings-name">{`@${selectedChannel.name}`}</div>
						<div className="messenger-chat-settings-subscribers">
							{selectedChannel.members.length === 1
								? `1 subscriber`
								: `${selectedChannel.members.length} subscribers`}
						</div>
						<div className="messenger-chat-settings-buttons">
							<button
								className="messenger-chat-settings-buttons__leave"
								onClick={() => {
									const data = { channelId: selectedChannel.id };
									axios
										.post('/channels/leave', data, {
											headers: { Authorization: `Bearer ${getToken()}` },
										})
										.catch(() => {});
								}}
							>
								<div>
									<FontAwesomeIcon icon={faSignOutAlt} />
								</div>
								<div>Leave</div>
							</button>
						</div>
						{selectedChannel.ownerId === currentUser.id && (
							<form
								className="messenger-chat-settings-accessibility"
								onSubmit={async (e) => {
									e.preventDefault();
									const isPrivate =
										channelSettingsIsPrivate !== null
											? channelSettingsIsPrivate
											: selectedChannel.isPrivate;
									const password = channelNewPassword;

									if (isPrivate && (!password || password.length < 6)) {
										setChannelPasswordChangeErrors("Password's length must be greater than 6");

										return;
									}

									const data = {
										channelId: selectedChannel.id,
										isPrivate,
										password: channelSettingsIsPrivate ? await bcryptjs.hash(password, 10) : null,
									};
									axios
										.put('/channels/update', data, {
											headers: { Authorization: `Bearer ${getToken()}` },
										})
										.then(() => {
											setChannelPasswordChangeErrors('');
											setChannelNewPassword('');
										});
								}}
							>
								<input
									defaultChecked={selectedChannel.isPrivate}
									onChange={(e) => setChannelSettingsIsPrivate(e.target.checked)}
									id="channel-is-private__checkbox"
									type="checkbox"
									name="is_private"
								/>
								{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
								<label htmlFor="channel-is-private__checkbox">
									<div className="channel_is_private__checkbox">
										<FontAwesomeIcon icon={faCheck} />
									</div>
									Private
								</label>
								{channelSettingsIsPrivate && (
									<input
										onChange={(e) => setChannelNewPassword(e.target.value)}
										value={channelNewPassword}
										className="channel-is-private__password-input"
										type="password"
										name="new-channel-password"
										placeholder="Enter new password"
									/>
								)}
								<div className="channel-is-private__errors">{channelPasswordChangeErrors}</div>
								<button
									type="submit"
									disabled={
										channelSettingsIsPrivate === selectedChannel.isPrivate &&
										channelNewPassword === ''
									}
								>
									Save
								</button>
							</form>
						)}
						<MembersList />
					</div>
				</div>
			);
		}
	}

	setTimeout(() => {
		const chatMessages = document.getElementsByClassName('messenger-chat-messages');

		if (chatMessages.length > 0) chatMessages[0].scrollTop = chatMessages[0].scrollHeight;
	}, 0);

	if (selectedChat) {
		const companion = getChatCompanion(selectedChat);

		const mute = (unbanDate: number | null) => {
			const data = {
				chatId: selectedChat.id,
				memberId: companion.id,
				unbanDate: unbanDate === null ? null : moment(unbanDate).format('YYYY-MM-DD HH:mm:ss'),
			};
			axios
				.post('/chats/muteMember', data, { headers: { Authorization: `Bearer ${getToken()}` } })
				.catch(() => {});
			setShowChatMuteChoices(false);
		};

		const unmute = () => {
			const data = {
				chatId: selectedChat.id,
				memberId: companion.id,
			};
			axios
				.post('/chats/unmuteMember', data, { headers: { Authorization: `Bearer ${getToken()}` } })
				.catch(() => {});
			setShowChatMuteChoices(false);
		};

		const ban = selectedChat.banLists.find(
			(list) =>
				list.chatId === selectedChat.id && (list.unbanDate === null || new Date(list.unbanDate) > new Date()),
		);
		const bannedByCurrentUser = ban && ban.initiatorId === currentUser.id;

		return (
			<div className="messenger-chat">
				<div className="messenger-chat-info">
					<Link className="messenger-chat-info-companion" to={`/users/${companion.login}`}>
						<div
							className="messenger-chat-info-img"
							style={{ backgroundImage: `url(${companion.url_avatar})` }}
						/>
						<div>{companion.login}</div>
					</Link>
					<div className="ban-button-wrapper">
						<button
							className="ban-button messenger-chat-info-mute"
							title="Mute"
							disabled={ban && !bannedByCurrentUser}
							onClick={() => setShowChatMuteChoices((prev) => !prev)}
						>
							{ban ? (
								<FontAwesomeIcon className="messenger-chat-info-mute__muted-icon" icon={faVolumeMute} />
							) : (
								<FontAwesomeIcon icon={faVolumeUp} />
							)}
						</button>
						{showChatMuteChoices && (
							<div className="ban-button-choices-wrapper" onClick={(e) => e.stopPropagation()}>
								<div className="ban-button-choices">
									{!bannedByCurrentUser && (
										<>
											<button
												className="ban-button-choices-mute-btn"
												onClick={() => mute(Date.now() + 3600 * 1000)}
											>
												Mute for 1 hour
											</button>
											<button
												className="ban-button-choices-mute-btn"
												onClick={() => mute(Date.now() + 8 * 3600 * 1000)}
											>
												Mute for 8 hours
											</button>
											<button className="ban-button-choices-mute-btn" onClick={() => mute(null)}>
												Mute forever
											</button>
										</>
									)}
									{bannedByCurrentUser && (
										<button
											className="ban-button-choices-mute-btn"
											onClick={() => unmute()}
											style={{ borderRadius: 18 }}
										>
											Unmute
										</button>
									)}
								</div>
							</div>
						)}
					</div>
					{duelStatus === 'yellow' && localDuelStatus === 'green' && (
						<button
							className="messenger-chat-info-play-btn"
							onClick={() => {
								socket.emit('requestDuel', JSON.stringify({ enemyId: companion.id }));
								setLocalDuelStatus('yellow');
							}}
						>
							<span className="messenger-chat-info-play-btn-text">Accept</span>
							<span className="messenger-chat-info-play-btn-img">
								<FontAwesomeIcon icon={faPlay} />
							</span>
						</button>
					)}
					{duelStatus === 'green' && localDuelStatus === 'green' && (
						<button
							className="messenger-chat-info-play-btn"
							onClick={() => {
								socket.emit('requestDuel', JSON.stringify({ enemyId: companion.id }));
								setLocalDuelStatus('yellow');
							}}
						>
							<span className="messenger-chat-info-play-btn-text">Play pong</span>
							<span className="messenger-chat-info-play-btn-img">
								<FontAwesomeIcon icon={faPlay} />
							</span>
						</button>
					)}
					{duelStatus === 'yellow' && localDuelStatus === 'yellow' && (
						<button
							className="messenger-chat-info-play-btn"
							onClick={() => {
								socket.emit('cancelDuel', JSON.stringify({ enemyId: companion.id }));
								setLocalDuelStatus('green');
							}}
						>
							<span className="messenger-chat-info-play-btn-text">Waiting...</span>
							<span className="messenger-chat-info-play-btn-img messenger-chat-info-play-btn-img-searching">
								<FontAwesomeIcon icon={faTimesCircle} />
							</span>
						</button>
					)}
					<button className="messenger-chat-close-btn" onClick={closeSelectedChat} title="Close">
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>
				<div className="messenger-chat-messages">
					{messages.map((msg) => (
						<Message key={msg.id} message={msg} isFromCompanion={msg.fromUserId !== currentUser.id} />
					))}
				</div>
				<form className="messenger-chat-form" onSubmit={sendMsg}>
					<input
						disabled={ban?.memberId === currentUser.id}
						className="messenger-chat-input"
						ref={inputRef}
						type="text"
						placeholder={
							// TODO
							// eslint-disable-next-line no-nested-ternary
							ban?.memberId === currentUser.id
								? ban.unbanDate === null
									? 'You are muted'
									: `You are muted until ${moment(ban.unbanDate).format('DD MMMM YYYY, HH:mm')}`
								: 'Write a message'
						}
					/>
					<button
						disabled={ban?.memberId === currentUser.id}
						type="submit"
						className="messenger-chat-send-btn"
					>
						<FontAwesomeIcon icon={faPaperPlane} />
					</button>
				</form>
			</div>
		);
	}

	if (selectedChannel) {
		const isMember = selectedChannel.members.find((member) => member.id === currentUser.id);

		let ban;

		if (isMember && isMember.banLists) {
			ban = isMember.banLists.find(
				(list) =>
					list.channelId === selectedChannel.id &&
					(list.unbanDate === null || new Date(list.unbanDate) > new Date()),
			);
		}

		if (selectedChannel.isPrivate && !isMember)
			return (
				<div className="messenger-chat">
					<div className="messenger-chat-info">
						<div className="messenger-chat-info-channel">
							<div className="messenger-chat-info-img">
								<FontAwesomeIcon icon={faBullhorn} />
							</div>
							<div className="messenger-chat-info-name">
								<div className="messenger-chat-info-title">{selectedChannel.title}</div>
								<div className="messenger-chat-info-members">
									{`${selectedChannel.members.length} ${
										selectedChannel.members.length > 1 ? 'members' : 'member'
									}`}
								</div>
							</div>
						</div>
						<button className="messenger-chat-close-btn" onClick={closeSelectedChat} title="Close">
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();

							axios
								.post(
									'/channels/join',
									{ channelId: selectedChannel.id, password: joinPassword },
									{
										headers: { Authorization: `Bearer ${getToken()}` },
									},
								)
								.catch(() => setJoinError('Wrong password'));
						}}
						className="messenger-chat-join-private-form"
					>
						<div className="messenger-chat-join-private-form-top">
							<FontAwesomeIcon icon={faLock} />
							<span>Channel is private</span>
						</div>
						<input
							onChange={(e) => setJoinPassword(e.target.value)}
							type="password"
							name="private_channel_password"
							placeholder="Password"
						/>
						<div className="messenger-chat-join-private-errors">{joinError}</div>
						<button disabled={joinPassword.length === 0} type="submit">
							Join
						</button>
					</form>
				</div>
			);

		return (
			<div className="messenger-chat">
				<div className="messenger-chat-info">
					<div className="messenger-chat-info-channel">
						<div className="messenger-chat-info-img">
							<FontAwesomeIcon icon={faBullhorn} />
						</div>
						<div className="messenger-chat-info-name">
							<div className="messenger-chat-info-title">{selectedChannel.title}</div>
							<div className="messenger-chat-info-members">
								{`${selectedChannel.members.length} ${
									selectedChannel.members.length > 1 ? 'members' : 'member'
								}`}
							</div>
						</div>
					</div>
					<button className="messenger-chat-info-settings-btn" onClick={() => setSettingsChatState()}>
						<FontAwesomeIcon icon={faSlidersH} />
					</button>
					<button className="messenger-chat-close-btn" onClick={closeSelectedChat} title="Close">
						<FontAwesomeIcon icon={faTimes} />
					</button>
				</div>
				<div className="messenger-chat-messages">
					{selectedChannel.messages.map((msg) => {
						const author = allUsers.find((usr) => usr.id === msg.fromUserId);

						return (
							<Message
								key={msg.id}
								message={msg}
								isFromCompanion={msg.fromUserId !== currentUser.id}
								author={author ? { name: author.login, imageUrl: author.url_avatar } : undefined}
							/>
						);
					})}
				</div>
				{isMember ? (
					<form className="messenger-chat-form" onSubmit={sendMsg}>
						<input
							disabled={!!ban}
							className="messenger-chat-input"
							ref={inputRef}
							type="text"
							placeholder={
								// TODO
								// eslint-disable-next-line no-nested-ternary
								ban
									? ban.unbanDate === null
										? 'You are muted'
										: `You are muted until ${moment(ban.unbanDate).format('DD MMMM YYYY, HH:mm')}`
									: 'Write a message'
							}
						/>
						<button disabled={!!ban} type="submit" className="messenger-chat-send-btn">
							<FontAwesomeIcon icon={faPaperPlane} />
						</button>
					</form>
				) : (
					<button
						className="messenger-chat-join-btn"
						onClick={() => {
							axios
								.post(
									'/channels/join',
									{ channelId: selectedChannel.id },
									{
										headers: { Authorization: `Bearer ${getToken()}` },
									},
								)
								.then(() => {});
						}}
					>
						Join
					</button>
				)}
			</div>
		);
	}

	return (
		<div className="messenger-chat">
			<div className="messenger-chat-empty-msg">
				{chats.length + channels.length === 0 ? 'Create a chat' : 'Select a chat'}
			</div>
		</div>
	);
};

export default Chat;
