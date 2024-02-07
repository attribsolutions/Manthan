import React from "react";

let input = '';
let priviousSerach = []
let pageid = ''

let tableProps = { onSearch: () => { } }

export const globalTableSearchProps = (props, pageID) => {
    tableProps = props;
    pageid = pageID
};


export const defaultSearch = (defaultid,) => {
    let retn = { defaultSearch: '' }

    let found = priviousSerach.find((i, k) => {
        return (i.id === defaultid)
    });

    if (found) {
        document.getElementById("myInput").value = found.text
        retn = { defaultSearch: found.text }
    }

    return retn
}

export const MySearch = () => {//compont start

    function handleClick(e) {

        var len = e.target.value
        input = e.target.value
        if (!(len[0] === "/")) {
            tableProps.onSearch(len);

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
        <React.Fragment>
            <input
                id="myInput"
                className="form-control"
                placeholder="Search..."
                type="text"
                onChange={handleClick}
                name="myCountry"
                autoComplete="off"
                autoFocus={true}
            />
            <button className="btn btn-primary"
                type="butten">
                <i className="bx bx-search-alt align-middle" />
            </button>

        </React.Fragment>
    );
}