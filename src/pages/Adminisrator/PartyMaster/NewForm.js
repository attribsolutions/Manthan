






import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Label } from 'reactstrap'
import { decimalRegx } from '../../../CustomValidateForm/RegexPattern'
import * as url from "../../../routes/route_url";
import * as pageId from "../../../routes/allPageID"
import * as mode from "../../../routes/PageMode";
import { useDispatch, useSelector } from 'react-redux';
import { commonPageField, commonPageFieldSuccess } from '../../../store/actions';
import { comAddPageFieldFunc, initialFiledFunc } from '../../../components/Common/validationFunction';
import Select from "react-select";

function NewForm() {
  const dispatch = useDispatch()
  const fileds = {
    id: "",
    Name: "",
    GroupTypeName: ""
  }
  const [state, setState] = useState(() => initialFiledFunc(fileds))

  const [state1, setState1] = useState('')

  const {
    pageField = {},
    userAccess
  } = useSelector((state) => ({
    userAccess: state.Login.RoleAccessUpdateData,
    pageField: state.CommonPageFieldReducer.pageField
  }));

  const { values } = state
  const { isError } = state;
  const { fieldLabel } = state;
  // const {PageFieldMaster=[]}=pageField

  useEffect(() => {
    if (!(pageField === null)) {
      let obj = {}
      pageField.PageFieldMaster.forEach(i => {
        // debugger
        obj[i.ControlID] = i.ControlID;
        obj[`${obj[i.ControlID]}_info`] = i
      })
      setState1(obj)
    }
  }, [pageField])


  useEffect(() => {
    const page_Id = pageId.GROUP
    dispatch(commonPageFieldSuccess(null));
    dispatch(commonPageField(page_Id))

  }, []);


  function onchange(e, f) {
    debugger
  }
  return (
    <div style={{ marginTop: '20px' }}>

      <CForm onValidSubmit={onchange}>

        <Label>{state1.Name}</Label>
        <CInput
          name={state1.Name}
          onlyValid={true}
          fieldInfo={state1}
          changeValid={false}
          onChange={() => {
            debugger
          }}

        />

        <CInput
          name={state1.GroupTypeName}
          onlyValid={true}
          fieldInfo={state1}
          changeValid={false}
          onChange={() => { debugger }}
        />
       
        <Button
          type="submit"
        >submit</Button>

      </CForm>

    </div>
  )
}

export default NewForm



const CForm = ({ onValidSubmit, children }) => {

  function submit(e) {
    e.preventDefault();

    let invalid = []
    let onvalid = []
    let ak = children.filter(i => (i.type.name === "CInput"))

    debugger

    ak.forEach(i => {
      debugger

      let info = i.props.fieldInfo[`${i.props.name}_info`]

      let regx = RegExp(info.RegularExpression)
      let required = info.IsCompulsory;

      var d = document.getElementsByName(`_cInput_${i.props.name}`)[0]
      let err = document.getElementById(`_error_${i.props.name}`)
      let valid = regx.test(d.value);

      if ((required && (!valid || (d.value === '')))) {
        invalid.push({
          [i.props.name]: "is Invalid"
        })

        err.style.display = "block"
      }
      onvalid.push({ [i.props.name]: d.value })
    });
    debugger
    if (!(invalid.length > 0)) {
      onValidSubmit(onvalid, e)
    }
  }



  return (
    <>
      <form onSubmit={submit}>
        {children}
      </form>
    </>
  )
}










const CInput = ({
  name,
  id,
  style,
  className,
  fieldInfo = '',
  changeValid,
  onChange = () => { },
}) => {

  const [filedState, setFiledState] = useState('')

  useEffect(() => {

    if (!(fieldInfo === '')) {
      setFiledState(fieldInfo[`${name}_info`])
    }
  }, [fieldInfo])

  function on_Change(e) {
    let val = e.target.value
    debugger
    let con1 = String(changeValid) === "true"
    let con2 = RegExp(filedState.RegularExpression).test(val)
    let con3 = (!(con2) && (filedState.IsCompulsory))
    debugger
    if (!con1) {        //onlyValid
      if (con3) {      // ! regxmatch && errorMassage
        let a = document.getElementById(`_error_${name}`)
        a.style.display = "block"
      }
      else if (con2) {
        let a = document.getElementById(`_error_${name}`)
        a.style.display = "none"
      }
      onChange(e)

    }
    else {
      if ((val === '')) {
        onChange(e)
        return
      }
      e.target.value = val.slice(0, -1);
    }
  }

  // const param = Object.assign({}, prop, { onChange: on_Change });
  return (<>
    <Input
      name={`_cInput_${name}`}
      onChange={on_Change}
      id={id}
      autoComplete='off'
      className={className}
      style={style}
    />
    <div style={{ color: 'red', display: "none" }}
      id={`_error_${name}`}>
      {filedState.InValidMsg}
    </div>
  </>)
}

































