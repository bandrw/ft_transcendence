import './styles.scss';

import React from "react";

interface ContactProps {
	title: string,
	image: string,
	isSelected: boolean,
	selectChat: () => void
}

const Contact = ({ title, image, isSelected, selectChat }: ContactProps) => {

	return (
		<div className={ `messenger-contact ${isSelected ? 'messenger-contact-selected' : ''}` } onMouseDown={ selectChat }>
			<div className='messenger-contact-image' style={ { backgroundImage: `url(${image})` } }/>
			<div className='messenger-contact-name'>{ title }</div>
		</div>
	);
};

export default Contact;
