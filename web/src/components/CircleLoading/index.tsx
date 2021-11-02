import './styles.scss';

import React from 'react';

interface CircleLoadingProps {
	bgColor?: string,
	width?: string,
	height?: string
}

const CircleLoading = ({ bgColor = '#000', width = '50px', height = '50px' }: CircleLoadingProps) => {
	const divArray = [];
	for (let i = 0; i < 12; ++i)
		divArray.push(<div/>);

	return (
		<div
			className='lds-spinner'
			style={ { width: width, height: height } }
		>
			{
				divArray.map((item, i) => <div key={ i } style={ { backgroundColor: bgColor } }/>)
			}
		</div>
	);
};

export default CircleLoading;
