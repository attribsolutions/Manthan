import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Label,
} from "reactstrap";
import Breadcrumbs from '../../../components/Common/Breadcrumb'
import {
    AvForm,
    AvGroup,
} from "availity-reactstrap-validation";
import { useDispatch, useSelector } from "react-redux";
import AvField from "availity-reactstrap-validation/lib/AvField";
import ReactSelect from "react-select";
import {
    getH_SubModules,
    saveHPages,
    saveHPagesSuccess,
    updateHPages
} from "../../../store/Administrator/HPagesRedux/actions";
import { fetchModelsList } from "../../../store/Administrator/ModulesRedux/actions";
import { MetaTags } from "react-meta-tags";

const HPageMaster = (props) => {
    var editDataGatingFromList = props.state;

    const formRef = useRef(null);
    const dispatch = useDispatch();

    const [selectModule, setSelectModule] = useState('');
    // const [selectSubModule, setSelectSubModule] = useState('');
    const [IsEdit, setIsEdit] = useState(false);
    const [EditData, setEditData] = useState([]);

    const { ModuleData, SubModuleData, SaveMessage } = useSelector((state) => ({
        ModuleData: state.Modules.modulesList,
        SubModuleData: state.H_Pages.SubModulesData,
        SaveMessage: state.H_Pages.saveMessage
    }));

    useEffect(() => {
        dispatch(fetchModelsList())
        document.getElementById("txtName").focus();

        if (!(editDataGatingFromList === undefined)) {
            setEditData(editDataGatingFromList);
            // setSelectSubModule({
            //     label: editDataGatingFromList.SubModuleName,
            //     value: editDataGatingFromList.SubModuleID
            // })
            setSelectModule({
                label: editDataGatingFromList.ModuleName,
                value: editDataGatingFromList.ModuleID
            })
            setIsEdit(true);
        }
    }, [])
    useEffect(() => {
        if ((SaveMessage.Status === true)) {
            dispatch(saveHPagesSuccess({ Status: false }))
            setSelectModule('')
            formRef.current.reset();
        }
    }, [SaveMessage])

    const handleValidSubmit = (event, values) => {    
        const requestOptions = {
            body: JSON.stringify({
                Name: values.Name,
                Description: values.Discription,
                Module: selectModule.value,
                isActive: values.isActive,
                DisplayIndex: values.DisplayIndex,
                Icon: values.Icon,
                ActualPagePath: values.ActualPagePath,
                CreatedBy:1,
                UpdatedBy: 1,
            }),
        };
        if (IsEdit) {
            dispatch(updateHPages(requestOptions.body, EditData.ID));
            formRef.current.reset();
        }
        else {
            dispatch(saveHPages(requestOptions.body));
        }
    };
    const HModuleSelectOnChangeHandller = (e) => {
        setSelectModule(e);
        dispatch(getH_SubModules(e.value))
    }
    // const optionSubModule = SubModuleData.map((d) => ({
    //     value: d.ID,
    //     label: d.Name,
    // }));

    const optionModule = ModuleData.map((d) => ({
        value: d.ID,
        label: d.Name,
    }));

    return (
        <React.Fragment>
            <div className="page-content">
                <MetaTags>
                    <title>Page Master| FoodERP-React FrontEnd</title>
                </MetaTags>
                <Breadcrumbs breadcrumbItem={"Page Master"} />
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <AvForm
                                        onValidSubmit={(e, v) => { handleValidSubmit(e, v) }}
                                        ref={formRef}
                                    >
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Name
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="Name" id="txtName" value={EditData.Name} type="text"
                                                        placeholder=" Please Enter Name "
                                                        autoComplete='off'
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter a Name' },
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Discription
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="Discription" value={EditData.Description} type="text"
                                                        placeholder=" Please Enter Discription "
                                                        autoComplete='off'
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>

                                        <Row className="mb-4">
                                            <Label className="col-sm-3 col-form-label">
                                                Module
                                            </Label>
                                            <Col sm={4}>
                                                <Select
                                                    value={selectModule}
                                                    options={optionModule}
                                                    autoComplete='off'
                                                    onChange={(e) => { HModuleSelectOnChangeHandller(e) }}
                                                />

                                            </Col>
                                        </Row>

                                        {/* <Row className="mb-4">
                                            <Label className="col-sm-3 col-form-label">
                                                Sub Module
                                            </Label>
                                            <Col sm={4}>
                                                <ReactSelect
                                                    value={selectSubModule}
                                                    autoComplete='off'
                                                    options={optionSubModule}
                                                    onChange={(e) => {
                                                        setSelectSubModule(e);
                                                    }}
                                                />
                                            </Col>
                                        </Row> */}
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    DisplayIndex
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="DisplayIndex" value={EditData.DisplayIndex} type="text"
                                                        autoComplete='off' placeholder=" Please Enter DisplayIndex" validate={{
                                                            number: true,
                                                            required: { value: true, errorMessage: 'Please enter a Display Index ' },
                                                        }} />
                                                </Col>
                                            </Row>
                                        </AvGroup>

                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Icon
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="Icon" value={EditData.Icon} type="text"
                                                        placeholder="Please Enter Icon"
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter Icon' },
                                                        }}
                                                        autoComplete='off'
                                                    />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    Actual Page Path
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="ActualPagePath" value={EditData.ActualPagePath} type="text"
                                                        placeholder="Please Enter Actual Page Path"
                                                        validate={{
                                                            required: { value: true, errorMessage: 'Please Enter Actual Page Path' },
                                                        }}
                                                        autoComplete='off' />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <AvGroup>
                                            <Row className="mb-4">
                                                <Label className="col-sm-3 col-form-label">
                                                    IsActive
                                                </Label>
                                                <Col sm={4}>
                                                    <AvField name="IsActive"
                                                        checked={EditData.isActive}
                                                        type="checkbox" validate={{
                                                        }} />
                                                </Col>
                                            </Row>
                                        </AvGroup>
                                        <Row className="justify-content-end">
                                            <Col sm={10}></Col>
                                            <Col sm={2}>
                                                <div>
                                                    {
                                                        IsEdit ? (<button
                                                            type="submit"
                                                            data-mdb-toggle="tooltip" data-mdb-placement="top" title="Update Modules ID"
                                                            className="btn btn-success w-md"
                                                        >
                                                            <i class="fas fa-edit me-2"></i>Update
                                                        </button>) : (
                                                            <button
                                                                type="submit"
                                                                data-mdb-toggle="tooltip" data-mdb-placement="top" title="Save Modules ID"
                                                                className="btn btn-success w-md"
                                                            > <i className="fas fa-save me-2"></i> Save
                                                            </button>
                                                        )
                                                    }
                                                </div>
                                            </Col>{" "}
                                        </Row>
                                    </AvForm>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default HPageMaster;







// version1 day mar4