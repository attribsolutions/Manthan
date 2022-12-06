
let props1 = { onSearch: function onSearch() { } }
let input = '';
let priviousSerach = []
let pageid = ''


export const mySearchProps = (props, pageID) => {
    props1 = props;
    pageid = pageID
};

export const defaultSearch = (defaultid) => {
    debugger
    const found = priviousSerach.find((i, k) => {
        return (i.id === defaultid)
    });
    let aa = { defaultSearch: '' }

    if (found) {
        document.getElementById("myInput").value = found.text

        aa = { defaultSearch: found.text }
    }
    return aa
}




export const MySearch = () => {

    function handleClick(e) {
        debugger
        var len = e.target.value
        input = e.target.value


        if (!(len[0] === "/")) {

            props1.onSearch(len);

            const found = priviousSerach.find((i, k) => {
                if ((i.id === pageid)) {
                    priviousSerach[k] = { id: i.id, text: len }
                }
                return (i.id === pageid)
            });

            if (!found) {
                priviousSerach.push({ id: pageid, text: len })
            }
        }
    };
    return (
        <div className="app-search d-none d-lg-block " style={{ marginTop: "-3px" }} autocomplete="off">
            <div className="position-relative">
                <input
                    id="myInput"
                    className="form-control"
                    placeholder="Search..."
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