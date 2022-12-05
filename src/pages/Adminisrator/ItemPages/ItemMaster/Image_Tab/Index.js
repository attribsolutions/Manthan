
import { Modal } from 'bootstrap'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { AlertState, get_ImageType_ForDropDown } from '../../../../../store/actions'


export default function Image(props) {

    const { ImageType = [] } = useSelector((state) => ({
        ImageType: state.ItemMastersReducer.ImageType
    }));

    const [baseimage, setbaseimage] = useState("")
    const { imageTable, setImageTable } = props.state
    const dispatch = useDispatch()
    const [ImageTypevalue, setImageTypevalue] = useState("")

    const imageTypes = ImageType.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));
   
   

    useEffect(() => {
        dispatch(get_ImageType_ForDropDown());
    }, []);

    function addRowHandler(key) {


        var newarr1 = [...imageTable, {
            ImageType: { value: 0, label: "select" },
            ImageUpload: ""
        }]
        setImageTable(newarr1)

    }
    function deleteRowHandler(key) {
        var removeElseArrray1 = imageTable.filter((i, k) => {
            return !(k === key)
        })
        setImageTable(removeElseArrray1)
    }

    const onchangeHandler = async (event, key, type) => {
        var found = imageTable.find((i, k) => {
            return (k === key)
        })
        let newSelectValue = ''

        if (type === "ImageType") {

            newSelectValue = {
                ImageType: event,
                ImageUpload: found.ImageUpload,
            }
        }
        else if (type === 'ImageUpload') {
            const file = event.target.files[0]
            const base64 = await convertBase64(file);
            newSelectValue = {
                ImageType: found.ImageType,
                ImageUpload: base64,
            }
        }
        let newTabArr = imageTable.map((index, k) => {
            return (k === key) ? newSelectValue : index
        })
        setImageTable(newTabArr)


        // select
    
      

    }


    const convertBase64 = (file) => {

        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result)

            };
            fileReader.onerror = (error) => {
                reject(error)
            }
        })
    }

    return (
        <Card className="text-black">
            <CardBody style={{ backgroundColor: "whitesmoke" }}>


                {imageTable.map((index, key) => {

        
                     
                    return <Row className=" col col-sm-12" >
                        <FormGroup className="mb-3 col col-sm-4 " >
                            <Label htmlFor="validationCustom21">Image Type</Label>
                            <Select
                                options={imageTypes}
                                onChange={(e) => { onchangeHandler(e, key, "ImageType") }}
                                defaultValue={ImageTypevalue}
                                
                            />
                        </FormGroup>

                        <FormGroup className="mb-3 col col-sm-4 " >
                            <Label >Upload</Label>
                            <Input type="file" className="form-control "
                                name="image"
                                id="file"
                                accept=".jpg, .jpeg, .png"
                                onChange={(event) => {onchangeHandler(event, key, "ImageUpload") }}

                            />
                        </FormGroup>


                        <Col md={2}>
                            {(imageTable.length === key + 1) ?
                                <Row className=" mt-3">
                                    <Col sm={1} className=" mt-3">
                                        {(imageTable.length > 1)
                                            ?
                                            < i className="mdi mdi-trash-can d-block text-danger font-size-20" onClick={() => {
                                                deleteRowHandler(key)
                                            }} >
                                            </i>
                                            :
                                            <Col sm={2} ></Col>
                                        }

                                    </Col>

                                    <Col md={2}>
                                        <Button className="button_add badge badge-soft-primary font-size-12 btn btn-primary waves-effect waves-light w-xxs border border-light"
                                            type="button"
                                            onClick={() => { addRowHandler(key) }} >
                                            <i className="dripicons-plus"></i>
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

                    
                            {/* {<div className=" col-3 mt-2 " style={{ height: "1cm", width: "1cm" }}> */}
                        

                            
                            <a id="img" href='#'> {(index.ImageUpload === "") ? null : <img id='images' src={index.ImageUpload} />} </a>   

                             {/* <Modal        /> */}
                            {/* </div>} */}

                    </Row>
                })}
            </CardBody>
        </Card >
    )
}
