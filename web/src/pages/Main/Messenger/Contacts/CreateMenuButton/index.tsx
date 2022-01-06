import { faBullhorn, faComment, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppDispatch } from "hook/reduxHooks";
import React, { useCallback } from "react";
import { Fade } from "react-awesome-reveal";
import { ChatState, setChatState } from "store/reducers/messengerSlice";

const CreateMenuButton = () => {
	const [showCreateMenu, setShowCreateMenu] = React.useState(false);
	const dispatch = useAppDispatch();

	// Hiding CreateMenuButton on click
	React.useEffect(() => {
		const clickHandler = () => {
			if (showCreateMenu) setShowCreateMenu(false);
		};

		window.addEventListener('click', clickHandler);

		return () => {
			window.removeEventListener('click', clickHandler);
		};
	}, [showCreateMenu]);

	const clickHandler = useCallback(() => {
		setShowCreateMenu((prev) => !prev);
	}, []);

	const newChatClickHandler = useCallback(() => dispatch(setChatState(ChatState.NewChat)), [dispatch]);

	const newChannelClickHandler = useCallback(() => dispatch(setChatState(ChatState.NewChannel)), [dispatch]);

	return (
		<button
			className='messenger-contacts-header-btn'
			onClick={clickHandler}
		>
			<FontAwesomeIcon icon={faPlus} />
			{showCreateMenu && (
				<Fade duration={300}>
					<div className="messenger-contacts-header-menu-wrapper">
						<div className="messenger-contacts-header-menu">
							<div
								className="messenger-contacts-header-menu-btn"
								onClick={newChatClickHandler}
							>
								<FontAwesomeIcon icon={faComment} />
								New Chat
							</div>
							<div
								className="messenger-contacts-header-menu-btn"
								onClick={newChannelClickHandler}
							>
								<FontAwesomeIcon icon={faBullhorn} />
								New Channel
							</div>
						</div>
					</div>
				</Fade>
			)}
		</button>
	);
};

export default CreateMenuButton;
