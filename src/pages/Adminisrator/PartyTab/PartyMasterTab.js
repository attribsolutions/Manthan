// import React, { useState } from "react";
// import {
//   Card,
//   CardBody,
//   CardHeader,
//   CardText,
//   CardTitle,
//   Col,
//   Collapse,
//   Container,
//   DropdownItem,
//   DropdownMenu,
//   DropdownToggle,
//   Nav,
//   NavItem,
//   NavLink,
//   Row,
//   TabContent,
//   TabPane,
//   UncontrolledDropdown,
// } from "reactstrap";

// import { Link } from "react-router-dom";

// //Import Breadcrumb
// import Breadcrumbs from "../../components/Common/Breadcrumb";

// import classnames from "classnames";

// const PartyMasterTab = () => {

//   //meta title
//   document.title = "Tabs & Accordions | Minia - React Admin & Dashboard Template";

//   const [activeTab, setactiveTab] = useState("1");
//   const [activeTab1, setactiveTab1] = useState("5");
  
  
//   const [col1, setcol1] = useState(true);
//   const [col2, setcol2] = useState(false);
//   const [col3, setcol3] = useState(false);

  

 

//   const t_col1 = () => {
//     setcol1(!col1);
//     setcol2(false);
//     setcol3(false);
//   };

//   const t_col2 = () => {
//     setcol2(!col2);
//     setcol1(false);
//     setcol3(false);
//   };

  
  
//   const toggle = (tab) => {
//     if (activeTab !== tab) {
//       setactiveTab(tab);
//     }
//   };

//   const toggle1 = (tab) => {
//     if (activeTab1 !== tab) {
//       setactiveTab1(tab);
//     }
//   };

  
// //   return (
// //     <React.Fragment>
// //     <div className="page-content text-black" style={{ marginTop: IsEditMode_Css }}>
// //         <Breadcrumb breadcrumbItem={userPageAccessState.PageHeading} />
// //         <MetaTags>
// //             <title>Party Master| FoodERP-React FrontEnd</title>
// //         </MetaTags>
// //         <Container fluid>
// //             <Row>
// //                 <Col lg={12}>
// //                     <Card className="text-black" >
// //                         <CardHeader className="card-header   text-black" style={{ backgroundColor: "#dddddd" }} >
// //                             <h4 className="card-title text-black">{userPageAccessState.PageDescription}</h4>
// //                             <p className="card-title-desc text-black">{userPageAccessState.PageDescriptionDetails}</p>
// //                         </CardHeader>
// //           <TabContent activeTab={activeTab} className="p-3 text-muted">
// //                     <TabPane tabId="1">
// //                       <Row>
// //                         <Col sm="12">
// //                           <CardText className="mb-0">
// //                             Raw denim you probably haven't heard of them jean
// //                             shorts Austin. Nesciunt tofu stumptown aliqua, retro
// //                             synth master cleanse. Mustache cliche tempor,
// //                             williamsburg carles vegan helvetica. Reprehenderit
// //                             butcher retro keffiyeh dreamcatcher synth. Cosby
// //                             sweater eu banh mi, qui irure terry richardson ex
// //                             squid. Aliquip placeat salvia cillum iphone. Seitan
// //                             aliquip quis cardigan american apparel, butcher
// //                             voluptate nisi qui.
// //                           </CardText>
// //                         </Col>
// //                       </Row>
// //                     </TabPane>
// //                     <TabPane tabId="2">
// //                       <Row>
// //                         <Col sm="12">
// //                           <CardText className="mb-0">
// //                             Food truck fixie locavore, accusamus mcsweeney's
// //                             marfa nulla single-origin coffee squid. Exercitation
// //                             +1 labore velit, blog sartorial PBR leggings next
// //                             level wes anderson artisan four loko farm-to-table
// //                             craft beer twee. Qui photo booth letterpress,
// //                             commodo enim craft beer mlkshk aliquip jean shorts
// //                             ullamco ad vinyl cillum PBR. Homo nostrud organic,
// //                             assumenda labore aesthetic magna delectus mollit.
// //                             Keytar helvetica VHS salvia yr, vero magna velit
// //                             sapiente labore stumptown. Vegan fanny pack odio
// //                             cillum wes anderson 8-bit.
// //                           </CardText>
// //                         </Col>
// //                       </Row>
// //                     </TabPane>
// //                   </TabContent>


// //             <Col lg={6}>
// //               <Card>
// //                 <CardHeader>
// //                   <CardTitle className="h4">Justify Tabs</CardTitle>
// //                   <p className="card-title-desc">
// //                     Use the tab JavaScript plugin—include it individually or
// //                     through the compiled{" "}
// //                     <code className="highlighter-rouge">bootstrap.js</code>{" "}
// //                     file—to extend our navigational tabs and pills to create
// //                     tabbable panes of local content, even via dropdown menus.
// //                   </p>
// //                 </CardHeader>
// //                 <CardBody>
// //                   <Nav pills className="navtab-bg nav-justified">
// //                     <NavItem>
// //                       <NavLink
// //                         style={{ cursor: "pointer" }}
// //                         className={classnames({
// //                           active: activeTab1 === "5",
// //                         })}
// //                         onClick={() => {
// //                           toggle1("5");
// //                         }}
// //                       >
// //                         Tab1
// //                       </NavLink>
// //                     </NavItem>
// //                     <NavItem>
// //                       <NavLink
// //                         style={{ cursor: "pointer" }}
// //                         className={classnames({
// //                           active: activeTab1 === "6",
// //                         })}
// //                         onClick={() => {
// //                           toggle1("6");
// //                         }}
// //                       >
// //                        Tab2
// //                       </NavLink>
// //                     </NavItem>
// //                   </Nav>
// //                 </CardBody>
// //               </Card>
// //             </Col>
// //           </Row>
         
// //         </Container>
// //       </div>
// //     </React.Fragment>
// //   );
// // };

// export default PartyMasterTab;