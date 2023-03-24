import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import './Search.scss'
// import { Search } from "react-bootstrap-table2-toolkit";
// let view = false;
// const onchange = (e) => {
//     e.preventDefault();
//     view = e.target.value.length
// }
export default function SearchBoxSecond() {
    // const { SearchBar } = Search;

    const [searchRoleData, setSearchRoleData] = useState([])
    // const  RoleAccessData=demoRolleAcess

    const { RoleAccessData, searchProps } = useSelector((state) => ({
        RoleAccessData: state.Login.RoleData,
        searchProps: state.BreadcrumbReducer.searchProps,
    }));

    useEffect(() => {

        let SearchRoleData_initial = []

        RoleAccessData.map((i) => {
            i.ModuleData.map((index) => {
                SearchRoleData_initial.push(index)
            })
        })
        setSearchRoleData(SearchRoleData_initial)
    }, [RoleAccessData])


    useEffect(() => {

        function autocomplete(inp, arr) {
            /*the autocomplete function takes two arguments,
            the text field element and an array of possible autocompleted values:*/
            var currentFocus;
            /*execute a function when someone writes in the text field:*/

            inp.addEventListener("input", function (e) {

                var a, b, i, val = this.value;
                /*close any already open lists of autocompleted values*/
                closeAllLists();
                if (!val) { return false; }
                // var a = input.value

                if (val[0] === "/") {
                    val = val.substring(1);
                } else {
                    return false;
                }
                currentFocus = -1;
                /*create a DIV element that will contain the items (values):*/
                a = document.createElement("DIV");
                a.setAttribute("id", this.id + "autocomplete-list");
                a.setAttribute("class", "autocomplete-items");
                /*append the DIV element as a child of the autocomplete container:*/
                this.parentNode.appendChild(a);
                /*for each item in the array...*/
                for (i = 0; i < arr.length; i++) {
                    /*check if the item starts with the same letters as the text field value:*/
                    if (arr[i].Name.substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                        /*create a DIV element for each matching element:*/
                        b = document.createElement("DIV");
                        /*make the matching letters bold:*/
                        b.innerHTML = "<strong>" + arr[i].Name.substr(0, val.length) + "</strong>";
                        b.innerHTML += arr[i].Name.substr(val.length);
                        /*insert a input field that will hold the current array item's value:*/
                        b.innerHTML += "<input type='hidden' id='" + i + "' value='" + arr[i].Name + "'>";
                        //  var ActualPagePath=arr[i].ActualPagePath
                        // alert(ActualPagePath)
                        /*execute a function when someone clicks on the item value (DIV element):*/
                        b.addEventListener("click", function (e) {
                            /*insert the value for the autocomplete text field:*/
                            inp.value = this.getElementsByTagName("input")[0].value;
                            var input_id = this.getElementsByTagName("input")[0].id;

                            // alert(input_id)
                            var ActualPagePath = arr[input_id].ActualPagePath
                            window.location.href = (ActualPagePath)
                            // window.open(ActualPagePath)
                            /*close the list of autocompleted values,
                            (or any other open lists of autocompleted values:*/
                            closeAllLists();
                        });
                        a.appendChild(b);
                    }
                }
            });
            /*execute a function presses a key on the keyboard:*/
            inp.addEventListener("keydown", function (e) {
                // 
                var x = document.getElementById(this.id + "autocomplete-list");
                if (x) x = x.getElementsByTagName("div");
                if (e.keyCode === 40) {
                    /*If the arrow DOWN key is pressed,
                    increase the currentFocus variable:*/
                    currentFocus++;
                    /*and and make the current item more visible:*/
                    addActive(x);
                } else if (e.keyCode === 38) { //up
                    /*If the arrow UP key is pressed,
                    decrease the currentFocus variable:*/
                    currentFocus--;
                    /*and and make the current item more visible:*/
                    addActive(x);
                } else if (e.keyCode === 13) {
                    /*If the ENTER key is pressed, prevent the form from being submitted,*/
                    e.preventDefault();
                    if (currentFocus > -1) {
                        /*and simulate a click on the "active" item:*/
                        if (x) x[currentFocus].click();
                    }
                }
            });
            function addActive(x) {
                /*a function to classify an item as "active":*/
                if (!x) return false;
                /*start by removing the "active" class on all items:*/
                removeActive(x);
                if (currentFocus >= x.length) currentFocus = 0;
                if (currentFocus < 0) currentFocus = (x.length - 1);
                /*add class "autocomplete-active":*/
                x[currentFocus].classList.add("autocomplete-active");
            }
            function removeActive(x) {
                /*a function to remove the "active" class from all autocomplete items:*/
                for (var i = 0; i < x.length; i++) {
                    x[i].classList.remove("autocomplete-active");
                }
            }
            function closeAllLists(elmnt) {
                /*close all autocomplete lists in the document,
                except the one passed as an argument:*/
                var x = document.getElementsByClassName("autocomplete-items");
                for (var i = 0; i < x.length; i++) {
                    if (elmnt != x[i] && elmnt != inp) {
                        x[i].parentNode.removeChild(x[i]);
                    }
                }
            }
            /*execute a function when someone clicks in the document:*/
            document.addEventListener("click", function (e) {
                closeAllLists(e.target);
            });
        }

        /*An array containing all the country names in the world:*/



        var countries = [
            {
                ID: 2,
                Name: "Module List",
                DisplayIndex: 2,
                Icon: "Module List",
                ActualPagePath: "/ModulesList"
            },
            {
                ID: 3,
                Name: "Modules Master",
                DisplayIndex: 1,
                Icon: "Modules Master",
                ActualPagePath: "ModulesMaster"
            },
            {
                ID: 4,
                Name: "Company Master",
                DisplayIndex: 3,
                Icon: "Companys Master",
                ActualPagePath: "companyMaster"
            },
            {
                ID: 5,
                Name: "Company List",
                DisplayIndex: 3,
                Icon: "CompanyList",
                ActualPagePath: "companyList"
            },
            {
                ID: 6,
                Name: "Pages Master",
                DisplayIndex: 5,
                Icon: "pagesMaster",
                ActualPagePath: "pagesMaster"
            },
            {
                ID: 7,
                Name: "Pages List",
                DisplayIndex: 3,
                Icon: "Pages List",
                ActualPagePath: "PagesList"
            },
            {
                ID: 8,
                Name: "Users List",
                DisplayIndex: 8,
                Icon: "Users List",
                ActualPagePath: "usersList"
            },
            {
                ID: 9,
                Name: "Users Master",
                DisplayIndex: 7,
                Icon: "Users Master",
                ActualPagePath: "usersMaster"
            },
            {
                ID: 2,
                Name: "Module List1",
                DisplayIndex: 2,
                Icon: "Module List",
                ActualPagePath: "/ModulesList"
            }, {
                ID: 2,
                Name: "Module List2",
                DisplayIndex: 2,
                Icon: "Module List",
                ActualPagePath: "/ModulesList"
            }, {
                ID: 2,
                Name: "Module List3",
                DisplayIndex: 2,
                Icon: "Module List",
                ActualPagePath: "/ModulesList"
            }, {
                ID: 2,
                Name: "Module List4",
                DisplayIndex: 2,
                Icon: "Module List",
                ActualPagePath: "/ModulesList"
            },
        ]


        /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
        autocomplete(document.getElementById("myInput"), searchRoleData);

    }, [searchRoleData])

    // searchProps2 = searchProps

    return (
        <React.Fragment>
            <MySearch />
        </React.Fragment>


    )
}

