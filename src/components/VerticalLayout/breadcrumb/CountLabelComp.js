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

const CountLabelComp = () => {

    const CountLabel = useSelector(({ BreadcrumbReducer }) => BreadcrumbReducer.breadcrumbDetail?.CountLabel);
    const showCountlabel = useSelector(({ BreadcrumbReducer }) => BreadcrumbReducer.showCountlabel);

    if (!(CountLabel && showCountlabel.length > 0)) {
        return null;
    }

    const parts = showCountlabel.split(":")[1].split("₹");
    const countPart = parts[0].trim();
    const amountPart = parts.length > 1 ? parts[1].trim() : "";

    const countAndRupeeColor = "#fff"
    const amountColor = "#ffc735"

    return (
        <div className="bg-dark text-center text-light external-event col-form-label border border-Success rounded-2"
            style={{ width: "100%", padding: "3px", }}>
            <samp>
                <span style={{ color: countAndRupeeColor, marginRight: "5px" }}>Count:</span>
                <span style={{ color: amountColor, marginRight: "5px" }}>{countPart}</span>
                {amountPart && (
                    <>
                        <span style={{ color: countAndRupeeColor, marginRight: "5px" }}>₹</span>
                        <span style={{ color: amountColor }}>{amountPart}</span>
                    </>
                )}
            </samp>
        </div>
    );
};
export default React.memo(CountLabelComp)