import React, { useEffect } from 'react';
import { Button, Col, Input, Row, Table, } from 'reactstrap';
import { Tbody, Thead } from 'react-super-responsive-table';
import { useDispatch, useSelector } from 'react-redux';
import { PartyAddressDeleteID, PartyAddressDeleteIDSuccess } from '../../../../../store/Administrator/PartyRedux/action';
import { customAlert } from '../../../../../CustomAlert/ConfirmDialog';
import { deltBtnCss, editBtnCss } from '../../../../../components/Common/ListActionsButtons';
import "./editDeleteCss.scss"
import { date_dmy_func } from '../../../../../components/Common/CommonFunction';

function AddressDetailsTable({ addressTable = [], setAddressTable, selectedRow, onEdit }) {

	const dispatch = useDispatch();

	const {
		deleteMessage,
	} = useSelector((state) => ({
		deleteMessage: state.PartyMasterReducer.PartyAddressDelete,
	}));

	useEffect(() => {

		if (deleteMessage.Status === true && deleteMessage.StatusCode === 200) {

			dispatch(PartyAddressDeleteIDSuccess({ Status: false }));
			if (!(deleteMessage.deleteId === 0)) {
				var fil = addressTable.filter((i) => {
					return !(i.id === deleteMessage.deleteId);
				});
				setAddressTable(fil);
			}
			customAlert({
				Type: 1,
				Status: true,
				Message: deleteMessage.Message,

			})

		} else if (deleteMessage.Status === true) {
			dispatch(PartyAddressDeleteIDSuccess({ Status: false }));
			customAlert({
				Type: 3,
				Status: true,
				Message: JSON.stringify(deleteMessage.Message),
			})
		}
	}, [deleteMessage]);

	const ondeleteHandeler = (ele) => {

		if (ele.id === undefined) {
			if (!(ele.RowId === 0)) {
				var fil = addressTable.filter((i) => {
					return !(i.RowId === ele.RowId);
				});
				setAddressTable(fil);
			}
		}
		else {
			dispatch(PartyAddressDeleteID({ deleteId: ele.id, btnId: `btn-delete-${ele.id}` }))
		}
	};

	function defaultChangeHandler(key) {

		const newtableData = addressTable.map((ele, k) => {
			ele.IsDefault = false;
			if (k === key) {
				ele.IsDefault = true;
			}
			return ele
		});
		setAddressTable(newtableData)
	}

	function myFunction(row) {

		var x = document.getElementById("add-img");

		if (x.style.display === "none") {
			x.src = row.fssaidocument
			x.style.display = "block";
		} else {
			x.style.display = "none";
		}
	}

	const onEditHandlerHandeler = (row) => {
		onEdit(row); // Pass the selected row to the parent component
	}

	// const tableRows = addressTable.map((info, key) => {
	// 	debugger
	// 	return (
	// 		<tr>
	// 			<td>{info.Address}</td>
	// 			<td>{info.FSSAINo}</td>
	// 			<td>{info.FSSAIExipry}</td>
	// 			<td>
	// 				<button
	// 					type='button'
	// 					onClick={() => { myFunction(info) }}
	// 					className="badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light">
	// 					Show Image
	// 				</button>
	// 			</td>
	// 			<td>{info.PIN}</td>
	// 			< td><Input type="radio"
	// 				name="btnradio"
	// 				id={`radioButton${key}`}
	// 				defaultChecked={info.IsDefault ? true : false}
	// 				onClick={(e) => defaultChangeHandler(key)} />
	// 				{`${info.IsDefault}`}
	// 			</td>

	// 			<td >
	// 				<Row >
	// 					<div className="col col-6">
	// 						<Button
	// 							className={editBtnCss}
	// 							data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Party Type"
	// 							onClick={(e) =>
	// 								onEditHandlerHandeler(info)
	// 							}
	// 						>
	// 							<i className="mdi mdi-pencil font-size-16"></i>
	// 						</Button>
	// 					</div>

	// 					<div className="col col-6">
	// 						<Button
	// 							className={deltBtnCss}
	// 							data-mdb-toggle="tooltip" data-mdb-placement="top" title="Delete Party Type"
	// 							disabled={info.IsDefault === false ? false : true}
	// 							onClick={(e) =>
	// 								ondeleteHandeler(info)
	// 							}
	// 						>
	// 							<i className="mdi mdi-delete font-size-18"></i>
	// 						</Button>
	// 					</div></Row>


	// 			</td>

	// 		</tr >
	// 	);
	// });

	const tableRows = addressTable.map((info, key) => {

		return (
			<tr key={key}>
				<td>{info.Address}</td>
				<td>{info.FSSAINo}</td>
				<td>{date_dmy_func(info.FSSAIExipry)}</td>
				<td>
					<button
						type='button'
						onClick={() => { myFunction(info) }}
						className="badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light">
						Show Image
					</button>
				</td>
				<td>{info.PIN}</td>
				<td>
					<Input type="radio"
						name="btnradio"
						id={`radioButton${key}`}
						checked={info.IsDefault} // Use checked attribute to set the radio button state
						onChange={(e) => defaultChangeHandler(key)} />
					{`${info.IsDefault}`}
				</td>
				<td>
					<Button
						className={`btn-edit ${editBtnCss}`}
						data-mdb-toggle="tooltip"
						data-mdb-placement="top"
						title="Edit Party Type"
						onClick={() => onEditHandlerHandeler(info)}
					>
						<i className="mdi mdi-pencil font-size-18"></i>
					</Button>

					<Button
						className={`btn-delete ${deltBtnCss}`}
						data-mdb-toggle="tooltip"
						data-mdb-placement="top"
						title="Delete Party Type"
						disabled={info.IsDefault === false ? false : true}
						onClick={() => ondeleteHandeler(info)}
					>
						<i className="mdi mdi-delete font-size-18"></i>
					</Button>
				</td>
			</tr>
		);
	});

	return (
		<>
			<div>
				< img id='add-img' className='abc1' src={''} />
				{addressTable.length > 0 ?
					<Table className="table table-bordered table-hover">
						<Thead>
							<tr>
								<th className="col col-sm-3">Address</th>
								<th className="col col-sm-2">FSSAINo</th>
								<th className="col col-sm-2">FSSAIExipry</th>
								<th className="col col-sm-2">FSSAI Document</th>
								<th className="col col-sm-1">PIN</th>
								<th className="col col-sm-1">IsDefault</th>
								<th className="col col-sm-2">Action</th>
							</tr>
						</Thead>
						<Tbody>{tableRows}</Tbody>
					</Table>
					: null}
			</div>
		</>
	);
}

export default AddressDetailsTable;
