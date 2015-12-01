"use strict";
import ReactDOM from "react-dom";
import React from "react";
import expect from "expect";
import deepFreeze from "deep-freeze";
import { createStore } from "redux";

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
		case "DEFAULT":
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
		case "DEFAULT":
			return state;
	}
}

const store = createStore(todos);
console.log(store.getState());

store.dispatch({
	id: 1,
	text: "the first todo",
	type: "ADD"
})

console.log(store.getState());

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