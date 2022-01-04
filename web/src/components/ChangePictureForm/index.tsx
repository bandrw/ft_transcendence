import { useAppSelector } from "hook/reduxHooks";
import { AvatarGenerator } from "random-avatar-generator";
import React, { ChangeEvent, FormEvent } from "react";
import { ImageState, updateAvatar } from "utils/updateAvatar";

export const ChangePictureForm = () => {
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
