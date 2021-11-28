import { configureStore } from '@reduxjs/toolkit';
import allUsersReducer from "app/reducers/allUsersSlice";
import currentUserReducer from "app/reducers/currentUserSlice";
import onlineUsersReducer from "app/reducers/onlineUsersSlice";

export const store = configureStore({
	reducer: {
		currentUser: currentUserReducer,
		allUsers: allUsersReducer,
		onlineUsers: onlineUsersReducer
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware({
		serializableCheck: false
	})
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
