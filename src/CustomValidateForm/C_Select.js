import Select from "react-select";
import { components } from "react-select/dist/react-select.cjs.prod";
import { Col, Row } from "reactstrap";

function SelectBoxLoader() {// linner component
    return <div className="dot-pulse">
        <div className="bounce1" style={{ background: "secondary", width: "8px", height: "8px" }}></div>
        <div className="bounce2" style={{ background: "secondary", width: "8px", height: "8px" }}></div>
        <div className="bounce3" style={{ background: "secondary", width: "8px", height: "8px" }}></div>
    </div>

}
export const C_Select = ({ value, onCancelClick, isDisabled, isLoading, ...rest }) => {

    const { DropdownIndicator } = components;

    const ClearIndicator = (props) => {
        return (
            <div style={{ position: "relative" }}>
                {isLoading ? (
                    <div style={{ display: "inline-block", marginRight: "5px" }}>
                        <SelectBoxLoader />
                    </div>
                ) : <div className="d-flex">

                    <div>
                        {(value && !props.isMulti && onCancelClick && !isDisabled) && (
                            <button
                                className="clear-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCancelClick();
                                }}
                                style={{
                                    position: "relative",
                                    top: "50%",
                                    marginLeft: "2px",
                                    marginRight: "-7px",
                                    transform: "translateY(-50%)",
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    color: "#333",
                                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",

                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#eee";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "";
                                }}
                            >
                                X
                            </button>
                        )}
                    </div>
                    <div>
                        <DropdownIndicator {...props} />
                    </div>
                </div>}

            </div>
        );
    };;

    return (
        <div>
            <Select
                {...rest}
                value={value}
                
                isDisabled={isDisabled}
                className="react-dropdown"
                classNamePrefix="select2-selection"
                components={{ DropdownIndicator: ClearIndicator }}
            />
        </div>
    );
};







export const C_ItemSelect = ({ value, onCancelClick, isDisabled, isLoading, ...rest }) => {

    const transformDataToOptions = (data) => {
        
        const groupedData = data.reduce((acc, currentItem) => {
            // Find if the group already exists
            const SubGroupNameIndex = acc.findIndex(SubGroupName => SubGroupName.label === `${currentItem.GroupName}-${currentItem.SubGroupName}`);

            // If group exists, add the item to its options
            if (SubGroupNameIndex !== -1) {
                acc[SubGroupNameIndex].options.push({
                    value: currentItem.value,
                    label: currentItem.label,
                    ...currentItem,
                });
            } else {
                // If group does not exist, create a new group with the item
                acc.push({
                    label: `${currentItem.GroupName}-${currentItem.SubGroupName}`,
                    options: [
                        { value: currentItem.value, label: currentItem.label, ...currentItem }
                    ],
                });
            }
            return acc;
        }, []);

        return groupedData;
    };
    const options = transformDataToOptions(rest.options);

    

    const { DropdownIndicator } = components;

    const ClearIndicator = (props) => {
        return (
            <div style={{ position: "relative" }}>
                {isLoading ? (
                    <div style={{ display: "inline-block", marginRight: "5px" }}>
                        <SelectBoxLoader />
                    </div>
                ) : <div className="d-flex">

                    <div>
                        {(value && !props.isMulti && onCancelClick && !isDisabled) && (
                            <button
                                className="clear-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCancelClick();
                                }}
                                style={{
                                    position: "relative",
                                    top: "50%",
                                    marginLeft: "2px",
                                    marginRight: "-7px",
                                    transform: "translateY(-50%)",
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    color: "#333",
                                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",

                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#eee";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "";
                                }}
                            >
                                X
                            </button>
                        )}
                    </div>
                    <div>
                        <DropdownIndicator {...props} />
                    </div>
                </div>}

            </div>
        );
    };

    const formatGroupLabel = (group) => {
        const parts = group.label?.split("-")
        return (
            <Row>
                <Col sm={12} style={{ backgroundColor: "#d4d4ebf5", padding: "4px", borderRadius: "5px" }}>
                    <span style={{ color: "black", fontSize: "16px" }}></span> <samp style={{ color: "black", fontSize: "14px", fontWeight: "bold" }} >{parts[0]}</samp> &nbsp;&nbsp;<i style={{ color: "black", fontSize: "13px" }} className="fas fa-angle-right"></i>
                    <samp style={{ color: "black", fontSize: "14px" }}> {parts[1]}</samp>
                </Col>

            </Row>

        )
    };

    // Function to format option label with custom HTML
    const formatOptionLabel = ({ label, value }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <strong>{label}</strong> {/* The label can be styled here */}
        </div>
    )

    return (
        <div>
            <Select
                {...rest}
                options={options}
                value={value}
                isDisabled={isDisabled}
                className="react-dropdown"
                classNamePrefix="select2-selection"
                components={{ DropdownIndicator: ClearIndicator }}
                formatOptionLabel={formatOptionLabel}
                formatGroupLabel={formatGroupLabel}

            />
        </div>
    );
};








