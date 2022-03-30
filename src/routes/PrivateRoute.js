import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component, path, when, to }) => {
	return (
		<Route
			path={path}
			render={() => {
				return when === true ? component : <Redirect to={to} />
			}}
		/>
	)
}

export default PrivateRoute