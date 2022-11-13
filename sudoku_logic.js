// Anthony Tung, 2022 Nov
"use strict";
console.log("sudoku_logic");

const a = [];
let _numbersSum = [];
let _numberFocus = 0;	// 0, 1-9
let _state = 0;			// 0:build number, 1:run, 9:fault
const STR_GAME0 = [
	"000060198 086005400 920030076", // medium
	"060080210 807000904 049070060",
	"670040081 008700650 135020000"
];
const STR_GAME1 = [
	"067800409 805000020 009000610",	// expert
	"094372180 003961045 100000007",
	"070008094 908036070 351704860"
];
const STR_GAME2 = [
	"790000600 003904000 000080093",	// Hidden Single
	"032000000 907040200 810200907",
	"579426000 000500760 100030509"
];
const STR_GAME3 = [
	"079000601 001067000 624900370",	// 3. Naked Pair, need a2,a3,a3 or a3 a2 a3
	"006004000 000105060 930000000",
	"065000893 798003500 003589000"
];
const S = [ // source array
	// "000060198 086005400 920030076", // medium
	// "060080210 807000904 049070060",
	// "670040081 008700650 135020000"

	// "067800409 805000020 009000610",	// expert
	// "094372180 003961045 100000007",
	// "070008094 908036070 351704860"

	// "000079000 060000200 300000000",	// extreme, need more techniques
	// "509000004 000200800 070060000",
	// "000000059 800600000 000000070"

	// "790000600 003904000 000080093",	// Hidden Single
	// "032000000 907040200 810200907",
	// "579426000 000500760 100030509"

	// "079000601 001067000 624900370",	// 3. Naked Pair, need a2,a3,a3 or a3 a2 a3
	// "006004000 000105060 930000000",
	// "065000893 798003500 003589000"

	// "400000938 032094100 095300240",	// https://www.sudokuwiki.org/Naked_Candidates
	// "370609004 529001673 604703090",	// Naked Pairs
	// "957008300 003900400 240030709"

	// "080090030 030000069 902063158",	// https://www.sudokuwiki.org/Naked_Candidates
	// "020804590 851907046 394605870",	// 3. Naked Pairs box
	// "563040987 200000015 010050020"

	// "470300218 082401703 130080045",	// 4. Pointing Pair (Triple) buggy
	// "010000300 603015400 740030001",
	// "801000539 007500104 054100070"

	"090007050 050800000 140050200",	// http://www.sudokubeginner.com/pointing-pair/
	"704090000 381700596 509080704",
	"075038041 010006070 030170080"

];
if (init(S)) {
	console.log("game array", a);
	hints_delete();		// required
	a1_Naked_Single();
	//a2_Hidden_Single();
	a1_Naked_Single();
	a3_Naked_Pair();
	a3_Naked_Pair();
	a2_Hidden_Single();
	a1_Naked_Single();

	//a2_Hidden_Single();
	//a3_Naked_Pair();
	// a2_Hidden_Single();
	//a2_Hidden_Single();

	//a4_Pointing_Pair();

	displayRefresh();
	//numberCount();
	//throw new Error("stop!");

	// let count = 0;
	// do {
	// 	displayRefresh();
	// 	//a2_Hidden_Single();
	// 	console.log("count:" + ++count);
	// } while (a1_Naked_Single());
} else {
	//_message1 = "input game invalid";
}
displayRefresh();
// === 1. Naked Singles ======================================================
function a1_Naked_Single() {
	// no return value, loops until all Naked Singles found
	// changes hints and numbers
	console.log("a1_Naked_Single");
	let flag;
	do {
		flag = false;
		for (let r = 0; r < 9; r++) {			// row
			for (let c = 0; c < 9; c++) {		// column
				let n = 0;						// first hint found
				let sum = 0;					// hints counter, stop if greater then 1
				if (a[r][c][0]) continue;		// cell has number, skip it
				// is empty cell
				for (let i = 1; i < 10; i++) {	// scan for a single in hints
					if (a[r][c][i]) {			// has hint:1, not 0
						n = i;					// save this hint
						sum++;
					}
					if (sum > 1) break;			// more then 2 solutions for this cell
				}
				if (sum == 1) {					// Naked Single found
					a[r][c] = [n, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// insert number, remove hints
					flag = true;
				}
			}
		}
		if (flag) hints_delete();
	} while (flag);								// loops until all Naked Singles found
}
// === 2. Hidden Singles =====================================================
function a2_Hidden_Single() {
	// return true if number changed
	// find all hidden singles
	// remove hints and updates number, runs hints_build_all() if number added
	console.log("a2_Hidden_Single");
	for (let r = 0; r < 9; r++) {
		if (hidden_single_row(r)) hints_delete();
	}
	for (let c = 0; c < 9; c++) {
		if (hidden_single_column(c)) hints_delete();
	}
	for (let box = 0; box < 9; box++) {
		if (hidden_single_box(box)) hints_delete();
	}
	// ===
	function hidden_single_row(r) {
		// return true if number changed
		// find all hidden singles
		// remove hints and updates number
		let flag = false;
		for (let i = 1; i < 10; i++) {		// start with hint "1"
			let n = 0;						// first hint found
			let sum = 0;					// hints counter, stop if greater then 1
			for (let c = 0; c < 9; c++) {	// scan each column
				if (a[r][c][0]) continue;	// cell has number, skip it
				// is empty cell
				let cell = a[r][c];
				if (cell[i]) {				// has hint
					n = c;					// remember the column
					sum++;
				}
				if (sum > 1) break;			// skip further scans, its not a hidden single
			}
			if (sum == 1) {
				a[r][n] = [i, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// insert number, remove hints
				flag = true;
			}
		}
		return flag;
	}
	function hidden_single_column(c) {
		// return true if number changed
		// find all hidden singles
		// remove hints and updates number
		let flag = false;
		for (let i = 1; i < 10; i++) {		// start with hint "1"
			let n = 0;						// first hint found
			let sum = 0;					// hints counter, stop if greater then 1
			for (let r = 0; r < 9; r++) {	// scan each row
				if (a[r][c][0]) continue;	// skip, cell has number
				// is empty cell
				let cell = a[r][c];
				if (cell[i]) {				// has hint
					n = r;					// remember the row
					sum++;
				}
				if (sum > 1) break;			// skip further scans, its not a hidden single
			}
			if (sum == 1) {
				a[n][c] = [i, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];	// insert number, remove hints
				flag = true;
			}
		}
		return flag;
	}
	function hidden_single_box(box) {
		// return true if number changed
		// find all hidden singles
		// remove hints and updates number
		// start with hint 1,2,3,4,5,6,7,8,9
		let flag = false;
		for (let i = 1; i < 10; i++) {		// start with hint "1"
			let r_hint = 0;					// first hint found
			let c_hint = 0;					// first hint found
			let sum = 0;					// hints counter, stop if greater then 1
			for (let j = 0; j < 9; j++) {	// search each cell
				let cell = _box_to_cell(box, j);
				if (cell[0]) continue;		// skip, cell has number, no hints here
				// is empty cell
				if (cell[i]) {				// has hint, a 1
					r_hint = _box_to_rc(box, j)[0];	// remember the cell with single hint
					c_hint = _box_to_rc(box, j)[1];	// remember the cell with single hint
					sum++;
				}
				if (sum > 1) break;			// skip further scans, its not a hidden single
			}
			if (sum == 1) {
				a[r_hint][c_hint] = [i, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				flag = true;
			}
		}
		return flag;
	}
}
// ===3. Naked Pair ==========================================================
function a3_Naked_Pair() {
	console.log("a3_Naked_Pair");
	for (let r = 0; r < 9; r++)
		if (naked_pair_row(r))		// this function does not change number, only deletes hints
			a1_Naked_Single();		// therefore need to run Naked Singles to create numbers

	for (let c = 0; c < 9; c++)
		if (naked_pair_column(c))	// this function does not change number, only deletes hints
			a1_Naked_Single();		// therefore need to run Naked Singles to create numbers

	for (let i = 0; i < 9; i++)
		if (naked_pair_box(i))		// this function does not change number, only deletes hints
			a1_Naked_Single();		// therefore need to run Naked Singles to create numbers
	//==
	function naked_pair_box(box) {
		// search for the first Naked Pair of hints in a box
		// returns true if hints deleted
		//console.log("naked_pair_box");
		let flag = false;
		let cell, i1, i2;
		for (i1 = 0; i1 < 9; i1++) {			// scan row
			cell = _box_to_cell(box, i1);
			if (_number_hints(cell) != 2) continue;
			// found a pair (cell)
			for (i2 = i1 + 1; i2 < 9; i2++) {	// search for second matching pair
				let cell2 = _box_to_cell(box, i2);
				if (_number_hints(cell2) != 2) continue;
				if (_is_same_hints(cell, cell2)) {	// found second pair, has it got same hints?
					flag = true;
					break;
				}
			}
			if (flag) break;
		}
		if (flag) {		// found naked pair box
			// find the values of the 2 hints
			//console.log("flag", cell, i1, i2);
			let h1 = _get_hint_pair_from_cell(cell)[0];
			let h2 = _get_hint_pair_from_cell(cell)[1];
			_delete_hint_pair_from_box(box, i1, i2, h1, h2);
			return flag;
		}
	}
	function naked_pair_column(c) {
		// search for the first Naked Pair of hints in a column
		// returns true if hints deleted
		//console.log("naked_pair_column");
		let flag = false;
		let cell, r1, r2;
		for (r1 = 0; r1 < 9; r1++) {			// scan row
			cell = a[r1][c];
			if (_number_hints(cell) != 2) continue;
			// found a pair (cell)
			for (r2 = r1 + 1; r2 < 9; r2++) {	// search for second matching pair
				let cell2 = a[r2][c];
				if (_number_hints(cell2) != 2) continue;
				if (_is_same_hints(cell, cell2)) {	// found second pair, has it got same hints?
					flag = true;
					break;
				}
			}
			if (flag) break;
		}
		if (flag) {		// found naked pair row
			// find the values of the 2 hints
			let h0 = _get_hint_pair_from_cell(cell)[0];
			let h1 = _get_hint_pair_from_cell(cell)[1];

			// remove 2 hints from other columns in this row
			for (let r = 0; r < 9; r++) {			// remove the 2 hints from same column
				if (r == r1 | r == r2) continue;	// don't remove hints from the 2 Naked Pairs
				a[r][c][h0] = 0;					// remove the hints
				a[r][c][h1] = 0;					// remove the hints
			}
			// if pair is in same box, remove hints, h1 and h2
			let box = _rc_to_box(r1, c);
			let box2 = _rc_to_box(r2, c);
			if (box == box2) {
				const i1 = _rc_to_box_index(r1, c);		// index in box
				const i2 = _rc_to_box_index(r2, c);		// index in box
				_delete_hint_pair_from_box(box, i1, i2, h0, h1);
			}
			return flag;
		}
	}
	function naked_pair_row(r) {
		// search for the first Naked Pair of hints in a row
		// returns true if hints deleted
		//console.log("naked_pair_row");
		let flag = false;
		let cell, c1, c2;
		for (c1 = 0; c1 < 9; c1++) {			// scan column
			cell = a[r][c1];
			if (_number_hints(cell) != 2) continue;
			// found a pair (cell)
			for (c2 = c1 + 1; c2 < 9; c2++) {	// search for second matching pair
				let cell2 = a[r][c2];
				if (_number_hints(cell2) != 2) continue;
				if (_is_same_hints(cell, cell2)) {	// found second pair, has it got same hints?
					flag = true;
					break;
				}
			}
			if (flag) break;
		}
		if (flag) {		// found naked pair row
			// find the values of the 2 hints
			let h0 = _get_hint_pair_from_cell(cell)[0];
			let h1 = _get_hint_pair_from_cell(cell)[1];
			// remove 2 hints from other columns in this row
			for (let c = 0; c < 9; c++) {			// remove the 2 hints from same row
				if (c == c1 | c == c2) continue;	// don't remove hints from the 2 Naked Pairs
				a[r][c][h0] = 0;					// remove the hints
				a[r][c][h1] = 0;					// remove the hints
			}
			// if pair is in same box, remove hints, h1 and h2
			let box = _rc_to_box(r, c1);
			let box2 = _rc_to_box(r, c2);
			if (box == box2) {
				const i1 = _rc_to_box_index(r, c1);		// index in box
				const i2 = _rc_to_box_index(r, c2);		// index in box
				_delete_hint_pair_from_box(box, i1, i2, h0, h1);
			}
			return flag;
		}
	}
}
// === 4. Pointing Pair (Triple) =============================================
function a4_Pointing_Pair() {
	// first 3 indexes are allowed, next 6 are invalid indexes
	const COL = [[0, 3, 6, 1, 4, 7, 2, 5, 8], [1, 4, 7, 0, 3, 6, 2, 5, 8], [2, 5, 8, 0, 3, 6, 1, 4, 7]];
	const ROW = [[0, 3, 6, 1, 4, 7, 2, 5, 8], [1, 4, 7, 0, 3, 6, 2, 5, 8], [2, 5, 8, 0, 3, 6, 1, 4, 7]];
	pp(8);		// test

	function pp(box) {
		console.log("Pointing Pair (Triple)");
		let group = 0;		// 0-2
		let h = 0;			// loop through all hints
		let candidate_count = 0, candidate_missing = 0, flag = true;
		let row_of_pairs = [NaN, NaN, NaN];
		for (let i2 = 0; i2 < 9; i2++) {		// loop through COL array
			let i = COL[group][i2];				// choose box internal index
			let cell = _box_to_cell(box, i);
			let hint = cell[h];
			if (l2 < 3) {		// must appear

				row_of_pairs[candidate_count] = r;
				candidate_count++
			}
			else {				// must not appear
				candidate_missing++;
			}
			if (candidate_count >= 2 && candidate_missing == 0) {
				flag = true;
				// remove all hints from this column
			}
		}
	}
}
// === hints array update ====================================================
function hints_delete() {
	// no return value
	// remove hints because same number exists in row/column/box
	// does not change numbers list

	for (let c = 0; c < 9; c++) hints_delete_column(c);
	for (let r = 0; r < 9; r++) hints_delete_row(r);
	for (let i = 0; i < 9; i++) hints_delete_box(i);
	// ===
	function hints_delete_row(r) {
		// remove hints from array
		for (let c = 0; c < 9; c++) {			// each cell
			if (a[r][c][0]) continue;			// cell has number, skip it
			for (let c2 = 0; c2 < 9; c2++) {	// compare each column in row to this cell
				if (c2 == c) continue;			// don't compare cell to itself
				let n = a[r][c2][0];			// get number
				if (n) a[r][c][n] = 0;			// if cell has a number, remove that number from this cell's hints list
			}
		}
	}
	function hints_delete_column(c) {
		// remove hints from array
		for (let r = 0; r < 9; r++) {
			if (a[r][c][0]) continue;			// cell has number, skip it
			// is empty cell
			for (let r2 = 0; r2 < 9; r2++) {	// compare each column in row to cell
				if (r2 == r) continue;			// don't compare cell to itself
				let n = a[r2][c][0];			// get number
				if (n) a[r][c][n] = 0;			// if cell has a number, remove that number from this cell's hints list

			}
		}
	}
	function hints_delete_box(box) {
		// for each empty cell find other cells with numbers and remove hints
		for (let i = 0; i < 9; i++) {
			let cell = _box_to_cell(box, i);
			if (cell[0]) continue;			// skip, not empty cell, no hints
			for (let h = 0; h < 9; h++) {	// compare each numbered cell to this empty cell
				if (h == i) continue;		// skip, don't compare hints to itself
				let cell2 = _box_to_cell(box, h);
				let n = cell2[0];			// get number
				if (n) cell[n] = 0;			// if cell has a number, remove that number from this cell's hints list
			}
		}
	}
}
// ===========================================================================
function init(strArray) {
	// returns true if valid a array created
	// make 3 dimensional array and insert S string array into a array.
	// data structure format [ num, hint 1-9, org num]
	_state = 1;			// run state
	_errorMsg = "";
	for (let r = 0; r < 9; r++) a[r] = []; // build 2D array

	let i = 0;
	for (let k = 0; k < 3; k++) {		// get each string
		let str = strArray[k];
		if (str.length != 29) {
			console.log("init string error 1");
			_errorMsg = "init error:string length must be 29 characters: 123456789 123456789 123456789";
			_state = 9;					// stop, fault
			return false
		}
		for (let j = 0; j < 29; j++) {
			if (j == 9 || j == 19) {
				if (str[j] != " ") {
					console.log("init string error 2");
					_errorMsg = "init error:string length must have space between digit groups char:" + str[j];
					_state = 9;			// stop, fault
					return false;
				}
			}
			else {
				let n = str[j];
				if (isNaN(parseFloat(n))) {
					console.log("init string error 3");
					_errorMsg = "init error:not numbers:" + n;
					_state = 9;			// stop, fault
					return false;
				}
				n = +n;			// convert to number
				let r = i / 9 | 0;
				let c = i % 9;
				i++;
				if (n) a[r][c] = [n, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];	// has a number
				else a[r][c] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0];	// no number
			}
		}
	}
	return true;
}
function clearBoard() {
	//console.log("clearBoard");
	_state = 0;
	for(let r = 0; r < 9; r++) {
		for(let c = 0; c < 9; c++) {
			a[r][c] = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0];	// no number
		}
	}
	displayRefresh();
}
// ===========================================================================
//drawPattern();
//setInterval(drawPattern, 500);

