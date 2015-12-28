"use strict";
import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (
	state,
	ownProps
) => {
	return {
		active: 
			ownProps.filter === state.visibilityFilter
	}
};

const mapDispatchToProps = (
	dispatch,
	ownProps
) => {
	return {
		onClick: () => {
			dispatch({
				type: "SET_VISIBILITY_FILTER",
				filter: ownProps.filter
			});
		}
	}
};

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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Link);
