"use strict";

var _redux = require("redux");

// Reducer function
var ReactDOM = require("react-dom");
var React = require("react");

var counter = function counter(state, action) {
	if (state === undefined) state = 0;

	switch (action.type) {
		case 'INCREMENT':
			return state + 1;
		case 'DECREMENT':
			return state - 1;
		default:
			return state;
	}
};

var Counter = function Counter(_ref) {
	var value = _ref.value;
	var onIncrement = _ref.onIncrement;
	var onDecrement = _ref.onDecrement;
	return React.createElement(
		"div",
		null,
		React.createElement(
			"h2",
			null,
			value
		),
		React.createElement(
			"button",
			{ onClick: onIncrement },
			"+"
		),
		React.createElement(
			"button",
			{ onClick: onDecrement },
			"-"
		)
	);
};

// Create the store
var store = (0, _redux.createStore)(counter);

// Subscribe to the store
store.subscribe(function () {
	return console.log(store.getState());
});

// Test out functions
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'DECREMENT' });

var render = function render() {
	ReactDOM.render(React.createElement(Counter, {
		value: store.getState(),
		onIncrement: function () {
			return store.dispatch({ type: 'INCREMENT' });
		},
		onDecrement: function () {
			return store.dispatch({ type: 'DECREMENT' });
		} }), document.getElementById("app"));
};

store.subscribe(render);
render();