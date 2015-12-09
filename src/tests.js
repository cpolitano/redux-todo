"use strict";
import expect from "expect";
import deepFreeze from "deep-freeze";

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

// testAddTodo();
// testToggleTodo();
// console.log("todo tests passed");

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

// testCounterPlus();
// testCounterMinus();
// console.log("counter tests passed");