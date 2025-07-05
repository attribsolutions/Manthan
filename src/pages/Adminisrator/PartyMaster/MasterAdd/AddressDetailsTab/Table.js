import React, { useEffect, useRef, useState, } from 'react';
import { Button, Input, Modal, Table, } from 'reactstrap';
import { Tbody, Thead } from 'react-super-responsive-table';
import { useDispatch, useSelector } from 'react-redux';
import { PartyAddressDeleteID, PartyAddressDeleteIDSuccess } from '../../../../../store/Administrator/PartyRedux/action';
import { customAlert } from '../../../../../CustomAlert/ConfirmDialog';
import { deltBtnCss, editBtnCss } from '../../../../../components/Common/ListActionsButtons';
import "./editDeleteCss.scss"
import { date_dmy_func, getFileExtensionType } from '../../../../../components/Common/CommonFunction';
import Slidewithcaption from '../../../../../components/Common/CommonImageComponent';
import { alertMessages } from '../../../../../components/Common/CommonErrorMsg/alertMsg';

function AddressDetailsTable({ addressTable = [], setAddressTable, onEdit }) {

	const selectedRowIndexRef = useRef(-1);

	const dispatch = useDispatch();
	const [modal_backdrop, setmodal_backdrop] = useState(false);   // Image Model open Or not

	const [FssaiDocument, setFssaiDocument] = useState([]);   // Image Model open Or not



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


	// useEffect(() => {
	// 	if (imageTable.length > 0) {
	// 		setmodal_backdrop(true)
	// 	}
	// }, [imageTable])

	function tog_backdrop() {
		setmodal_backdrop(!modal_backdrop)
		removeBodyCss()
	}
	function removeBodyCss() {
		document.body.classList.add("no_padding")
	}

	const ondeleteHandeler = (ele) => {

		if (ele.id === undefined) {
			if (!(ele.RowID === 0)) {
				var fil = addressTable.filter((i) => {
					return !(i.RowID === ele.RowID);
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

	async function myFunction(row) {
		debugger
		const file = row.file;

		if ((!(file || (row.fssaidocumenturl !== "" && row.fssaidocumenturl !== null)))) {
			customAlert({
				Type: 3,
				Message: alertMessages.imageNotUploaded,
			});
			return;
		}
		if (file) {
			const fileURL = URL.createObjectURL(file);
			// const fileType = file.type;
			const fileType = getFileExtensionType(file.name)

			if (fileType === "Document") {
				// Open PDF in new tab
				window.open(fileURL, "_blank");
			} else if (fileType === "Image") {
				// Show image in modal
				setFssaiDocument([{ Image: fileURL }]);
				setmodal_backdrop(true);
			} else {
				customAlert({
					Type: 3,
					Message: "Unsupported file format.",
				});
			}
		} else if (row.fssaidocumenturl !== "" && row.filename !== "") {
			const fileType = getFileExtensionType(row.filename)

			if (fileType === "Document") {
				window.open(row.fssaidocumenturl, "_blank");
			} else if (fileType === "Image") {
				setFssaiDocument([{ Image: row.fssaidocumenturl }]);
				setmodal_backdrop(true);
			} else {
				customAlert({
					Type: 3,
					Message: "Unsupported file format.",
				});
			}
		}
	}


	const onEditHandlerHandeler = (row) => {
		onEdit(row); // Pass the selected row to the parent component
	}

	const tableRows = addressTable.map((info, key) => {

		return (
			<tr key={key} className={key === selectedRowIndexRef.current ? 'selected' : ''}>
				<td>{info.Address}</td>
				<td>{info.FSSAINo}</td>
				<td>{date_dmy_func(info.FSSAIExipry)}</td>
				<td>
					<button
						type='button'
						onClick={() => { myFunction(info) }}
						className="badge badge-soft-info font-size-12 btn btn-info waves-effect waves-light w-xxs border border-light">
						Show Document
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
						onClick={() => {
							onEditHandlerHandeler(info);
							selectedRowIndexRef.current = key; // Set the selected row index
						}}
					><i className="mdi mdi-pencil font-size-18"></i></Button>

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
			<div style={{ maxHeight: '400px', overflowY: 'auto' }}>
				<Modal
					isOpen={modal_backdrop}
					toggle={() => {
						tog_backdrop()
					}}

					style={{ width: "800px", height: "800px", borderRadius: "50%" }}
					className="modal-dialog-centered "
				>
					{(FssaiDocument.length > 0) && <Slidewithcaption Images={FssaiDocument} />}
				</Modal>
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
