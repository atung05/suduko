// Anthony Tung, 2022 Nov
"use strict";
console.log("Sudoku_helpers");

// === rc to ===============================================================
function _rc_to_box_index(r, c) {
	// returns internal box index 0-8, from r:0-8, c:0-8
	// let i = _rc_to_box_index(r, c);
	return (r % 3) * 3 + c % 3;
}
function _rc_to_box(r, c) {
	// returns box number
	// let box = _rc_to_box(r, c);
	return (r / 3 | 0) * 3 + c / 3 | 0;
}
// === box to ================================================================
function _box_to_rc(box, i) {
	// returns [r,c]		box:0-9, i:0-9
	// sample
	// let r = _box_to_rc(box)[0];
	// let c = _box_to_rc(box)[1];
	const R = (box / 3 | 0) * 3;
	const C = (box % 3) * 3;
	const BOX = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]];	// box to rc
	return [BOX[i][0] + R, BOX[i][1] + C];
}
function _box_to_cell(box, i) {
	// returns a cell array
	// let cell = _box_to_cell(box, i);
	let r = _box_to_rc(box, i)[0];
	let c = _box_to_rc(box, i)[1];
	let cell = a[r][c];
	return cell;
}
// === hints =================================================================
function _delete_hint_pair_from_box(box, i1, i2, h1, h2) {
	// i1, i2 index to hint pair
	// the value of the 2 hints
	for (let i = 0; i < 9; i++) {			// each index in internal box
		if (i == i1 || i == i2) continue;	// ignore Naked Pair cells
		let r = _box_to_rc(box, i)[0];
		let c = _box_to_rc(box, i)[1];
		if (a[r][c][0]) continue;			// skip, number in this cell
		a[r][c][h1] = 0;					// remove the hints
		a[r][c][h2] = 0;					// remove the hints
	}
}
function _get_hint_pair_from_cell(cell) {
	// returns array of hint pairs from cell
	let h0, h1, count = 0;				// the two hint pairs
	for (let i = 1; i < 10; i++) {
		if (count == 0 && cell[i]) { h0 = i; count++; continue; }
		if (count == 1 && cell[i]) { h1 = i; }
	}
	return [h0, h1];
}
function _delete_hints_from_column_keep_ignore_rows(c, h, R) {
	// return true: if deleted hint/s
	// ignore r[n] if NaN
	// skip over rows:r[]
	let flag = false;
	for (let r = 0; r < 9; r++) {
		if (r == R[0] || r == R[1] || r == R[2]) continue;
		let cell = a[r][c];
		if (cell[h]) {
			a[r][c][h] = 0;
			flag = true;
		}
	}
	return flag;
}
// ===========================================================================
function _number_hints(cell) {
	// returns number of hints
	let sum = 0;
	for (let i = 1; i < 10; i++) {
		sum += cell[i];
	}
	return sum;
}
function _is_same_hints(cell1, cell2) {
	for (let i = 1; i < 10; i++)
		if (cell1[i] != cell2[i]) return false;

	return true;
}
// ===========================================================================
function numberCount() {
	// helper function, returns array with counts of all numbers
	let sum = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (let r = 0; r < 9; r++) {
		for (let c = 0; c < 9; c++) {
			let n = a[r][c][0];
			if (n) sum[n - 1]++;
		}
	}
	_numbersSum = sum;
}