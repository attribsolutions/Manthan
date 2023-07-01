import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getpdfReportdataSuccess, postpdfMultipleReportdataSuccess } from '../../store/Utilites/PdfReport/actions'
import generateReport from '../../Reports/ReportIndex';

export default function C_Report() {

    const dispatch = useDispatch();
    const { pdfdata } = useSelector((state) => ({
        pdfdata: state.PdfReportReducers.pdfdata
    }))
    debugger
    useEffect(() => {
        debugger
        if ((pdfdata.Status === true) && (pdfdata.StatusCode === 200)) {
            debugger
            generateReport(pdfdata)
            dispatch(getpdfReportdataSuccess({ Status: false }))
            // dispatch(postpdfMultipleReportdataSuccess({ Status: false }))

        }
    }, [pdfdata])

    return (null)
}
