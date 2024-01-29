import React from 'react'
import { useSelector } from 'react-redux';

const CountLabelComp = () => {

    const CountLabel = useSelector(({ BreadcrumbReducer }) => BreadcrumbReducer.breadcrumbDetail?.CountLabel);
    const showCountlabel = useSelector(({ BreadcrumbReducer }) => BreadcrumbReducer.showCountlabel);

    if (!(CountLabel && showCountlabel.length > 0)) {
        return null;
    }
    return (
        <div className="bg-dark text-center text-light external-event col-form-label border border-Success rounded-2" style={{ width: "100%", padding: "3px" }}>
            <samp className="px-1">{showCountlabel}</samp>
        </div>
    );
};
export default React.memo(CountLabelComp)