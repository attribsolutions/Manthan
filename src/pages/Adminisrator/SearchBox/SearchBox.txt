import React, { useEffect } from 'react'

export default function SearchBox() {

    useEffect(() => {
        const searchInput = document.querySelector('#search');

        const list = document.getElementById('list')
        const clearButton = document.getElementById('clear')
        function clearList() {
            // looping through each child of the search results list and remove each child
            while (list.firstChild) {
                list.removeChild(list.firstChild)
            }
        }
        searchInput.addEventListener("input",(e) => {
            // inside, we will need to achieve a few things:
            // 1. declare and assign the value of the event's target to a variable AKA whatever is typed in the search bar
            let value = e.target.value

            // 2. check: if input exists and if input is larger than 0
            if (value && value.trim().length > 0) {
                // 3. redefine 'value' to exclude white space and change input to all lowercase
                value = value.trim().toLowerCase()
                // 4. return the results only if the value of the search is included in the person's name
                // we need to write code (a function for filtering through our data to include the search input value)
            } else {
                // 5. return nothing
                clearList()

            }

        })




        searchInput.addEventListener("input", (e) => {
            let value = e.target.value

            if (value && value.trim().length > 0) {
                value = value.trim().toLowerCase()

                //returning only the results of setList if the value of the search is included in the person's name
                setList(people.filter(person => {
                    return person.ActualPagePath.includes(value)
                })

                )

            }
        })



        clearButton.addEventListener("click", () => {
            clearList()
        })

        function noResults() {
            // create an element for the error; a list item ("li")
            const error = document.createElement('li')
            // adding a class name of "error-message" to our error element
            error.classList.add('error-message')

            // creating text for our element
            const text = document.createTextNode('No results found. Sorry!')
            // appending the text to our element
            error.appendChild(text)
            // appending the error to our list element
            list.appendChild(error)

        }

        function setList(results) {
            clearList()



            debugger
            for (const person of results) {
                const resultItem = document.createElement('li')
                resultItem.classList.add('result-item')
                const text = document.createTextNode(person.Name)
                resultItem.appendChild(text)
                list.appendChild(resultItem)
            }

            if (results.length === 0) {
                noResults()
            }
        }
    }, [])

    return (
        <div className="page-content">
            <body>
                <div class="form-container">
                    <form class="form">
                        <input id="search" type="text" class="input" placeholder="search..." />
                        <button id="clear" class="clear-results">clear</button>
                    </form>
                </div>
                <div className='card' style={{ width: '18rem', overflow: "visible", zIndex: 99 }}>
                    <div className='cardBody'>
                        <div class="results-container">
                            <ul class="results-list" id="list">

                            </ul>
                        </div>
                    </div>
                </div>
                <script src="index.js"></script>
            </body>
        </div>
    )
}





const people =

[
  // {
  //   ModuleID: 8,
  //   ModuleName: "Administration  module master list page",
  //   ModuleData: [
      {
        ID: 2,
        Name: "module list name",
        DisplayIndex: 2,
        Icon: "Module List",
        ActualPagePath: "ModulesList"
      },
      {
        ID: 3,
        Name: "Modules Master name",
        DisplayIndex: 1,
        Icon: "Modules Master",
        ActualPagePath: "modulesMaster"
      },
      {
        ID: 4,
        Name: "Company Master name",
        DisplayIndex: 3,
        Icon: "Companys Master",
        ActualPagePath: "companyMaster"
      },
      {
        ID: 5,
        Name: "company list name",
        DisplayIndex: 3,
        Icon: "CompanyList",
        ActualPagePath: "companyList"
      },
      {
        ID: 6,
        Name: "pages master name",
        DisplayIndex: 5,
        Icon: "pagesMaster",
        ActualPagePath: "pagesMaster"
      },
      {
        ID: 7,
        Name: "pages list name",
        DisplayIndex: 3,
        Icon: "Pages List",
        ActualPagePath: "PagesList"
      },
      {
        ID: 8,
        Name: "users list name",
        DisplayIndex: 8,
        Icon: "Users List",
        ActualPagePath: "usersList"
      },
      {
        ID: 9,
        Name: "users master",
        DisplayIndex: 7,
        Icon: "Users Master",
        ActualPagePath: "usersMaster"
      }
    ]
