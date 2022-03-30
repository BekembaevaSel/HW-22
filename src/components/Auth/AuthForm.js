import { useState, useContext } from 'react'
import { useRef } from 'react'
import { SECRET_KEY } from '../utils/constants/general'
import { authContext } from '../../store/authContext'
import classes from './AuthForm.module.css'
import { useHistory } from 'react-router-dom'

const AuthForm = () => {
	const authCtx = useContext(authContext)
	const history = useHistory()
	const emailInputRef = useRef()
	const passwordInputRef = useRef()
	const [isLogin, setIsLogin] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	// const [isLogedIn, setIsLogedIn] = useState(false)

	const switchAuthModeHandler = () => {
		setIsLogin((prevState) => !prevState)
	}

	const cleanValue = (valueRef) => {
		return (valueRef.current.value = '')
	}

	const submitHandler = (e) => {
		e.preventDefault()

		const enteredEmail = emailInputRef.current.value
		const enteredPassword = passwordInputRef.current.value

		setIsLoading(true)

		let url

		if (isLogin) {
			url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${SECRET_KEY}`
			fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					email: enteredEmail,
					password: enteredPassword,
					returnSecureToken: true,
				}),
				headers: {
					'Content-type': 'application/json',
				},
			})
				.then((response) => {
					if (response.ok) {
						return response.json()
					}
				})
				.then((result) => {
					authCtx.login(result.idToken)
					history.replace('/profile')
				})
		} else {
			url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${SECRET_KEY}`
			fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					email: enteredEmail,
					password: enteredPassword,
					returnSecureToken: true,
				}),
				headers: {
					'Content-type': 'application/json',
				},
			})
				.then((response) => {
					setIsLoading(false)

					if (response.ok) {
						return response.json()
					} else {
						response.json().then((data) => {
							let errorMsg = 'auth failed'
							if (data && data.error && data.error.message) {
								errorMsg = data.error.message
							}
							throw new Error(errorMsg)
						})
					}
				})
				.then((data) => {
					authCtx.login(data.idToken)
					history.replace('/')
				})
				.catch((err) => {
					alert(err.message)
				})
			cleanValue(emailInputRef)
			cleanValue(passwordInputRef)
		}
	}
	return (
		<section className={classes.auth}>
			<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<label htmlFor='email'>Your Email</label>
					<input
						ref={emailInputRef}
						type='email'
						id='email'
						required
					/>
				</div>
				<div className={classes.control}>
					<label htmlFor='password'>Your Password</label>
					<input
						ref={passwordInputRef}
						type='password'
						id='password'
						required
					/>
				</div>
				<div className={classes.actions}>
					{!isLoading && (
						<button>{isLogin ? 'Login' : 'Create Account'}</button>
					)}
					<button
						type='button'
						className={classes.toggle}
						onClick={switchAuthModeHandler}
					>
						{isLogin
							? 'Create new account'
							: 'Login with existing account'}
					</button>
					{isLoading && <p>sending request</p>}
					{/* {isLogedIn && <p>Вы удачно зарегистрировались! </p>} */}
				</div>
			</form>
		</section>
	)
}

export default AuthForm
