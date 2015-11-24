"use strict";

import { createStore } from "redux";

console.log("hello world");

// Reducer function
function counter(state = 0, action) {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1
		case 'DECREMENT':
			return state - 1
		default:
			return state
	}
}

// Create the store
let store = createStore(counter);

// Subscribe to the store
store.subscribe(() =>
  console.log(store.getState())
);

// Test out functions
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'INCREMENT' })
store.dispatch({ type: 'DECREMENT' })

ReactDOM.render(
	document.getElementById("app")
);
