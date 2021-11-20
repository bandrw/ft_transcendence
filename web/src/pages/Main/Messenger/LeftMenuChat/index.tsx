import './styles.scss';

import React from "react";

interface LeftMenuChatProps {
	title: string,
	image: string,
	isSelected: boolean,
	selectChat: () => void
}

const LeftMenuChat = ({ title, image, isSelected, selectChat }: LeftMenuChatProps) => {
	return (
		<div className={ `messenger-contact ${isSelected ? 'messenger-contact-selected' : ''}` } onMouseDown={ selectChat }>
			<div className='messenger-contact-image' style={ { backgroundImage: `url(${image})` } }/>
			<div className='messenger-contact-name'>{ title }</div>
		</div>
	);
};

export default LeftMenuChat;
