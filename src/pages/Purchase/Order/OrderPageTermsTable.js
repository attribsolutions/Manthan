import React from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Select from "react-select";
import { Table } from 'reactstrap';
import * as url from "../../../routes/route_url"

export default function OrderPageTermsTable(props,) {

    const location = useLocation();
    const { tableData = [] } = props;
    const showCondition = ((location.pathname === url.ORDER_1) && (tableData.length > 0))

    const { tableList, setfunc, privious = [] } = props;

    const { termsAndConditions = [] } = useSelector((state) => ({
        termsAndConditions: state.TermsAndConditionsReducer.TermsAndConditionsList,
    }));

    if (!showCondition) { return <></> }

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

        const find = privious.find((ele) => {
            return (i.value === ele.id)
        });

        if (!(find === undefined)) {
            setfunc(terms => {
                const a = terms.map(ele => {
                    if (ele.value === i.value) {
                        ele.IsDeleted = 1
                    }
                    return ele
                })
                return a
            })
        }
        else {
            setfunc(terms => {
                const a = terms.filter(ele => !(ele.value === i.value))
                return a
            })
        }
    }
    const table = []
    tableList.map((i, k) => {
        if (i.IsDeleted === 0) {
            table.push(i)
        }
    })


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
                            <th scope="col">Terms and Condition</th>
                            <th scope="col">Action</th>
                        </tr >
                        {table.map((i, k) => (
                            <tr className='bordered-gray' >
                                <td className="px-2" >
                                    <spam className="form-label">{k + 1}</spam>{i.label}</td>
                                <td style={{ marginLeft: "10cm" }}>
                                    <i className="mdi mdi-delete font-size-18 text-danger text-right"
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
