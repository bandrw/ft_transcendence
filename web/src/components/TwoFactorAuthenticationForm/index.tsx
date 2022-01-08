import { disable2FA, sendSms, verifySms } from "api/auth";
import CodeVerification from "components/CodeVerification";
import { useAppSelector } from "hook/reduxHooks";
import React, { FormEvent, useCallback } from "react";
import PhoneInput from "react-phone-input-2";
import { getTargetUser } from "utils/getTargetUser";

enum TwoFactorAuthenticationState {
	Disabled = 'disabled',
	Confirmation = 'confirmation',
	Enabled = 'enabled'
}

export const TwoFactorAuthenticationForm = () => {
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { allUsers } = useAppSelector((state) => state.allUsers);
	const user = getTargetUser(allUsers, currentUser.id, 'id'); // allUsers.find((usr) => usr.id === currentUser.id);

	const [phoneNumber, setPhoneNumber] = React.useState(user?.phoneNumber || '');
	const twoFactorAuthenticationIsDisabled = user?.phoneNumber === null;
	const [state, setState] = React.useState<TwoFactorAuthenticationState>(
		twoFactorAuthenticationIsDisabled ? TwoFactorAuthenticationState.Disabled : TwoFactorAuthenticationState.Enabled,
	);

	const verifyCode = useCallback((code: string) => {
		verifySms(code, phoneNumber)
			.then(() => setState(TwoFactorAuthenticationState.Enabled))
			.catch(() => {});
	}, [phoneNumber]);

	const disabledSubmitHandler = useCallback((e: FormEvent) => {
		e.preventDefault();
		sendSms(phoneNumber)
			.then(() => setState(TwoFactorAuthenticationState.Confirmation))
			.catch(() => {});
	}, [phoneNumber]);

	const disableTwoFactorAuthentication = useCallback((e: FormEvent) => {
		e.preventDefault();
		disable2FA()
			.then(() => setState(TwoFactorAuthenticationState.Disabled))
			.catch(() => {});
	}, []);

	if (!user) return <div>No user</div>;

	if (state === 'disabled')
		return (
			<form className='two-factor-authentication-form' onSubmit={disabledSubmitHandler}>
				<p>Two-Factor Authentication</p>
				<span className="edit-window-note">Disabled</span>
				<PhoneInput
					placeholder="Enter phone number"
					inputClass="telephone-number__input"
					country="ru"
					disableDropdown
					onChange={(phone) => setPhoneNumber(`+${phone}`)}
				/> { /* TODO в сафари этот input шире чем в хроме */ }
				<button
					className="edit-window-btn"
					type='submit'
					disabled={phoneNumber.length !== 12}
				>
					Confirm
				</button>
			</form>
		);

	if (state === 'confirmation')
		return (
			<form className='two-factor-authentication-form' onSubmit={(e) => e.preventDefault()}>
				<p>Two-Factor Authentication</p>
				<span className="edit-window-note">Disabled</span>
				<div className='two-factor-authentication-form__code-sent'>{`Code sent to ${phoneNumber}`}</div>
				<CodeVerification submit={verifyCode} />
			</form>
		);

	return (
		<form className='two-factor-authentication-form' onSubmit={disableTwoFactorAuthentication}>
			<p>Two-Factor Authentication</p>
			<span className="edit-window-note">Enabled</span>
			<div className='two-factor-authentication-form__phone-number'>{`Phone number: ${phoneNumber}`}</div>
			<button
				className="edit-window-btn two-factor-authentication-form__disable-btn"
				type='submit'
			>
				Disable
			</button>
		</form>
	);
};
