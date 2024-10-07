// import React from 'react'
// import { useSelector } from 'react-redux';

// const CountLabelComp = () => {

//     const CountLabel = useSelector(({ BreadcrumbReducer }) => BreadcrumbReducer.breadcrumbDetail?.CountLabel);
//     const showCountlabel = useSelector(({ BreadcrumbReducer }) => BreadcrumbReducer.showCountlabel);

//     if (!(CountLabel && showCountlabel.length > 0)) {
//         return null;
//     }
//     return (
//         <div className="bg-dark text-center text-light external-event col-form-label border border-Success rounded-2"
//             style={{ width: "100%", padding: "3px", }}>
//             <samp >{showCountlabel}</samp>
//         </div>
//     );
// };
// export default React.memo(CountLabelComp)



import React from 'react'
import { useSelector } from 'react-redux';
import { loginUserDetails } from '../../Common/CommonFunction';

const CountLabelComp = () => {

    const CountLabel = useSelector(({ BreadcrumbReducer }) => BreadcrumbReducer.breadcrumbDetail?.CountLabel);
    const showCountlabel = useSelector(({ BreadcrumbReducer }) => BreadcrumbReducer.showCountlabel);

    const CurrencySymbol = loginUserDetails().CurrencySymbol

    if (!(CountLabel && showCountlabel.length > 0)) {
        return null;
    }

    const parts = showCountlabel.split(":")[1].split("currency_symbol");
    const countPart = parts[0].trim();
    const RemaningPart = parts.length > 1 ? parts[1].trim() : "";
    const amountPart = RemaningPart.split(" ")[0]

    const weightageValue = RemaningPart.substring(RemaningPart.indexOf("weightage") + 10).trim();  // Extracts value between 'weightage' and 'kg'

    debugger
    const countAndRupeeColor = "#fff"
    const amountColor = "#ffc735"

    return (
        <div className="bg-dark text-center text-light external-event col-form-label border border-Success rounded-2"
            style={{ width: "100%", padding: "3px", }}>
            <samp>
                <span style={{ color: countAndRupeeColor, marginRight: "5px" }}>Count:</span>
                <span style={{ color: amountColor, marginRight: "5px" }}>{countPart}</span>
                {/*   this block Add to show Total weightage of order value es show here by targeting through elementi class for optimization*/}
                {weightageValue !== "" && <>
                    <span class="weightage-lable" style={{ color: countAndRupeeColor, marginRight: "5px" }}>weightage:</span>
                    <span class="weightage-value" style={{ color: amountColor }}>{weightageValue}</span> &nbsp;
                </>}
                {amountPart && (
                    <>
                        <span style={{ color: countAndRupeeColor, marginRight: "5px" }}>{CurrencySymbol}:</span>
                        <span class="amount-countable-Calulation" style={{ color: amountColor }}>{amountPart}</span>
                    </>
                )}


            </samp>
        </div>
    );
};
export default React.memo(CountLabelComp)