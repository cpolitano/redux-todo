"use strict";
import ReactDOM from "react-dom";
import React from "react";
const { Component } = React;
import { createStore, combineReducers } from "redux";

const todo = (state, action) => {
	switch (action.type) {
		case "ADD":
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case "TOGGLE":
			if (state.id !== action.id) {
				return state;
			}
			return {
				...state,
				completed: !state.completed
			};
		default:
			return state;
	}
}

const todos = (state = [], action) => {
	switch (action.type) {
		case "ADD":
			return [
				...state,
				todo(undefined, action)
			];
		case "TOGGLE":
			return state.map(t => todo(t, action))
		default:
			return state;
	}
}

const visibilityFilter = (state = "SHOW_ALL", action) => {
	switch (action.type) {
		case "SET_VISIBILITY_FILTER":
			return action.filter;
		default:
			return state;
	}
}

// Combine reducers
const todoApp = combineReducers({
	todos,
	visibilityFilter
});

// Create store
const store = createStore(todoApp, {});

// Subscribe to the store
store.subscribe(() =>
  console.log(store.getState())
);

store.dispatch({
	id: 0,
	text: "the first todo",
	type: "ADD"
})

const FilterLink = ({
	filter,
	currentFilter,
	children
}) => {
	if ( filter === currentFilter ) {
		return <span>{children}</span>
	}
	return (
		<a href="#"
			onClick={ event => {
				event.preventDefault();
				store.dispatch({
					type: "SET_VISIBILITY_FILTER",
					filter
				})
			}}
		>{children}</a>
	);
}

const getVisibleTodos = (
	todos,
	filter
) => {
	switch (filter) {
		case "SHOW_ALL":
			return todos;
		case "SHOW_ACTIVE":
			return todos.filter(todo => !todo.completed)
		case "SHOW_COMPLETED":
			return todos.filter(todo => todo.completed)
	}
}

let nextTodoId = 1;
class TodoApp extends Component {
	render() {
		const {
			todos,
			visibilityFilter
		} = this.props;
		const visibleTodos = getVisibleTodos(
			todos,
			visibilityFilter
		);
		return (
			<div>
				<input ref={ node => {
					this.input = node;
				}} />
				<button onClick={ () => {
					store.dispatch({
						type: "ADD",
						text: this.input.value,
						id: nextTodoId++
					});
					this.input.value = "";
				}}>Add Todo</button>
				<ul>
					{visibleTodos.map(todo => 
						<li key={todo.id}
							onClick={ () => {
								store.dispatch({
									type: "TOGGLE",
									id: todo.id
								})
							}}
							style={{
								textDecoration: 
									todo.completed ? "line-through" : "none"
							}}>
							{todo.text}
						</li>
					)}
				</ul>
				<p>
					Filter Todos:<br/>
					<FilterLink
						filter="SHOW_ALL"
						currentFilter={visibilityFilter}>
						All 
					</FilterLink><br/>
					<FilterLink
						filter="SHOW_ACTIVE"
						currentFilter={visibilityFilter}>
						Active 
					</FilterLink><br/>
					<FilterLink
						filter="SHOW_COMPLETED"
						currentFilter={visibilityFilter}>
						Completed 
					</FilterLink>
				</p>
			</div>
		);
	}
}

// Define render function
const render = () => {
	ReactDOM.render(
		<TodoApp {...store.getState()} />,
		document.getElementById("react-todo-app")
	);
};

store.subscribe(render);
render();
