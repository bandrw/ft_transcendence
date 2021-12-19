import React, {FC} from 'react';

interface AppDataLayoutProps {
	children: React.ReactNode;
}

export const AppDataLayout: FC<AppDataLayoutProps> = ({ children }) => {
	// TODO fetch all needed data 

	return (
		<>{children}</>
	);
};