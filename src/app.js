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

let nextTodoId = 1;
class TodoApp extends Component {
	render() {
		return (
			<div>
				<button onClick={ () => {
					store.dispatch({
						type: "ADD",
						text: "test test",
						id: nextTodoId++
					});
				}}>Add Todo</button>
				<ul>
					{this.props.todos.map(todo => 
						<li key={todo.id}>
							{todo.text}
						</li>
					)}
				</ul>
			</div>
		);
	}
}

// Define render function
const render = () => {
	ReactDOM.render(
		<TodoApp todos={store.getState().todos} />,
		document.getElementById("react-todo-app")
	);
};

store.subscribe(render);
render();
