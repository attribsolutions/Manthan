
import React, {
	useMemo,
	useRef,
	useState,
	useEffect,
} from 'react';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './ItemSaleCSS.scss';

import {C_Select } from '../../CustomValidateForm';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { C_Button } from '../../components/Common/CommonButton';
import { ItemSaleContext } from './ContextDataProvider';

function convertFieldsToNumber(obj) {

	for (const key in obj) {
		if (typeof obj[key] === "string" && !isNaN(obj[key])) {
			obj[key] = Number(obj[key]);
		} else if (typeof obj[key] === "object") {
			convertFieldsToNumber(obj[key]);
		}
	}
}

const GridExample = () => {
	const gridRef = useRef();

	const { initaialBaseData, setPivotMode } = ItemSaleContext();

	const rowData = useMemo(() => initaialBaseData.map(item => {
		convertFieldsToNumber(item)
		return item
	},[initaialBaseData]));

	const [addRowSelect, setAddRowSelect] = useState([]);
	const [addColumnSelect, setAddColumnSelect] = useState([]);
	const [addSumSelect, setAddSumSelect] = useState([]);


	const dataFields = useMemo(
		() => {
			return Object.keys(rowData[0] ? rowData[0] : {}).map(item => ({ value: item || "", label: item || "" }))
		}, [rowData]);

	const [columnDefs, setColumnDefs] = useState([]);

	useEffect(() => {
		function updateGridHeight() {
			const container = document.querySelector('.ag-grid-container');
			if (container) {
				const availableHeight = window.innerHeight - container.getBoundingClientRect().top;
				container.style.maxHeight = `${availableHeight + 40}px`;
			}
		}

		// Initial height update
		updateGridHeight();

		// Listen for window resize events and update the height
		window.addEventListener('resize', updateGridHeight);

		// Cleanup the event listener when the component unmounts
		return () => {
			window.removeEventListener('resize', updateGridHeight);
		};
	}, []);


	function showValueOnChange(row, col, sum) {

		let rowGroup = row.map(item => ({
			headerName: item.label,
			field: item.value,
			rowGroup: true
		}));

		let colGroup = col.map(item => ({
			headerName: item.label,
			field: item.value,
			pivot: true
		}));
		let sumGroup = sum.map(item => ({
			headerName: item.label,
			field: item.value,
			aggFunc: 'sum'
		}));

		setColumnDefs([...rowGroup, ...colGroup, ...sumGroup])
	}

	return (
		<React.Fragment >

			<div className=" px-3 text-black mt-1 mb-1  " style={{ backgroundColor: "#f2f2d7" }}>
				<Row>
					<Col sm={3}>
						<FormGroup className="mb-1 row mt-2">
							<Label className="col-sm-3 p-2">Rows</Label>
							<Col sm={6}>
								<C_Select
									isMulti
									options={dataFields}
									value={addRowSelect}
									onChange={(selectedValues, event) => {
										setAddRowSelect(selectedValues)
										// showValueOnChange(selectedValues, addColumnSelect, addSumSelect)
									}
									}
								/>
							</Col>
						</FormGroup>
					</Col>

					<Col sm={3} className="custom-to-date-col">
						<FormGroup className="mb-1 row mt-2">
							<div style={{ marginLeft: "1px", marginTop: "10px", width: "5px", }}></div>
							<Label className="col-sm-4 p-2">Columns</Label>
							<Col>
								<C_Select
									isMulti
									options={dataFields}
									value={addColumnSelect}
									onChange={(selectedValues) => {
										setAddColumnSelect(selectedValues);
										// showValueOnChange(addRowSelect, addColumnSelect,selectedValues)
									}
									}
								/>
							</Col>
						</FormGroup>
					</Col>


					<Col sm={3}>
						<FormGroup className="mb-1 mt-2 row mt-2">
							<Label className="col-sm-4 p-2">Sums</Label>
							<Col>
								<C_Select
									isMulti
									options={dataFields}
									value={addSumSelect}
									onChange={(selectedValues) => {
										setAddSumSelect(selectedValues);
										// showValueOnChange(addRowSelect, selectedValues, addSumSelect)
									}
									}
								/>
							</Col>
						</FormGroup>
					</Col>

					<Col sm="3" className="mt-2 mb-1" >
						<div style={{ float: "right" }}>
							<samp>
								<C_Button
									className="btn btn-primary border-1 font-size-12 text-center"
									onClick={() => showValueOnChange(addRowSelect, addColumnSelect, addSumSelect)}>
									Apply</C_Button >

							</samp>
							<samp style={{ paddingLeft: "5px" }}>
								<C_Button
									className="btn btn-warning  font-size-12 text-center"
									onClick={() => { setPivotMode(pree => !pree) }}>
									<span className="font-weight-bold"
										style={{ fontWeight: "bold", fontSize: "14px", color: 'black' }}>
										Back</span>
								</C_Button >
							</samp>
						</div>

					</Col>
				</Row>
			</div>


			<div className="ag-theme-alpine-dark  ag-grid-container" style={{ width: '100%', overflowX: 'auto' }}>

				<AgGridReact
					ref={gridRef}
					rowData={rowData}
					columnDefs={columnDefs}
					pivotMode={true}
					groupDefaultExpanded={1}
					animateRows={true}

				/>
			</div>
		</React.Fragment>
	);
};
export default GridExample
