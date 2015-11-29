"use strict";
var ReactDOM = require("react-dom");
var React = require("react");

import expect from "expect";
import deepFreeze from "deep-freeze";
import { createStore } from "redux";

// Reducer function
const counter = (state = 0, action) => {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1
		case 'DECREMENT':
			return state - 1
		default:
			return state
	}
}

const Counter = ({ 
	value,
	onIncrement,
	onDecrement
}) => (
	<div>
		<h2>{ value }</h2>
		<button onClick={onIncrement}>+</button>
		<button onClick={onDecrement}>-</button>
	</div>
);

// Create the store
const store = createStore(counter);

// Subscribe to the store
store.subscribe(() =>
  console.log(store.getState())
);

const render = () => {
	ReactDOM.render(
		<Counter 
			value={ store.getState() }
			onIncrement={() =>
				store.dispatch({ type: "INCREMENT" })
			}
			onDecrement={() =>
				store.dispatch({ type: "DECREMENT" })
			} />, document.getElementById("app")
	);
}

store.subscribe(render);
render();

const testCounterPlus = () => {
	const counterInitial = 0;
	const counterPlus = 1;
	deepFreeze("counterInitial");
	expect(
		counter(counterInitial, { type: "INCREMENT" })
	).toEqual(counterPlus);
}

const testCounterMinus = () => {
	const counterInitial = 2;
	const counterMinus = 1;
	deepFreeze("counterInitial");
	expect(
		counter(counterInitial, { type: "DECREMENT" })
	).toEqual(counterMinus);
}

testCounterPlus();
testCounterMinus();
console.log("all tests passed");