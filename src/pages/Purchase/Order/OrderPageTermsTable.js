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
            setfunc(terms => [...terms, e]);
        }
    }

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
                            <tr className='bordered-gray'>
                                <td className="px-2">
                                    <spam className="form-label">{k + 1}</spam>{i.label}</td>
                                <td> <i className="mdi mdi-delete font-size-18 text-danger text-right"
                                    onClick={() => { setfunc(terms => terms.filter(f => !(f.value === i.value))) }}></i></td>
                            </tr>
                        )
                        )}
                    </Table>
                </div>
            </div>
        </div>
    )
}
