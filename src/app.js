"use strict";
import ReactDOM from "react-dom";
import React from "react";
const { Component } = React;
import { createStore, combineReducers } from "redux";
// import { Link, FilterLink } from "filters.js";

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

class FilterLink extends Component {
	componentDidMount() {
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

const AddTodo = () => {
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

const Footer = () => (
	<p>
		Filter Todos:<br/>
		<FilterLink
			filter="SHOW_ALL">
			All 
		</FilterLink><br/>
		<FilterLink
			filter="SHOW_ACTIVE">
			Active 
		</FilterLink><br/>
		<FilterLink
			filter="SHOW_COMPLETED">
			Completed 
		</FilterLink>
	</p>
);

class VisibleTodoList extends Component {
	componentDidMount() {
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

const TodoApp = () => (
	<div>
		<AddTodo />
		<VisibleTodoList />
		<Footer />
	</div>
);

ReactDOM.render(
	<TodoApp />,
	document.getElementById("react-todo-app")
);
