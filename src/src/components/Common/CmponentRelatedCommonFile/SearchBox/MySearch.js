

let props1 = { onSearch: function onSearch() {} }

export const mySearchProps = (props) => {
    props1 = props;
};

export const MySearch = () => {

    let input;
    const handleClick = () => {
        var len = input.value

        if (!(len[0] === "/")) {
            // const str = len.substring(1);
            props1.onSearch(len);
        }
    };
    
    return (
        <div className="app-search d-none d-lg-block " style={{ marginTop: "-3px" }} autocomplete="off">
            <div className="position-relative">
                <input
                    id="myInput"
                    className="form-control"
                    placeholder="Search..."
                    ref={n => input = n}
                    type="text"
                    onChange={handleClick}
                    name="myCountry"
                />
                <button className="btn btn-primary"
                    type="butten">
                    <i className="bx bx-search-alt align-middle" />
                </button>

            </div>
        </div>
    );
}