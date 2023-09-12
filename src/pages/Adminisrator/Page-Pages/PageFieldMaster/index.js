import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getControlTypes, getFieldValidations, getFieldValidationsForALLType } from '../../../../store/actions';
import {
    Button,
    Col,
    Input,
    Label,
    Row,
    Table,
} from "reactstrap";
import Select from "react-select";
import { Tbody, Thead } from "react-super-responsive-table";
import { C_Select } from '../../../../CustomValidateForm';

function PageFieldMasterTab(props) {
    const dispatch = useDispatch();
    const { pageFieldTabTable, setPageFieldTabTable } = props;

    const {
        ControlTypes,
        fieldValidationLoading,
        fieldValidationsALLType = [],
    } = useSelector((state) => ({
        ControlTypes: state.H_Pages.ControlTypes,
        fieldValidationLoading: state.H_Pages.fieldValidationDropDownLoading,
        fieldValidationsALLType: state.H_Pages.fieldValidationsALLType,
    }));


    const controlTypesOptions = ControlTypes.map((controlType) => ({
        value: controlType.id,
        label: controlType.Name,
    }));

    const addNewRow = () => {
        const newRow = {
            ControlID: '',
            FieldLabel: '',
            ControlType: { label: "select...", value: 0 },
            FieldValidation: { label: "select...", value: 0 },
            InValidMsg: '',
            IsCompulsory: false,
            DefaultSort: 0,
            FieldSequence: '',
            ShowInListPage: false,
            Alignment: '',
            ListPageSeq: '',
            ShowInDownload: false,
            DownloadDefaultSelect: false,
        };
        setPageFieldTabTable([...pageFieldTabTable, newRow]);
    };

    const deleteRow = (key) => {
        const updatedTable = pageFieldTabTable.filter((_, index) => index !== key);
        setPageFieldTabTable(updatedTable);
    };

    const toggleSort = (key) => {
        const updatedTable = pageFieldTabTable.map((item, index) => {
            if (index === key) {
                item.DefaultSort = item.DefaultSort === 1 ? 2 : 1;
            }
            return item;
        });

        setPageFieldTabTable(updatedTable);
    };



    function validtionOptionAssing(controlType) {
        let validationOptions = fieldValidationsALLType.find(item => item.type === controlType)?.data || []
        return validationOptions.map(item => ({ value: item.id, label: item.Name }));
    }

    const handleFieldChange = (event, type = '', key) => {
        setPageFieldTabTable((prevTable) => {
            return prevTable.map((item, index) => {
                if (index === key) {
                    if (type === "ControlType") {
                        item.ControlType = event;
                        item.InValidMsg = event.value === 4 ? '' : item.InValidMsg;
                        item.FieldValidation = "";
                        item.validationOptions = validtionOptionAssing(event.value);
                    } else if (type === "DefaultSort") {
                        item.DefaultSort = event ? 1 : 0;
                    } else if (type === "ShowInDownload" && !event) {
                        item[type] = event;
                        item.DownloadDefaultSelect = false;
                    } else {
                        item[type] = event;
                    }
                } else if (type === "DefaultSort") {
                    item.DefaultSort = 0;
                }

                return item;
            });
        });
    };



    return (
        <>
            <div className="table-rep-plugin mx-n4">
                <div className="table-responsive" data-pattern="priority-columns">
                    <Table className="table table-bordered">
                        <Thead>
                            <tr className="colorhead">
                                <th className="thsticky colorhead">Control ID/Field Label</th>
                                <th>Control Type/Is Compulsory</th>
                                <th>Validation/InValid Msg</th>
                                <th>In List Page</th>
                                <th>List Page Seq/Align</th>
                                <th>In Download</th>
                                <th className="col col-sm-1">Action</th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {pageFieldTabTable.map((TableValue, key) => (
                                <tr key={key}>
                                    <td className='thsticky'>
                                        <div className='mb-1 d-flex'>
                                            <Input
                                                type="text"
                                                id={`ControlID${key}`}
                                                placeholder='Enter Control ID'
                                                autoComplete="off"
                                                value={TableValue.ControlID}
                                                onChange={(e) => handleFieldChange(e.target.value, "ControlID", key)}
                                            />
                                        </div>
                                        <div className='sticky'>
                                            <Input
                                                className='sticky'
                                                type="text"
                                                placeholder='Enter Field Label'
                                                id={`FieldLabel${key}`}
                                                autoComplete="off"
                                                value={TableValue.FieldLabel}
                                                onChange={(e) => handleFieldChange(e.target.value, "FieldLabel", key)}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div className='mb-1'>
                                            <Select
                                                id={`ControlType-${key}`}
                                                value={TableValue.ControlType}
                                                placeholder='Select ControlType'
                                                options={controlTypesOptions}
                                                onChange={(selectedOption) => handleFieldChange(selectedOption, "ControlType", key)}
                                            />
                                        </div>
                                        <div className='d-flex'>
                                            <div>
                                                <Input
                                                    type="checkbox"
                                                    id={`IsCompulsory${key}`}
                                                    disabled={TableValue.ControlType.value === 4}
                                                    checked={TableValue.ControlType.value === 4 ? false : TableValue.IsCompulsory}
                                                    onChange={(e) => handleFieldChange(e.target.checked, "IsCompulsory", key)}
                                                />
                                            </div>
                                            <div><Label> &nbsp;&nbsp;Compulsory</Label></div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='mb-1'>
                                            <C_Select
                                                id={`FieldValidation-${key}`}
                                                autoComplete="off"
                                                value={TableValue.FieldValidation}
                                                placeholder='Select Field Validation'
                                                isLoading={fieldValidationLoading}
                                                options={TableValue.validationOptions || []}
                                                onChange={(selectedOption) => handleFieldChange(selectedOption, "FieldValidation", key)}
                                            />
                                        </div>
                                        <div >
                                            <Input
                                                type="text"
                                                id={`InValidMsg${key}`}
                                                autoComplete="off"
                                                placeholder='Enter Validation Msg'
                                                disabled={TableValue.ControlType.value === 4}
                                                value={TableValue.InValidMsg}
                                                onChange={(e) => handleFieldChange(e.target.value, "InValidMsg", key)}
                                            />
                                        </div>

                                    </td>
                                    <td>
                                        <div className='mb-1 d-flex'>
                                            <div>
                                                <Input
                                                    type="checkbox"
                                                    id={`ShowInListPage${key}`}
                                                    checked={TableValue.ShowInListPage}
                                                    onChange={(e) => handleFieldChange(e.target.checked, "ShowInListPage", key)}
                                                />
                                            </div>
                                            <div><Label>&nbsp;&nbsp;Show</Label></div>

                                        </div>
                                        <div className="d-flex">

                                            <div className='d-flex'>
                                                <Input
                                                    type="radio"
                                                    name={`btnradio${key}`}
                                                    value={`DefaultSort${key}`}
                                                    id={`DefaultSort${key}`}
                                                    disabled={!TableValue.ShowInListPage}
                                                    checked={TableValue.DefaultSort}
                                                    onChange={(e) => handleFieldChange(e.target.checked, "DefaultSort", key)}
                                                />
                                                {TableValue.DefaultSort > 0 && (
                                                    <div>
                                                        <i
                                                            className="bx bx-caret-up font-size-20 text-danger"
                                                            style={{ display: TableValue.DefaultSort === 1 ? "block" : "none" }}
                                                            onClick={() => toggleSort(key)}
                                                        />
                                                        <i
                                                            className="bx bx-caret-down font-size-20 text-danger"
                                                            style={{ display: TableValue.DefaultSort === 2 ? "block" : "none" }}
                                                            onClick={() => toggleSort(key)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <div><Label>&nbsp;&nbsp;Sort</Label></div>

                                        </div>


                                    </td>

                                    <td>
                                        <div className='mb-1'>
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                id={`ListPageSeq${key}`}
                                                placeholder='Enter Sequence'
                                                value={pageFieldTabTable[key].ListPageSeq}
                                                onChange={(e) => handleFieldChange(e.target.value, "ListPageSeq", key)}>

                                            </Input>
                                        </div>
                                        <div >
                                            <Input
                                                autoComplete="off"
                                                type="text"
                                                id={`Alignment${key}`}
                                                placeholder='Enter Alignment'
                                                value={pageFieldTabTable[key].Alignment}
                                                onChange={(e) => handleFieldChange(e.target.value, "Alignment", key)}>

                                            </Input>
                                        </div>
                                    </td>


                                    <td>
                                        <div className='mb-1 d-flex'>
                                            <div>
                                                <Input
                                                    type="checkbox"
                                                    id={`ShowInDownload${key}`}
                                                    defaultChecked={TableValue.ShowInDownload}
                                                    onChange={(e) => handleFieldChange(e.target.checked, "ShowInDownload", key)}
                                                />
                                            </div>
                                            <div><Label> &nbsp;&nbsp;Show</Label></div>

                                        </div>
                                        <div className='d-flex'>
                                            <div>
                                                <Input
                                                    type="checkbox"
                                                    id={`DownloadDefaultSelect${key}`}
                                                    disabled={!TableValue.ShowInDownload}
                                                    checked={TableValue.DownloadDefaultSelect}
                                                    onChange={(e) => handleFieldChange(e.target.checked, "DownloadDefaultSelect", key)}
                                                />
                                            </div>

                                            <div><Label> &nbsp;&nbsp;Default</Label></div>
                                        </div>
                                    </td>
                                    <td>
                                        {pageFieldTabTable.length === key + 1 ? (
                                            <Row>
                                                <Col md={6} className="mt-3">
                                                    {pageFieldTabTable.length > 0 && (
                                                        <i
                                                            className="mdi mdi-trash-can d-block text-danger font-size-20"
                                                            onClick={() => deleteRow(key)}
                                                        />
                                                    )}
                                                </Col>
                                                <Col md={6}>
                                                    <div className="d-flex justify-content-center mt-3">
                                                        <Button
                                                            className="btn btn-success btn-sm"
                                                            type="button"
                                                            onClick={() => addNewRow()}
                                                        ><i className="dripicons-plus" />
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        ) : (
                                            <i
                                                className="mdi mdi-trash-can d-block text-danger font-size-20"
                                                onClick={() => deleteRow(key)}
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </Tbody>
                    </Table>
                    {pageFieldTabTable.length === 0 && (
                        <div className="d-flex justify-content-center mt-3">
                            <Button
                                type="button"
                                onClick={addNewRow}
                                className="btn btn-success btn-sm"
                            > Add New Row
                                <i className="dripicons-plus" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default PageFieldMasterTab;
