import React, { FC } from 'react';

import Header from "../components/Header";
import {LayoutProps} from "./AppDataLayout";

type MainLayoutProps = LayoutProps;

const MainLayout: FC<MainLayoutProps> = ({children}) => {
	return (
		<>
			<Header />
			{children}
		</>
	);
};

export default MainLayout;