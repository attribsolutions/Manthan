import React from 'react'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { AlertState } from '../../../../../store/actions'

export default function Image(props) {
    const { imageTable, setImageTable } = props.state
    const dispatch = useDispatch()
    function addRowHandler(key) {


        var newarr1 = [...imageTable, {
            ImageType: { value: 0, label: "select" },
            ImageUpload: {}
        }]
        setImageTable(newarr1)
    }
    function deleteRowHandler(key) {
        var removeElseArrray1 = imageTable.filter((i, k) => {
            return !(k === key)
        })
        setImageTable(removeElseArrray1)
    }
    function onChangeHandler(event, key, type) {

        var found = imageTable.find((i, k) => {
            return (k === key)
        })
        let newSelectValue = ''

        if (type === "ImageType") {
            const foundDublicate = imageTable.find((element) => {
                return (element[type].value === event.value)
            });
            if (!(foundDublicate === undefined)) {
                dispatch(AlertState({
                    Type: 4,
                    Status: true,
                    Message: "Image Type Already Select",
                }))
                return
            }
            newSelectValue = {
                ImageType: event,
                ImageUpload: found.ImageUpload,
            }
        }
        else if (type === 'ImageUpload') {
            newSelectValue = {
                ImageType: found.ImageType,
                ImageUpload: event.target.value,
            }
        }

        let newTabArr = imageTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setImageTable(newTabArr)
    }


    return (
        <Card className="text-black">
            <CardBody style={{ backgroundColor: "whitesmoke" }}>

                {imageTable.map((index, key) => {
                    return <Row className=" col col-sm-11" >
                        <FormGroup className="mb-3 col col-sm-4 " >
                            <Label htmlFor="validationCustom21">Image Type</Label>
                            <Select
                            // options={ImageType_DropdownOptions}
                            // onChange={(e) => { onChangeHandler(e, key, "ImageType") }}
                            />
                        </FormGroup>

                        <FormGroup className="mb-3 col col-sm-4 " >
                            <Label >Upload</Label>
                            <Input type="file" className="form-control col col-sm-4 "
                            // value={imageTabTable.ImageUpload}
                            // value={"C:\fakepath\cropper.jpg"}
                            // onChange={(e) => onChangeHandler(e, key, "ImageUpload")}
                            />
                        </FormGroup>


                        <Col md={1}>
                            {(imageTable.length === key + 1) ?
                                <Row className=" mt-3">
                                    <Col md={6} className=" mt-3">
                                        {(imageTable.length > 1)
                                            ?
                                            < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                deleteRowHandler(key)
                                            }} >
                                            </i>
                                            : <Col md={6} ></Col>
                                        }

                                    </Col>

                                    <Col md={6}>
                                        <Button className="btn btn-sm mt-3 btn-light  btn-outline-primary  align-items-sm-end"
                                            type="button"
                                            onClick={() => { addRowHandler(key) }} >
                                            <i className="dripicons-plus"></i>Add
                                        </Button>
                                    </Col>
                                </Row>
                                :
                                <Row className="mt-3">
                                    < i className="mdi mdi-trash-can d-block text-danger font-size-20 mt-3" onClick={() => {
                                        deleteRowHandler(key)
                                    }} >
                                    </i>
                                </Row>
                            }

                        </Col>
                    </Row>
                })}
            </CardBody>
        </Card>
    )
}
