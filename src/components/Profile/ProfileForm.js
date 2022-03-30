import { useRef } from 'react'
import { useContext } from 'react'
import classes from './ProfileForm.module.css'
import { authContext } from '../../store/authContext'
import { SECRET_KEY } from '../utils/constants/general'
import { useHistory } from 'react-router-dom'
const ProfileForm = () => {
	const authCtx = useContext(authContext)
	const newPasswordInputRef = useRef()
	const history = useHistory()

	const submitHandler = (event) => {
		event.preventDefault()

		const enteredNewPassword = newPasswordInputRef.current.value

		fetch(
			`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${SECRET_KEY}`,
			{
				method: 'POST',
				body: JSON.stringify({
					idToken: authCtx.token,
					password: enteredNewPassword,
					returnSecureToken: false,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)
			.then((response) => {
				if (response.ok) {
					history.replace('/')
				}
			})
			.catch((error) => {})
	}

	return (
		<form onSubmit={submitHandler} className={classes.form}>
			<div className={classes.control}>
				<label htmlFor='new-password'>New Password</label>
				<input
					type='password'
					id='new-password'
					minLength={7}
					ref={newPasswordInputRef}
				/>
			</div>
			<div className={classes.action}>
				<button>Change Password</button>
			</div>
		</form>
	)
}

export default ProfileForm

