import './styles.scss';

import React, { ChangeEvent } from "react";

interface CodeVerificationProps {
	submit: (code: string) => void
}

const CodeVerification = ({ submit }: CodeVerificationProps) => {
	const [fields, setFields] = React.useState(['', '', '', '']);

	const fieldChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
		if (index === 0) {
			setFields((prev) => [
				e.target.value.length <= 1 ? e.target.value : prev[2],
				prev[1],
				prev[2],
				prev[3],
			]);
		}  else if (index === 1) {
			setFields((prev) => ([
					prev[0],
					e.target.value.length <= 1 ? e.target.value : prev[2],
					prev[2],
					prev[3],
				]
			));
		} else if (index === 2) {
			setFields((prev) => ([
					prev[0],
					prev[1],
					e.target.value.length <= 1 ? e.target.value : prev[3],
					prev[3],
				]
			));
		} else if (index === 3) {
			setFields((prev) => ([
					prev[0],
					prev[1],
					prev[2],
					e.target.value.length <= 1 ? e.target.value : prev[4],
				]
			));
		}
	};

	React.useEffect(() => {
		const field1 = document.getElementById('code-confirmation-field-1');
		const field2 = document.getElementById('code-confirmation-field-2');
		const field3 = document.getElementById('code-confirmation-field-3');
		const field4 = document.getElementById('code-confirmation-field-4');

		if (!(field1 && field2 && field3 && field4)) return ;

		if (fields[0].length === 0) {
			field1.focus();
		} else if (fields[1].length === 0) {
			field2.focus();
		} else if (fields[2].length === 0) {
			field3.focus();
		} else if (fields[3].length === 0) {
			field4.focus();
		} else {
			const code = fields.join('');
			submit(code);
			setFields(['', '', '', '']);
		}
	}, [fields, submit]);

	return (
		<div className="code-confirmation">
			<label htmlFor='code-confirmation-field-1'>
				<input
					id='code-confirmation-field-1'
					className="code-confirmation-field"
					type="text"
					placeholder="•"
					onChange={ (e) => fieldChange(e, 0) }
					value={fields[0]}
				/>
			</label>
			<label htmlFor='code-confirmation-field-2'>
				<input
					id='code-confirmation-field-2'
					className="code-confirmation-field"
					type="text"
					placeholder="•"
					onChange={ (e) => fieldChange(e, 1) }
					value={fields[1]}
				/>
			</label>
			<label htmlFor='field-3' className="box">
				<input
					id='code-confirmation-field-3'
					className="code-confirmation-field"
					type="text"
					placeholder="•"
					onChange={ (e) => fieldChange(e, 2) }
					value={fields[2]}
				/>
			</label>
			<label htmlFor='code-confirmation-field-4' className="box">
				<input
					id='code-confirmation-field-4'
					className="code-confirmation-field"
					type="text"
					placeholder="•"
					onChange={ (e) => fieldChange(e, 3) }
					value={fields[3]}
				/>
			</label>
		</div>
	);
};

export default CodeVerification;
