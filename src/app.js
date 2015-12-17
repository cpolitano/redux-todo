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
	children,
	onClick
}) => {
	if ( filter === currentFilter ) {
		return <span>{children}</span>
	}
	return (
		<a href="#"
			onClick={ event => {
				event.preventDefault();
				onClick(filter);
			}}
		>{children}</a>
	);
}

const AddTodo = ({
	onAddClick
}) => {
	let input;
	return (
		<div>
			<input ref={ node => {
				input = node;
			}} />
			<button onClick={ () => {
				onAddClick(input.value);
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

const Footer = ({
	visibilityFilter,
	onFilterClick
}) => (
	<p>
		Filter Todos:<br/>
		<FilterLink
			filter="SHOW_ALL"
			currentFilter={visibilityFilter}
			onClick={onFilterClick}>
			All 
		</FilterLink><br/>
		<FilterLink
			filter="SHOW_ACTIVE"
			currentFilter={visibilityFilter}
			onClick={onFilterClick}>
			Active 
		</FilterLink><br/>
		<FilterLink
			filter="SHOW_COMPLETED"
			currentFilter={visibilityFilter}
			onClick={onFilterClick}>
			Completed 
		</FilterLink>
	</p>
);

let nextTodoId = 1;
const TodoApp = ({
	todos,
	visibilityFilter
}) => (
	<div>
		<AddTodo 
			onAddClick = {text => 
				store.dispatch({
					type: "ADD",
					text: text,
					id: nextTodoId++
				});
			}/>
		<TodoList
			todos={
				getVisibleTodos(
					todos,
					visibilityFilter
				)
			} 
			onTodoClick={id =>
				store.dispatch({
					type: "TOGGLE",
					id
				})
			} />
		<Footer 
			visibilityFilter={visibilityFilter}
			onFilterClick={filter => 
				store.dispatch({
					type: "SET_VISIBILITY_FILTER",
					filter
				});
			} />
	</div>
);

// Define render function
const render = () => {
	ReactDOM.render(
		<TodoApp {...store.getState()} />,
		document.getElementById("react-todo-app")
	);
};

store.subscribe(render);
render();
