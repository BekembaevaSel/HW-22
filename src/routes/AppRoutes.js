import { useContext } from 'react'
import { Switch, Route } from 'react-router-dom'
import UserProfile from '../components/Profile/UserProfile'
import AuthPage from '../pages/AuthPage'
import HomePage from '../pages/HomePage'
import { authContext } from '../store/authContext'
import { Redirect } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'

const AppRoutes = () => {
	const authCtx = useContext(authContext)
	return (
		<Switch>
			<Route path='/' exact>
				<HomePage />
			</Route>
			<PrivateRoute
				path='/auth'
				component={<AuthPage />}
				when={!authCtx.isLoggedIn}
				to='/'
			/>

			<PrivateRoute
				path='/profile'
				component={<UserProfile />}
				when={authCtx.isLoggedIn}
				to='/auth'
			/>

			<Route path='*'>
				<Redirect to='/' />
			</Route>
		</Switch>
	)
}

export default AppRoutes