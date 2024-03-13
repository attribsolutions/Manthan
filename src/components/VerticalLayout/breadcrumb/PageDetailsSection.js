import React, { useEffect } from 'react';
import ChangeCommonParty from '../chnageParty/changeCommonParty';
import CountLabelComp from './CountLabelComp';
import HeaderTitleNewBtn from './HeaderTitleNewBtn';
import { useDispatch, useSelector } from 'react-redux';
import { sideBarPageFiltersInfoSuccess } from '../../../store/Utilites/PartyDrodown/action';

const PageDetailsSection = ({ handleClose, ...props }) => {
    const dispatch = useDispatch();
    const sideBarPageFilters = useSelector(({ CommonPartyDropdownReducer }) => CommonPartyDropdownReducer.sideBarPageFilters);

    const defaultLabelStyle = "#fff";
    const defaultContentStyle = "#ffc735";

    useEffect(() => {
        dispatch(sideBarPageFiltersInfoSuccess([]));
    }, [])

    const StyledSpan = ({ items }) => {

        return (
            <>
                {/* <label style={{ color: "#20e696" }}>Filter Details</label> */}
                {items.map(({ label, content, labelStyle, contentStyle }, index) => (
                    <div
                        key={index}
                    // style={{
                    //     border: "1px solid #ccc",
                    //     padding: "5px",
                    //     marginBottom: "7px",
                    //     borderRadius: "3px"
                    // }}
                    >
                        <span
                            style={{
                                color: labelStyle ? labelStyle : defaultLabelStyle,
                                marginLeft: "5px"
                            }}
                        >
                            {label} :
                        </span>{" "}
                        <span
                            style={{
                                color: contentStyle ? contentStyle : defaultContentStyle,
                                marginLeft: "5px"
                            }}
                        >
                            {content}
                        </span>
                    </div>
                ))}
            </>
        );
    };

    return (
        <div className="vertical-menu" >
            <ChangeCommonParty {...props} />
            <div >
                <div id="sidebar-menu" className="detailed-div" style={{ boxShadow: "#c19c464a", }} >

                    <div style={{
                        borderRadius: "3px",
                        backgroundColor: "#977f4a2b",
                        color: "#f4f4f4",
                        height: "100%",
                        padding: "1rem",
                        position: 'relative'
                    }}>
                        <button className="close-white" onClick={handleClose}>
                        </button>

                        <HeaderTitleNewBtn hederTextColor={"white"} showBredcrumItemName={false} />
                        <CountLabelComp />
                        {sideBarPageFilters.length > 0 &&
                            <div className='mt-2'
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "5px",
                                    marginBottom: "7px",
                                    borderRadius: "3px"
                                }}
                            >
                                <StyledSpan
                                    items={Object.entries(sideBarPageFilters).map(([key, value]) => ({
                                        label: value.label,
                                        content: value.content,
                                        labelStyle: value.labelStyle,
                                        contentStyle: value.contentStyle
                                    }))}
                                />

                            </div>}


                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageDetailsSection;

