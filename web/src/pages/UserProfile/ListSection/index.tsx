import './styles.scss';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';

interface ListSectionProps {
	title: string;
	list: JSX.Element[];
	linkTo?: string;
	emptyListSubstitute?: JSX.Element;
}

const ListSection = ({ title, list, linkTo, emptyListSubstitute }: ListSectionProps) => {
	return (
		<div className="list-section">
			<div className="list-section-title">
				<p>{title}</p>
				{linkTo && (
					<Link to={linkTo}>
						<FontAwesomeIcon icon={faArrowRight} />
					</Link>
				)}
			</div>
			<div className="list-section-list">
				{/* eslint-disable-next-line react/no-array-index-key */}
				{list.length === 0 ? emptyListSubstitute : list.map((item, i) => React.cloneElement(item, { key: i }))}
			</div>
		</div>
	);
};

export default ListSection;
