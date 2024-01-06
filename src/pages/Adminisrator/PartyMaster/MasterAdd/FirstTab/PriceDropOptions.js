import React, { useEffect } from 'react';
import './Tree.scss';

const PriceDropOptions = (props) => {
    useEffect(() => {
        window.addEventListener('mouseup', handleClosePriceDropOptions);
        return () => {
            window.removeEventListener('mouseup', handleClosePriceDropOptions);
        };
    }, []);

    const handleClosePriceDropOptions = (event) => {
        try {
            var pol = document.getElementById('price-drop');
            if (event.target !== pol && event.target.parentNode !== pol) {
                pol.style.display = 'none';
            }
        } catch (e) { }
    };

    const handleOptionClick = (node) => {
        props.setPriceSelect(node);
        // Trigger the onChange function passed from the parent component
        if (props.onChange) {
            props.onChange(node);
        }
    };

    const ChildNode = (node) => (
        <li key={node.label}>
            <div className="classmt">
                <span
                    id="price-option"
                    className="text-black form-control"
                    onClick={() => handleOptionClick(node)}
                >
                    {node.label}
                </span>
            </div>
            <div>
                <ul>{ParentNode(node.children)}</ul>
            </div>
        </li>
    );

    const ParentNode = (tree1) => (
        <ul className="list-group">
            {tree1.map((tree) => (
                ChildNode(tree)
            ))}
        </ul>
    );

    return (
        <div id="price-drop" className="price-drop-options">
            <div className="price-drop-body">
                <ul style={{ paddingLeft: '0px' }}>{ParentNode(props.data)}</ul>
            </div>
        </div>
    );
};

export default PriceDropOptions;

































// Declare a new state variable, which we'll call "menu"

// export default function TreeInput({ data = [] }) {

//     const [menu, setMenu] = useState(false);
//     const [dropOpen, setDropOpen] = useState(false);
//     const [currentPrice, setCurrentPrice] = useState({ Name: '' });

//     const dropOpen_ONClickHandler = price => {
//         setCurrentPrice(price)
//         setDropOpen(true)
//     }
//     const delete_PriceList = price => {

//     }
//     function sub_Price_Add_Handler() {
//         var price = document.getElementById("txtsubprice")
//         if (price.value === "") {
//             alert("please enter value")
//         } else {

//         }
//     }
//     const toggle = () => {
//         setMenu('');
//     }

//     function fun1(data1) {
//         return (
//             <div>
//                 {
//                     data1.map(tree => fun2(tree))
//                 }
//             </div>
//         )
//     }

//     function fun2(data2) {
//         //
//         return (
//             // <li >
//             <div style={{ paddingLeft: "20px" }} className={""} >
//                 <div className='row justify-content-center mt-n4 '>
//                     <div className=' col-10'>
//                         <Input type="text" defaultValue={data2.Name} ></Input>

//                     </div>
//                     <div className=' col-1 al-end'> <input type="checkBox" ></input></div>
//                     <div className=' col-1 '>
//                         <i className="mdi mdi-pencil font-size-12"
//                             onClick={e => setMenu(data2.id)}
//                         ></i>
//                         <Dropdown isOpen={menu === data2.id} toggle={toggle} className="d-inline-block">
//                             <DropdownToggle className="btn header-item " tag="button">

//                             </DropdownToggle>
//                             <DropdownMenu className="language-switch dropdown-menu-end">

//                                 <DropdownItem
//                                     key={data2.id}
//                                     onClick={(e) => { dropOpen_ONClickHandler(data2) }}
//                                 // // className={`notify-item ${selectedLang === key ? "active" : "none"
//                                 //     }`}
//                                 >
//                                     <span className="align-middle text-black"
//                                     >
//                                         {"Add Sub-Rate"}
//                                     </span>
//                                 </DropdownItem>

//                                 <DropdownItem
//                                     key={data2.id}
//                                     onClick={() => delete_PriceList(data2.id)}
//                                 // // className={`notify-item ${selectedLang === key ? "active" : "none"
//                                 //     }`}
//                                 >
//                                     <span className="align-middle text-danger">
//                                         {"Delete"}
//                                     </span>
//                                 </DropdownItem>

//                             </DropdownMenu>

//                         </Dropdown>
//                     </div>

//                     {data2.childern ? fun1(data2.childern) : null}
//                 </div>
//             </div>

//         )

//     }



//     return (

//         <div className={"mt-3"}>
//             <Modal
//                 isOpen={dropOpen}
//                 toggle={() => { setDropOpen(!dropOpen) }}
//                 size="sm"
//                 centered={true}
//                 backdrop={'static'}
//             >
//                 <div className="modal-header">
//                     <h5 className="modal-title mt-0">Add sub-Price </h5>
//                     <button
//                         type="button"
//                         onClick={() => {
//                             setDropOpen(!dropOpen)
//                         }}
//                         className="close"
//                         data-dismiss="modal"
//                         aria-label="Close"
//                     >
//                         <span aria-hidden="true">&times;</span>
//                     </button>
//                 </div>
//                 <div className="modal-body">
//                     <Row className="justify-content-md-left">

//                         <span >{currentPrice.Name}</span>

//                         <Label htmlFor="horizontal-firstname-input" className="col-4 col-form-label" >IsDivision </Label>
//                         <Col style={{ marginTop: '9px' }} >
//                             <Input type="text" id='txtsubprice' />
//                         </Col>
//                     </Row>
//                 </div>
//                 <div className="modal-footer">
//                     <button type="button" className="btn btn-light" onClick={() => {
//                         setDropOpen(!dropOpen)
//                     }}>Close</button>
//                     <button type="button" className="btn btn-primary" onClick={() => { sub_Price_Add_Handler() }} >Add</button>
//                 </div>

//             </Modal>
//             {fun1(data)}

//         </div>
//     )
// }

