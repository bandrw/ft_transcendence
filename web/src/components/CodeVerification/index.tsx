import React, { ChangeEvent } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 10px;
	width: 370px;
`;

const Field = styled.input`
	width: 40px;
	height: 40px;
	padding: 0;
	text-align: center;
	margin: 0 5px;
	border-radius: 10px;
	box-shadow: 0 0 6px 1px #1a1b1f;
	font-size: 1em;
	background: none;
	outline: none;
	color: white;
	border: 1px solid #2c3e50;
	transition: all 0.1s ease-in;

	&::selection {
		background: #29aa44;
	}

	&:focus {
		border-color: #29aa44;
	}
`;

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
		const field1 = document.getElementById('code-verification-field-1');
		const field2 = document.getElementById('code-verification-field-2');
		const field3 = document.getElementById('code-verification-field-3');
		const field4 = document.getElementById('code-verification-field-4');

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
		<Wrapper>
			{
				fields.map((field, index) =>
					<Field
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						id={`code-verification-field-${index + 1}`}
						type="text"
						placeholder="•"
						onChange={ (e) => fieldChange(e, index) }
						value={field}
					/>,
				)
			}
		</Wrapper>
	);
};

export default CodeVerification;
