"use strict";
import React from "react";
import { connect } from "react-redux";

let nextTodoId = 1;
let addTodoAction = (text) => {
	return 	{
		type: "ADD",
		id: nextTodoId++,
		text
	}
}

let AddTodo = ({ dispatch }) => {
	let input;

	return (
		<div>
			<input ref={ node => {
				input = node;
			}} />
			<button onClick={ () => {
				// dispatch({
				// 	type: "ADD",
				// 	text: input.value,
				// 	id: nextTodoId++
				// })
				dispatch(addTodoAction(input.value));
				input.value = "";
			}}>Add Todo</button>
		</div>
	);
};

export default AddTodo = connect()(AddTodo);