// import React from 'react'
// import { Button, CustomInput, Input } from 'reactstrap'
// import { decimalRegx } from '../../../CustomValidateForm/RegexPattern'

// function NewForm() {
//   function onchange(e, f) {
//     debugger
//   }
//   return (
//     <div style={{ marginTop: '20px' }}>

//       <CForm onValidSubmit={onchange}>
//         <CInput
//           name="input1"
//           cPattern={decimalRegx}
//           cPattern1={true}
//           onlyValid={true}
//           errorMassage="Error1"
//           autoComplete="off"
//           className="col col-sm "
//           isrequired={"true"}

//         />

//         <CInput
//           name="input2"
//           cPattern={decimalRegx}
//           cPattern1={true}

//           onlyValid={true}
//           errorMassage="Error2"
//           autoComplete="off"
//           className="col col-sm "
//           required={true}

//         />
//         <CInput
//           name="input3"
//           cPattern={decimalRegx}
//           cPattern1={"decimalRegx1"}

//           onlyValid={true}
//           errorMassage="Error3"
//           autoComplete="off"
//           className="col col-sm "

//         />
//         <Button
//           type="submit"
//         >submit</Button>

//       </CForm>

//     </div>
//   )
// }

// export default NewForm



// const CForm = ({ onValidSubmit, children }) => {
//   function submit(e) {
//     e.preventDefault();

//     var collection = e.target.elements
//     let invalid = []
//     let onvalid = []
//     for (let i = 0; i < collection.length; i++) {
//       // debugger

//       if (!(collection[i].tagName === "BUTTON")) {

//         let pattern = collection[i].getAttribute('cPattern')
//         let pattern1 = collection[i].getAttribute('cpattern1')
//         debugger
//         var result = pattern.substring(1, pattern.length - 1);
//         let regx = new RegExp(result);
//         let val = collection[i].value;

//         let valid = regx.test(val);
//         let required = collection[1].required;
//         if ((required && !valid)) {
//           invalid.push({
//             [collection[i].name]: "is Invalid"
//           })
//           let a = document.getElementById(`_error_${collection[i].name}`)
//           a.style.display = "block"
//         }
//         onvalid.push({ [collection[i].name]: collection[i].value })
//       }
//     }
//     debugger
//     if (!(invalid.length > 0)) {
//       onValidSubmit(onvalid, e)
//     }
//   }



//   return (
//     <>
//       <form onSubmit={submit}>
//         {children}
//       </form>
//     </>
//   )
// }






















// const CInput = (prop) => {
//   const { onChange = () => { }, cPattern = '', errorMassage = '', name, onlyValid } = prop

//   function on_Change(e) {
//     let val = e.target.value
//     debugger
//     let con1 = String(onlyValid) === "true"
//     let con2 = cPattern.test(val)
//     let con3 = (!(con2) && !(errorMassage === ""))

//     if (con1) {        //onlyValid
//       if (con3) {      // ! regxmatch && errorMassage
//         let a = document.getElementById(`_error_${name}`)
//         a.style.display = "block"
//       }
//       else if (con2) {
//         let a = document.getElementById(`_error_${name}`)
//         a.style.display = "none"
//       }
//       onChange(e)

//     }
//     else {
//       if ((val === '')) {
//         onChange(e)
//         return
//       }
//       e.target.value = val.slice(0, -1);
//     }
//   }
//   const param = Object.assign({}, prop, { onChange: on_Change });

//   return (<>
//     <Input {...param} />
//     <div style={{ color: 'red', display: "none" }} id={`_error_${name}`}> {errorMassage}</div></>)
// }



