import React, { useState } from "react";
import { debounce } from 'lodash';
let input = '';
let priviousSerach = []
let pageid = ''

let tableProps = { onSearch: () => { } }

export const globalTableSearchProps = (props, pageID) => {
    tableProps = props;
    pageid = pageID;

    // Debounce the search function
    const debouncedOnSearch = debounce(props.onSearch, 200); // 300ms delay

    // Replace the original onSearch with the debounced version
    tableProps.onSearch = debouncedOnSearch;
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


export const MySearch = (props) => {//compont start
    const [search, setSearch] = useState("");

    function handleClick(e) {

        var len = (e.target.value).trimStart()
        input = (e.target.value).trimStart()
        setSearch(input)
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
                value={search}
                autoComplete="off"
                autoFocus={true}
            />
            {props.isButton && <button className="btn btn-primary"
                style={{ cursor: "context-menu" }}
                type="button">
                <i className="bx bx-search-alt align-middle" />
            </button>}

        </React.Fragment>
    );
}