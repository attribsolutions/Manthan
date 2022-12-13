import React from 'react'
import { useSelector } from 'react-redux';
import Select from "react-select";
import { Table } from 'reactstrap';

export default function OrderPageTermsTable(props) {
    const { tableList, setfunc } = props;

    const { termsAndConditions = [] } = useSelector((state) => ({
        termsAndConditions: state.TermsAndConditionsReducer.TermsAndConditionsList,
    }));

    const onChange = (e) => {
        const find = tableList.find((i) => {
            return (i.value === e.value)
        });
        if (find === undefined) {
            setfunc(terms => [...terms, { label: e.label, value: e.value, IsDeleted: 0 }]);
        } else {

            setfunc(terms => terms.map((i) => {
                if (i.value === e.value) {
                    i.IsDeleted = 0
                }
                return i
            }));
        }
    }
    const ondelete = (i) => {
        setfunc(terms => terms.map(ele => {
            if (ele.value === i.value) {
                ele.IsDeleted = 1
            }
            return ele
        }))
    }

    // tablefunc(){

    // }
    return (
        <div style={{ minHeight: "400px", marginTop: "-20px" }}>
            <div className="row mx-1 " style={{
                borderStyle: "solid",
                borderColor: "Gray",
                borderWidth: "0.3px",
                borderRadius: "7px",
                backgroundColor: "#d4d4e9",
            }}>
                <div className="col-3  pt-3 pb-3">
                    <Select
                        options={
                            termsAndConditions.map(i => ({
                                value: i.id,
                                label: i.Name
                            }))
                        }
                        onChange={onChange}
                    />
                </div>
                <div className=" col-9 pt-3" >
                    <Table className='table  table-borderless table-hover  '>
                        <tr>
                            <th>Terms and Condition</th>
                            <th>Action</th>
                        </tr >
                        {tableList.map((i, k) => (
                            <tr className='bordered-gray' style={{ display: (i.IsDeleted === 0) ? "block" : "none" }}>
                                <td className="px-2">
                                    <spam className="form-label">{k + 1}</spam>{i.label}</td>
                                <td> <i className="mdi mdi-delete font-size-18 text-danger text-right"
                                    onClick={() => ondelete(i)}></i></td>
                            </tr>
                        )
                        )}
                    </Table>
                </div>
            </div>
        </div>
    )
}
