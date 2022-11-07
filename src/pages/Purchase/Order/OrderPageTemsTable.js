import React from 'react'
import { useSelector } from 'react-redux';
import Select from "react-select";
import { Table } from 'reactstrap';

export default function OrderPageTemsTable(props) {
    const { tableList, setfunc } = props;

    const { termsAndCondtions = [] } = useSelector((state) => ({
        termsAndCondtions: state.TermsAndCondtionsReducer.TermsAndCondtionsList,
    }));

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
                            termsAndCondtions.map(i => ({
                                value: i.id,
                                label: i.Name
                            }))
                        }
                        onChange={e => setfunc(terms => [...terms, e])}
                    />
                </div>
                <div className=" col-4 pt-3" >
                    <Table className='table  table-borderless table-hover  '>
                        <tr>
                            <th>Terms And Condation </th>
                            <th>Action</th>
                        </tr >
                        {tableList.map(i => (
                            <tr className='bordered-gray'>
                                <td className="px-2">
                                    <i className="bx bx-caret-right text-primary"></i>{i.label}</td>
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
