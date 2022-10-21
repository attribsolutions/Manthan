
import './Search.scss'


const initialDetails = [
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


function Search() {

  const [searchRoleData,setSearchRoleData] = React.useState("");
  const[searchResult,setSearchResult] =React.useState([])

  
  const { RoleAccessData, } = useSelector((state) => ({
    RoleAccessData:state.Login.RoleData,
  }));
  
  // useEffect(()=>{

  //   let SearchRoleData_initial =[]

  //   RoleAccessData.map((i)=>{
  //       i.ModuleData.map((index)=>{
  //           SearchRoleData_initial.push(index)
  //       })
  //   })
  //   setSearchRoleData(SearchRoleData_initial)
  //  },[RoleAccessData])
   



  // const filtereddata = details.filter(
  //   person => {
  //     return (
  //       person
  //       .Name
  //       .toLowerCase()
  //       .includes(searchRoleData.toLowerCase()) 
  //     );
  //   }
  // );

  const handleChange = e => {
    setSearchRoleData(e.target.value);
  };


  // function searchList() {
  //   return (
  //   //   <Scroll>
  //       <SearchList filtereddata={filtereddata} />
  //   //   </Scroll>
  //   );
  // }


// useEffect(()=>{

//     const result =initialDetails.filter()

//     RoleAccessData.map((i)=>{
//         i.ModuleData.map((index)=>{
//             SearchRoleData_initial.push(index)
//         })
//     })
//     setSearchRoleData(SearchRoleData_initial)
//    },[RoleAccessData])

React.useEffect(() =>{

    
  const results = initialDetails.filter(Name =>
    Name.toLowerCase().includes(searchRoleData)
  );
  setSearchResult(results);
},
 [searchRoleData]);




// const results =!searchRoleData
//     ? initialDetails
//     : initialDetails.filter(person =>
//       person.Name.trim().toLowerCase().includes(searchRoleData.toLocaleLowerCase())
//       );

  return (
    <form className="app-search d-none d-lg-block " style={{marginTop:"-3px"}} autocomplete="off">
    <div className="position-relative">
        <input type="text" id="myInput" 
         className="form-control"
         placeholder="Search..." 
         name="myCountry" 
         value={searchRoleData}
         onChange={handleChange}/>

<ul>
        
        {searchResult.map(item => (
          <li>{item}</li>
        ))}
      </ul>
         

  
        <button className="btn btn-primary" type="submit"><i className="bx bx-search-alt align-middle"></i></button>
    </div>
</form>








    // <section className="garamond">
    //   <div className="navy georgia ma0 grow">
    //     <h2 className="f2">Search your course</h2>
    //   </div>
    //   <div className="pa2">
    //     <input 
    //       className="pa3 bb br3 grow b--none bg-lightest-blue ma3"
    //       type = "search" 
    //       placeholder = "Search People" 
    //       onChange = {handleChange}
    //     />
    //   </div>
    //   {searchList()}
    // </section>
  );
}


export default Search;
