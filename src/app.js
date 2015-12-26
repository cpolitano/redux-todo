"use strict";
import ReactDOM from "react-dom";
import React from "react";
const { Component } = React;
import { createStore, combineReducers } from "redux";
// import { Provider } from "react-redux";
// import { todo, todos, visibilityFilter } from "./actions"
import FilterLink from "./filters";

let nextTodoId = 1;

const todo = (state, action) => {
	let nextState;
	let todoAction = {
		"ADD": function() {
			nextState = {
				id: action.id,
				text: action.text,
				completed: false
			};
		},
		"TOGGLE": function() {
			if (state.id !== action.id) {
				nextState = state;
			} else {
				nextState = {
					...state,
					completed: !state.completed
				};
			}
		},
		"DEFAULT": function() {
			nextState = state;
		}
	};

	(todoAction[action.type] || todoAction["DEFAULT"])();

	return nextState;
}

const todos = (state = [], action) => {
	let nextState;
	let todosAction = {
		"ADD": function() {
			nextState = [
				...state,
				todo(undefined, action)
			];
		},
		"TOGGLE": function() {
			nextState = state.map(t => todo(t, action));
		},
		"DEFAULT": function() {
			nextState = state;
		}
	};

	(todosAction[action.type] || todosAction["DEFAULT"])();

	return nextState;
}

const visibilityFilter = (state = "SHOW_ALL", action) => {
	let nextState;
	let filterAction = {
		"SET_VISIBILITY_FILTER": function() {
			nextState = action.filter;
		},
		"DEFAULT": function() {
			nextState = state;
		}
	};

	(filterAction[action.type] || filterAction["DEFAULT"])();

	return nextState;
}

// Combine reducers
const todoApp = combineReducers({
	todos,
	visibilityFilter
});

const AddTodo = (props, { store }) => {
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

AddTodo.contextTypes = {
	store: React.PropTypes.object
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
		const { store } = this.context;
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
		const { store } = this.context;
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

VisibleTodoList.contextTypes = {
	store: React.PropTypes.object
};

const TodoApp = () => (
	<div>
		<AddTodo />
		<VisibleTodoList />
		<Footer />
	</div>
);

class Provider extends Component {
	getChildContext() {
		return {
			store: this.props.store
		};
	}
	render() {
		return this.props.children;
	}
}

Provider.childContextTypes = {
	store: React.PropTypes.object
};

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
	<Provider store={ createStore(todoApp) }>
		<TodoApp />
	</Provider>,
	document.getElementById("react-todo-app")
);
