
// import { reject } from 'lodash'
// import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
// import Select from 'react-select'
// import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap'
// import { AlertState } from '../../../../../store/actions'
// const Index = () => {

//     const[baseimage , setbaseimage] = useState("")


// //   const data = ""

// const convertBase64 = (file) => {
//     debugger
//     return new Promise((resolve,reject) => {
//         const fileReader = new FileReader()
//         fileReader.readAsDataURL(file);

//         fileReader.onload = () =>{
//             resolve(fileReader.result)

//         };
//         fileReader.onerror = (error) =>{
//             reject(error)
//         }
//     })
// }
//     const   uploadedImage = async (e) => {
//         const file = e.target.files[0]
//         const base64 = await convertBase64(file);

//         // let  data =base64
//         setbaseimage(base64)
//         console.log(base64);
//     }



// // let base64code =""
// //  const onChangeHandler = (e) =>{
// //     const files = e.target.files
// //     const file = files[0];
// //     getbase64(file)
// //  }
// //  const onLoad =(fileString)=> {
// //     this.base64code =fileString
// //  }
// //  const getbase64 = (file) => {
// //     debugger
// //     let reader = new FileReader()
// //     reader.readAsDataURL(file)
// //     reader.onload = () =>{
// //         onLoad(reader.reasult)
// //     }

// //  }





//     // function onchange() {
//     //     debugger
//     //     const getBase64StringFromDataURL = (dataURL) =>
//     // dataURL.replace('data:', '').replace(/^.+,/, '');

//         // let reader = new FileReader();
//     //     // let f = element.files[0];
//     //     let file = document.querySelector(
//     //         'input[type=file]')['files'][0];
//     //     reader.onloadend = function() {
//     //     document.write('String Output: ', reader.result); }
//     //     const base64 = getBase64StringFromDataURL(reader.result);
//         // reader.readAsDataURL(file); 
//     //     console.log(base64)
//     // }




//     return (
//         <div  className="page-content">
//         <Card className="text-black">
//             <CardBody style={{ backgroundColor: "whitesmoke" }}>


//                     <Row className=" col col-sm-12" >
//                         <FormGroup className="mb-3 col col-sm-4 " >
//                             <Label htmlFor="validationCustom21">Image Type</Label>
//                             <Select
//                             // options={ImageType_DropdownOptions}
//                             // onChange={(e) => { onChangeHandler(e, key, "ImageType") }}
//                             />
//                         </FormGroup>

//                         <FormGroup className="mb-3 col col-sm-4 " >
//                             <Label >Upload</Label>
//                             <Input type="file" className="form-control "
//                                 name="image"
//                                 id="fileInput"
//                                 accept=".jpg, .jpeg, .png"
//                                 // onChange={(e) => this.onChangeHandler(e)}


//                                 // onChange={(event) => onChangeHandler({event, imageTable, setImageTable, })}

// onChange={(e) => {uploadedImage(e)}}

//                             // value={imageTabTable.ImageUpload}
//                             // value={"C:\fakepath\cropper.jpg"}
//                             // onChange={(e) => onChangeHandler(e, key, "ImageUpload")}
//                             />
//                         </FormGroup>


//                         <Col md={2}>
//                             {/* {(imageTable.length === key + 1) ? */}
//                                 <Row className=" mt-3">
//                                     <Col sm={1} className=" mt-3">
//                                         {/* {(imageTable.length > 1) */}

//                                             < i className="mdi mdi-trash-can d-block text-danger font-size-20" 

//                                              >
//                                             </i>


//                                         {/* } */}

//                                     </Col>

//                                     <Col md={2}>
//                                         <Button className="btn btn-sm mt-3 btn-light  btn-outline-primary  align-items-sm-end"
//                                             type="button"
//                                             >
//                                             <i className="dripicons-plus"></i>Add
//                                         </Button>
//                                     </Col>
//                                 </Row>

//                             {/* } */}

//                         </Col>
//                         {/* <Row> */}
//                         <div className=" col-3 mt-2 " style={{ height: "2cm", width: "1.8cm"  }}>
// <img id='img' src={baseimage} />


//                     </div>
//                     {/* </Row> */ }
//                     </Row>

//         </CardBody>
//         </Card >
//         </div>
//     )
// }

// export default Index














import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Select from 'react-select'
import { Button, Card, CardBody, Col, FormGroup, Input, Label, Row } from 'reactstrap'
import { AlertState } from '../../../../../store/actions'




export default function Image(props) {

    const { ImageType = [] } = useSelector((state) => ({
        ImageType: state.ItemMastersReducer.ImageType
    }));




    const [baseimage, setbaseimage] = useState("")
    const { imageTable, setImageTable } = props.state
    const dispatch = useDispatch()


    const imageTypes = ImageType.map((Data) => ({
        value: Data.id,
        label: Data.Name
    }));

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

    const uploadedImage = async (event, key, type) => {
        debugger
        const file = event.target.files[0]
        const base64 = await convertBase64(file);

        // setbaseimage(base64)
        console.log(base64);

        var found = imageTable.find((i, k) => {
            return (k === key)
        })
        let newSelectValue = ''

        if (type === "ImageType") {
            // const foundDublicate = imageTable.find((element) => {
            //     return (element[type].value === event.value)
            // });
            // if (!(foundDublicate === undefined)) {
            //     dispatch(AlertState({
            //         Type: 4,
            //         Status: true,
            //         Message: "Image Type Already Select",
            //     }))
            //     return
            // }
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
        debugger
    }


    const convertBase64 = (file) => {
        debugger
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
                            // onChange={(e) => { onChangeHandler(e, key, "ImageType") }}
                            />
                        </FormGroup>

                        <FormGroup className="mb-3 col col-sm-4 " >
                            <Label >Upload</Label>
                            <Input type="file" className="form-control "
                                name="image"
                                id="file"
                                accept=".jpg, .jpeg, .png"
                                // onChange={e => this.onChangeHandler(e)}
                                // onChange={(event) => onChangeHandler({event, imageTable, setImageTable, })}
                                onChange={(event) => { uploadedImage(event) }}

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
                        {/* <Row> */}
                        <div className=" col-3 mt-2 " style={{ height: "2cm", width: "1.8cm" }}>
                            <img id='img' src={baseimage} />

                        </div>
                        {/* </Row> */}
                    </Row>
                })}
            </CardBody>
        </Card >
    )
}