let props2 = function onSearch() { }

export const mySearchProps1 = (props1) => {
    props2 = props1;
};

// let input;
// const handleClick = () => {
//     props2.onSearch(input.value);
// };
// function onChange2() {
    
//     var a = input.value

//     if (!(a[0] === "/")) {
//         const str = a.substring(1);
//         props2.onSearch(str);
//     }
// }







const MySearch = () => {
    

    // let input;
    const handleClick = (e) => {
        
        var a = e.target.value

    if (!(a[0] === "/")) {
        const str = a.substring(1);
        props2.onSearch(str);
    }
    };
    function onChange() {
       
    }
    return (
        <div className="app-search d-none d-lg-block " style={{ marginTop: "-3px" }} autocomplete="off">
            <div className="position-relative">
                {/* <input
                    id="myInput"
                    className="form-control"
                    placeholder="Search..."
                    // style={{ backgroundColor: 'pink' }}
                    // ref={n => input = n}
                    type="text"
                    onChange={handleClick}
                    name="myCountry"
                /> */}
                <button className="btn btn-primary"
                    onClick={handleClick}
                    type="button">
                    {/* <i className="bx bx-search-alt align-middle" /> */}
                    <i class="mdi mdi-magnify"/>
                </button>

            </div>
        </div>
    );
}