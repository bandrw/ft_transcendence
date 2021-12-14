import './styles.scss';
import 'react-phone-input-2/lib/style.css';

import { useAppSelector } from 'app/hooks';
import { getToken } from 'app/token';
import axios from 'axios';
import CodeVerification from "components/CodeVerification";
import { AvatarGenerator } from 'random-avatar-generator';
import React, { ChangeEvent, FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import { useHistory } from 'react-router-dom';

type ImageState = {
	type: 'generated' | 'uploaded';
	image: string | ArrayBuffer | null;
	file: File | null;
};

const updateAvatar = async (imageState: ImageState) => {
	if (imageState.type === 'generated') {
		const data = {
			urlAvatar: imageState.image,
		};

		return axios.post('/users/updateAvatar', data, {
			headers: { Authorization: `Bearer ${getToken()}` },
		});
	}

	if (imageState.type === 'uploaded') {
		if (!imageState.file) return;

		const formData = new FormData();
		formData.append('picture', imageState.file);

		return axios.post('/users/uploadAvatar', formData, {
			headers: { Authorization: `Bearer ${getToken()}` },
		});
	}
};

const updateUsername = async (username: string) => {
	const data = {
		username,
	};

	return axios.post('/users/updateUsername', data, {
		headers: { Authorization: `Bearer ${getToken()}` },
	});
};

interface IChangeUsername {
	newUsername: string;
}

const ChangeUsernameForm = () => {
	const history = useHistory();
	const { allUsers } = useAppSelector((state) => state.allUsers);
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { register, handleSubmit } = useForm<IChangeUsername>();
	const [usernameInput, setUsernameInput] = React.useState<string>(currentUser.username);

	const usernameIsValid = () => {
		return !(
			usernameInput.length < 4 ||
			usernameInput.length > 16 ||
			allUsers.find((usr) => usr.login === usernameInput)
		);
	};

	const changeUsername = ({ newUsername }: IChangeUsername) => {
		if (!usernameIsValid()) return;

		updateUsername(newUsername).then(() => history.push(`/users/${newUsername}`));
	};

	return (
		<form onSubmit={handleSubmit(changeUsername)}>
			<p>Change username</p>
			<input
				type="text"
				{...register('newUsername')}
				placeholder="Enter new username"
				defaultValue={currentUser.username}
				onChange={(e) => setUsernameInput(e.target.value)}
				required
			/>
			<button className="edit-window-btn" type="submit" disabled={!usernameIsValid()}>
				Save
			</button>
		</form>
	);
};

const ChangePictureForm = () => {
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const [imageState, setImageState] = React.useState<ImageState>({
		type: 'uploaded',
		image: currentUser.urlAvatar,
		file: null,
	});

	const saveNewPicture = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		updateAvatar(imageState).then();
	};

	const previewPicture = (e: ChangeEvent<HTMLInputElement>) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.readyState === 2) {
				setImageState((prev) => ({ type: 'uploaded', image: reader.result, file: prev.file }));
			}
		};

		if (e.target.files) {
			reader.readAsDataURL(e.target.files[0]);
			setImageState((prev) => ({
				type: prev.type,
				image: prev.image,
				file: e.target.files ? e.target.files[0] : null,
			}));
		}
	};

	const generatePicture = () => {
		const generator = new AvatarGenerator();
		const avatar = generator.generateRandomAvatar();
		setImageState({ type: 'generated', image: avatar, file: null });
	};

	return (
		<form onSubmit={saveNewPicture}>
			<p>Change Picture</p>
			<section>
				<div
					className="user-profile-header__edit-window-picture"
					style={{ backgroundImage: `url(${imageState.image})` }}
				/>
				<div className="section-right">
					<button className="edit-window-btn" onClick={generatePicture} type="button">
						Generate
					</button>
					<div>or</div>
					<label className="edit-window-btn" htmlFor="edit-window-upload">
						<input
							id="edit-window-upload"
							name="picture"
							type="file"
							onChange={previewPicture}
							accept=".jpg, .jpeg, .png"
						/>
						Upload
					</label>
				</div>
			</section>
			<button className="edit-window-btn" type="submit">
				Save
			</button>
		</form>
	);
};

const TwoFactorAuthenticationForm = () => {
	const { currentUser } = useAppSelector((state) => state.currentUser);
	const { allUsers } = useAppSelector((state) => state.allUsers);
	const user = allUsers.find((usr) => usr.id === currentUser.id);
	const [phoneNumber, setPhoneNumber] = React.useState(user?.phoneNumber || '');

	if (!user) throw new Error('[TwoFactorAuthenticationForm] No user');

	const twoFactorAuthenticationIsDisabled = user.phoneNumber === null;
	const [state, setState] = React.useState<'disabled' | 'confirmation' | 'enabled'>(twoFactorAuthenticationIsDisabled ? 'disabled' : 'enabled');

	const verifyCode = (code: string) => {
		axios.get('/auth/verifySms', {
			params: { code, phoneNumber },
			headers: { Authorization: `Bearer ${getToken()}` },
		})
			.then(() => setState('enabled'))
			.catch(() => {});
	};

	const disabledSubmitHandler = (e: FormEvent) => {
		e.preventDefault();
		axios.get('/auth/sendSms', {
			params: { phoneNumber },
			headers: { Authorization: `Bearer ${getToken()}` },
		})
			.then(() => setState('confirmation'));
	};

	const disableTwoFactorAuthentication = (e: FormEvent) => {
		e.preventDefault();
		axios.post('/auth/disable2FA', null, {
			headers: { Authorization: `Bearer ${getToken()}` },
		})
			.then(() => setState('disabled'));
	};

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

const UserEditWindow = () => {
	return (
		<div onClick={(e) => e.stopPropagation()} className="user-profile-header__edit-window-wrapper">
			<div className="user-profile-header__edit-window">
				<ChangeUsernameForm />
				<ChangePictureForm />
				<TwoFactorAuthenticationForm />
			</div>
		</div>
	);
};

export default UserEditWindow;
