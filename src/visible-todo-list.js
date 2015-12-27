"use strict";
import React from "react";
const { Component } = React;
import { connect } from "react-redux";

const Todo = ({
	onClick,
	completed,
	text
}) => (
	<li onClick ={onClick}
		style={{
			textDecoration: 
				completed ? "line-through" : "none"
		}}>
		{text}
	</li>
);

const TodoList = ({
	todos,
	onTodoClick
}) => (
	<ul>
		{todos.map(todo => 
			<Todo 
				key={todo.id}
				{...todo}
				onClick={() => onTodoClick(todo.id)} />
		)}
	</ul>
);

const getVisibleTodos = (todos, filter) => {
	let filteredTodos;
	let filterCondition = {
		"SHOW_ALL": function() {
			filteredTodos = todos;
		},
		"SHOW_ACTIVE": function() {
			filteredTodos = todos.filter(todo => !todo.completed);
		},
		"SHOW_COMPLETED": function() {
			filteredTodos = todos.filter(todo => todo.completed);
		}
	};

	filterCondition[filter]();
	
	return filteredTodos;
}

const mapStateToProps = (state) => {
	return {
		todos: getVisibleTodos(
			state.todos,
			state.visibilityFilter
		)
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		onTodoClick: (id) => {
			dispatch({
				type: "TOGGLE",
				id
			})
		}
	}
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TodoList);
