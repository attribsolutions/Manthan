
import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Modal,
    Row
} from "reactstrap";
import Select from "react-select";
import { MetaTags } from "react-meta-tags";
import {

    Item_Image_Upload,
    Item_Image_Upload_Success,
    commonPageField,
    commonPageFieldSuccess,
    getItemList,

} from "../../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    comAddPageFieldFunc,
    initialFiledFunc,
    onChangeSelect,
} from "../../../../components/Common/validationFunction";

import {

    metaTagLabel
} from "../../../../components/Common/CommonFunction";
import { mode, url, pageId } from "../../../../routes/index";
import { userAccessUseEffect } from "../../../../components/Common/CommonUseEffect";
import { customAlert } from "../../../../CustomAlert/ConfirmDialog";
import Slidewithcaption from "../../../../components/Common/CommonImageComponent";
import { GetItemImageUpload } from "../../../../helpers/backend_helper";
import { C_Button } from "../../../../components/Common/CommonButton";

const ItemImageUpload = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();

    const fileds = {

        ItemName: "",

    }

    const [state, setState] = useState(() => initialFiledFunc(fileds))
    const [pageMode, setPageMode] = useState(mode.defaultsave);
    const [modalCss, setModalCss] = useState(false);
    const [userPageAccessState, setUserAccState] = useState('');
    const [Image, setImage] = useState({})
    const [imageTable, setImageTable] = useState([]);  // Selected Image Array
    const [modal_backdrop, setmodal_backdrop] = useState(false);   // Image Model open Or not
    const [changeButtonShow, setChangeButtonShow] = useState(false);
    const [ImageToUpload, setImageToUpload] = useState({})







    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        postMsg,
        pageField,
        UploadImageLoading,
        ItemList,
        UploadImage,
        userAccess } = useSelector((state) => ({
            saveBtnloading: state.GroupReducer.saveBtnloading,
            postMsg: state.GroupReducer.postMsg,
            ItemList: state.ItemMastersReducer.ItemList,
            UploadImage: state.ItemMastersReducer.UploadImage,
            UploadImageLoading: state.ItemMastersReducer.UploadImageLoading,
            userAccess: state.Login.RoleAccessUpdateData,
            pageField: state.CommonPageFieldReducer.pageField
        }));

    const { values } = state
    const { isError } = state;
    const { fieldLabel } = state;

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)
    const hasShowModal = props.hasOwnProperty(mode.editValue)

    useEffect(() => {
        const page_Id = pageId.GROUP
        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id))
        dispatch(getItemList());

    }, []);

    // userAccess useEffect
    useEffect(() => userAccessUseEffect({
        props,
        userAccess,
        dispatch,
        setUserAccState,

    }), [userAccess]);



    useEffect(async () => {

        if (UploadImage.Status === true && UploadImage.StatusCode === 200) {
            dispatch(Item_Image_Upload_Success({ Status: false }));
            customAlert({
                Type: 3,
                Message: JSON.stringify(UploadImage.Message),
            })
            const response = await GetItemImageUpload({ ItemId: values.ItemName.value })
            setImage(response.Data)
        }


    }, [UploadImage])

    useEffect(() => {
        if (values.ItemName.value > 0) {
            // setSelectedParty(commonPartyDropSelect);
            setChangeButtonShow(true)
        }
    }, [values]);


    const ItemOnChange = () => {

        setChangeButtonShow(false)
        setState((i) => {

            const a = { ...i }
            a.values.ItemName = { value: 0, label: "select..." }
            return a
        })
        setImage([])
        document.getElementById('ResetForm1').reset();
        document.getElementById('ResetForm2').reset();
        document.getElementById('ResetForm3').reset();

    };

    useEffect(() => {
        if (imageTable.length > 0) {
            setmodal_backdrop(true)
        }
    }, [imageTable])

    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop)
        removeBodyCss()
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }


    useEffect(() => {
        if (pageField) {
            const fieldArr = pageField.PageFieldMaster
            comAddPageFieldFunc({ state, setState, fieldArr })
        }
    }, [pageField])

    const Items = ItemList.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

    useEffect(async () => {
        if (values.ItemName.value > 0) {
            const response = await GetItemImageUpload({ ItemId: values.ItemName.value })
            setImage(response.Data)
        }
    }, [values])






    const onchangeHandler = async ({ event, Type, TypeOf }) => {

        const obj = {
            file: event.target.files[0],
            ImageType: Type
        }
        setImageToUpload({
            ...ImageToUpload, [TypeOf]: obj,
        })

    }

    const imageShowHandler = async ({ Type }) => { // image Show handler

        if ((values.ItemName === "") || (values.ItemName.value === 0)) {
            customAlert({
                Type: 3,
                Message: "Please Select Item",
            })
            return
        }
        debugger
        let slides = []
        if (Object.values(ImageToUpload).length > 0) {
            Object.values(ImageToUpload).forEach((element) => {
                if (element.ImageType === Type) {
                    if (element.file instanceof File) {
                        slides = [{
                            Image: URL.createObjectURL(element.file)
                        }];
                    }

                }
            });

        } else {

            Object.values(Image).forEach((element) => {
                if (element.ImageType === Type) {
                    if (!(element.file instanceof File)) {
                        slides = [{
                            Image: `http://cbmfooderp.com:8000${element.Item_pic}`
                            // Image: `http://192.168.1.114:8000${element.Item_pic}`
                        }];
                    }

                }
            });
        }



        setImageTable(slides)

    }


    const imageUploadHandler = ({ Type }) => {
        debugger
        if ((values.ItemName === "") || (values.ItemName.value === 0)) {
            customAlert({
                Type: 3,
                Message: "Please Select Item",
            })
            return
        }
        const formData = new FormData()
        try {
            formData.append(`Item`, values.ItemName.value);
            formData.append(`ImageType`, Type);
            Object.values(ImageToUpload).forEach((element) => {
                debugger
                if (element.ImageType === Type) {
                    formData.append(`Item_pic`, element.file);
                    dispatch(Item_Image_Upload({ formData }));
                }
            });
        } catch (e) { console.log(e) }


    }


    const GetimageUrl = ({ Type }) => {
        let imageUrl = '';

        Object.values(Image).forEach((element) => {
            if (element.ImageType === Type && !(element.file instanceof File) && element.Item_pic !== null) {
                // imageUrl = `http://192.168.1.114:8000${element.Item_pic}`;
                imageUrl = `http://cbmfooderp.com:8000${element.Item_pic}`

            }
        });

        return imageUrl; // Return the found image URL (or an empty string if not found)
    };



    // IsEditMode_Css is use of module Edit_mode (reduce page-content marging)

    if ((modalCss) || (pageMode === mode.dropdownAdd));

    if (!(userPageAccessState === '')) {
        return (
            <React.Fragment>
                <div className="page-content" >
                    <Modal
                        isOpen={modal_backdrop}
                        toggle={() => {
                            tog_backdrop()
                        }}

                        style={{ width: "800px", height: "800px", borderRadius: "50%" }}
                        className="modal-dialog-centered "
                    >
                        {(imageTable.length > 0) && <Slidewithcaption Images={imageTable} />}
                    </Modal>
                    <Container fluid>
                        <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>

                        <Card className="text-black">
                            <CardHeader className="card-header   text-black c_card_header" >
                                <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
                                <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
                            </CardHeader>

                            <CardBody className=" vh-10 0 text-black " >
                                <CardBody className="  c_card_header text-black mb-2" >

                                    {/* <div className="px-2 c_card_header text-black mb-1"> */}

                                    <Row>
                                        <FormGroup className="mb-2 col col-sm-4 " >
                                            <Label >Item</Label>
                                            <Select
                                                name="ItemName"
                                                value={values.ItemName}
                                                isSearchable={true}
                                                className="react-dropdown mt-n1"
                                                classNamePrefix="dropdown"
                                                isDisabled={(changeButtonShow && !(values.ItemName.value === 0))}
                                                options={Items}
                                                onChange={(hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState, })}
                                            />
                                        </FormGroup>


                                        <Col sm="1" className="mt-2">
                                            {(!(changeButtonShow)) ?
                                                <C_Button
                                                    type="button"
                                                    className="btn btn-outline-primary border-1 font-size-12 text-center mt-3"
                                                // onClick={updateSelectedParty}
                                                >
                                                    Select
                                                </C_Button>
                                                :
                                                <C_Button
                                                    type="button"
                                                    spinnerColor={"info"}
                                                    className="btn btn-outline-info border-1 font-size-12 mt-3 "
                                                    onClick={ItemOnChange}
                                                >Change</C_Button>

                                            }
                                        </Col>

                                    </Row>
                                    {/* </div> */}
                                </CardBody>


                                <form noValidate>
                                    <Card>
                                        <CardBody className="c_card_body">
                                            <Row>
                                                <Col sm={4}>
                                                    <FormGroup className="mb-3  " >
                                                        <Label >Front View</Label>
                                                        <form id="ResetForm1">
                                                            <Input type="file" className="form-control "
                                                                name="image"
                                                                id="file"
                                                                accept=".jpg, .jpeg, .png"
                                                                onChange={(event) => { onchangeHandler({ event, Type: 1, TypeOf: "FrontView" }) }}
                                                            />
                                                        </form>
                                                    </FormGroup>
                                                </Col>
                                                <Col sm={1} className="mt-4">
                                                    <button name="image"
                                                        accept=".jpg, .jpeg, .png ,.pdf"
                                                        onClick={() => {
                                                            imageUploadHandler({ Type: 1 })
                                                        }}
                                                        id="ImageId" type="button" className="btn btn-primary mt-1 ">Upload</button>
                                                </Col>

                                                {((values.ItemName.value > 0) && (GetimageUrl({ Type: 1 }) !== "")) ? <Col sm={3} className="mt-4">
                                                    <button name="image"
                                                        style={{ backgroundImage: `url(${GetimageUrl({ Type: 1 })})`, backgroundSize: 'cover' }}
                                                        onClick={() => {
                                                            imageShowHandler({ Type: 1 })
                                                        }}
                                                        id="ImageId" type="button" className="btn btn-success mt-1 ">  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
                                                </Col> : null}
                                            </Row>
                                            <Row>
                                                <Col sm={4}>
                                                    <FormGroup className="mb-3  " >
                                                        <Label >Side View</Label>
                                                        <form id="ResetForm2">

                                                            <Input type="file" className="form-control "
                                                                name="image"
                                                                id="file"
                                                                accept=".jpg, .jpeg, .png"
                                                                onChange={(event) => { onchangeHandler({ event, Type: 2, TypeOf: "SideView" }) }}
                                                            />
                                                        </form >

                                                    </FormGroup>
                                                </Col>
                                                <Col sm={1} className="mt-4">
                                                    <button name="image"
                                                        accept=".jpg, .jpeg, .png ,.pdf"
                                                        onClick={() => {
                                                            imageUploadHandler({ Type: 2 })
                                                        }}
                                                        id="ImageId" type="button" className="btn btn-primary mt-1 ">Upload</button>
                                                </Col>

                                                {((values.ItemName.value > 0) && (GetimageUrl({ Type: 2 }) !== "")) ? <Col sm={3} className="mt-4">
                                                    <button name="image"
                                                        style={{ backgroundImage: `url(${GetimageUrl({ Type: 2 })})`, backgroundSize: 'cover' }}

                                                        onClick={() => {
                                                            imageShowHandler({ Type: 2 })
                                                        }}
                                                        id="ImageId" type="button" className="btn btn-success mt-1 ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
                                                </Col> : null}

                                            </Row>

                                            <Row>
                                                <Col sm={4}>
                                                    <FormGroup className="mb-3  " >
                                                        <Label >Top View</Label>
                                                        <form id="ResetForm3">
                                                            <Input type="file" className="form-control "
                                                                name="image"
                                                                id="file"
                                                                accept=".jpg, .jpeg, .png"
                                                                onChange={(event) => { onchangeHandler({ event, Type: 3, TypeOf: "TopView" }) }}
                                                            />
                                                        </form>
                                                    </FormGroup>
                                                </Col>
                                                <Col sm={1} className="mt-4">
                                                    <button name="image"
                                                        accept=".jpg, .jpeg, .png ,.pdf"
                                                        onClick={() => {
                                                            imageUploadHandler({ Type: 3 })
                                                        }}
                                                        id="ImageId" type="button" className="btn btn-primary mt-1 ">Upload</button>
                                                </Col>


                                                {((values.ItemName.value > 0) && (GetimageUrl({ Type: 3 }) !== "")) ? <Col sm={3} className="mt-4">
                                                    <button name="image"
                                                        style={{ backgroundImage: `url(${GetimageUrl({ Type: 3 })})`, backgroundSize: 'cover' }}

                                                        onClick={() => {
                                                            imageShowHandler({ Type: 3 })
                                                        }}
                                                        id="ImageId" type="button" className="btn btn-success mt-1 ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
                                                </Col> : null}

                                            </Row>

                                        </CardBody>
                                    </Card>
                                </form>
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            </React.Fragment >
        );
    }
    else {
        return (
            <React.Fragment></React.Fragment>
        )
    }
};

export default ItemImageUpload



