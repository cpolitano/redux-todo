"use strict";
import React from "react";
const { Component } = React;

const Link = ({
	active,
	children,
	onClick
}) => {
	if ( active ) {
		return <span>{children}</span>
	}
	return (
		<a href="#"
			onClick={ event => {
				event.preventDefault();
				onClick();
			}}
		>{children}</a>
	);
}

export default class FilterLink extends Component {

	componentDidMount() {
		const { store } = this.props;
		this.unsubscribe = store.subscribe(() => 
			// force re-render when redux store updates
			this.forceUpdate()
		);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const props = this.props;
		const { store } = props;
		const state = store.getState();

		return (
			<Link 
				active={
					props.filter === state.visibilityFilter
				}
				onClick={() => 
					store.dispatch({
						type: "SET_VISIBILITY_FILTER",
						filter: props.filter
					})
				}
			>
				{props.children}
			</Link>
		);
	}
}
