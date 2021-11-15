import './styles.scss';

import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ChannelProps {
	isSelected: boolean,
	title: string,
	selectChannel: () => void
}

const Channel = ({ isSelected, title, selectChannel }: ChannelProps) => {
	return (
		<div className={ `messenger-channel ${isSelected ? 'messenger-channel-selected' : ''}` } onMouseDown={ selectChannel }>
			<div className='messenger-channel-image'>
				<FontAwesomeIcon icon={ faBullhorn }/>
			</div>
			<div className='messenger-channel-name'>{ title }</div>
		</div>
	);
};

export default Channel;
