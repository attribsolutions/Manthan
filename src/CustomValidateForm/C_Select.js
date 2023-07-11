import Select from "react-select";
import { components } from "react-select/dist/react-select.cjs.prod";

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
