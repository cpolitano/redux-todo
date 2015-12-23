"use strict";
import ReactDOM from "react-dom";
import React from "react";
const { Component } = React;
import { createStore, combineReducers } from "redux";
// import { todo, todos, visibilityFilter } from "./actions"
import FilterLink from "./filters";

let nextTodoId = 1;

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

const AddTodo = ({ store }) => {
	let input;

	return (
		<div>
			<input ref={ node => {
				input = node;
			}} />
			<button onClick={ () => {
				store.dispatch({
					type: "ADD",
					text: input.value,
					id: nextTodoId++
				})
				input.value = "";
			}}>Add Todo</button>
		</div>
	);
};

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

const Footer = ({ store }) => (
	<p>
		Filter Todos:<br/>
		<FilterLink
			filter="SHOW_ALL"
			store={store}>
			All 
		</FilterLink><br/>
		<FilterLink
			filter="SHOW_ACTIVE"
			store={store}>
			Active 
		</FilterLink><br/>
		<FilterLink
			filter="SHOW_COMPLETED"
			store={store}>
			Completed 
		</FilterLink>
	</p>
);

class VisibleTodoList extends Component {

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
			<TodoList
				todos={
					getVisibleTodos(
						state.todos,
						state.visibilityFilter
					)
				}
				onTodoClick={id => 
					store.dispatch({
						type: "TOGGLE",
						id
					})
				} />
		);
	}
}

const TodoApp = ({ store }) => (
	<div>
		<AddTodo store={store} />
		<VisibleTodoList store={store} />
		<Footer store={store} />
	</div>
);

// Subscribe to the store
// store.subscribe(() =>
//   console.log(store.getState())
// );

// store.dispatch({
// 	id: 0,
// 	text: "the first todo",
// 	type: "ADD"
// })

ReactDOM.render(
	<TodoApp store={ createStore(todoApp) } />,
	document.getElementById("react-todo-app")
);
