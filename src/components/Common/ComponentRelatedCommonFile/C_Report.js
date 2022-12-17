import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getpdfReportdataSuccess } from '../../../store/Utilites/PdfReport/actions'
import generate from "../../../Reports/InvioceReport/Page"
import generateReport from '../../../Reports/ReportIndex';

export default function C_Report() {

    const dispatch = useDispatch();

    const { pdfdata } = useSelector((state) => ({
        pdfdata: state.PdfReportReducers.pdfdata
    }))
    debugger
    useEffect(() => {
        // async function reportFunc() {
        //     await generate(pdfdata)
        //     dispatch(getpdfReportdataSuccess({ Status: false }))
        // }

        if ((pdfdata.Status === true) && (pdfdata.StatusCode === 200)) {
            generateReport(pdfdata)
            dispatch(getpdfReportdataSuccess({ Status: false }))
        }
    }, [pdfdata])

    return (<></>)
}
