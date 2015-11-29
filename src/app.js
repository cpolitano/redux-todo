"use strict";
var ReactDOM = require("react-dom");
var React = require("react");

import expect from "expect";
import deepFreeze from "deep-freeze";
import { createStore } from "redux";

const todos = (state = [], action) => {
	switch (action.type) {
		case "ADD":
			return [
				...state,
				{
					id: action.id,
					text: action.text,
					completed: false
				}
			];
		case "TOGGLE":
			return state.map(todo => {
				if (todo.id !== action.id) {
					return todo;
				}

				return {
					...todo,
					completed: !todo.completed
				};
			});
		case "DEFAULT":
			return state;
	}
};

const testAddTodo = () => {
	const stateBefore = [];
	const action = {
		type: "ADD",
		id: 1,
		text: "Try redux"
	};
	const stateAfter = [
		{
			id: 1,
			text: "Try redux",
			completed: false
		}
	];
	deepFreeze(stateBefore);
	deepFreeze(action);
	expect(
		todos(stateBefore, action)
	).toEqual(stateAfter);
};

const testToggleTodo = () => {
	const stateBefore = [
		{
			id: 1,
			text: "Try redux",
			completed: false
		},
		{
			id: 2,
			text: "Write tests",
			completed: false
		}
	];
	const action = {
		type: "TOGGLE",
		id: 1
	};
	const stateAfter = [
		{
			id: 1,
			text: "Try redux",
			completed: true
		},
		{
			id: 2,
			text: "Write tests",
			completed: false
		}
	];
	deepFreeze(stateBefore);
	deepFreeze(action);
	expect(
		todos(stateBefore, action)
	).toEqual(stateAfter);
};

testAddTodo();
testToggleTodo();
console.log("todo tests passed");