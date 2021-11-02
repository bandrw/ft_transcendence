import './styles.scss';

interface ListSectionProps {
	title: string,
	list: JSX.Element[]
}

const ListSection = ({ title, list }: ListSectionProps) => {

	return (
		<div className='list-section'>
			<div className='list-section-title'>
				{ title }
			</div>
			<div className='list-section-list'>
				{
					list.map(item => item)
				}
			</div>
		</div>
	);
};

export default ListSection;
