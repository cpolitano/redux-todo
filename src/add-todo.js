"use strict";
import React from "react";
import { connect } from "react-redux";

let nextTodoId = 1;

let AddTodo = ({ dispatch }) => {
	let input;

	return (
		<div>
			<input ref={ node => {
				input = node;
			}} />
			<button onClick={ () => {
				dispatch({
					type: "ADD",
					text: input.value,
					id: nextTodoId++
				})
				input.value = "";
			}}>Add Todo</button>
		</div>
	);
};

export default AddTodo = connect()(AddTodo);
