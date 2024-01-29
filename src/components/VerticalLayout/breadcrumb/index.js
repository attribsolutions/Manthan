import React, { useEffect } from "react"
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BreadcrumbReset } from "../../../store/Utilites/Breadcrumb/actions";
import ExcelDownloadButton from "./ExcelDownloadButton";
import DeletedOrNonDeletedButton from "./DeletedOrNonDeletedButton";
import HeaderTitleNewBtn from "./HeaderTitleNewBtn";
import CountLabelComp from "./CountLabelComp";

const BreadcrumbVertical = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(BreadcrumbReset())
  }, [history.location.pathname]);


  return (

    <React.Fragment>

      <div className="breadcrumb-header" >
        <div className="d-flex" style={{ paddingLeft: "7px" }} >
          <HeaderTitleNewBtn />
        </div>

        <div className=" d-flex gap-2 justify-content-end pr-1"  >
          <ExcelDownloadButton />
          <DeletedOrNonDeletedButton />
          <CountLabelComp />
        </div>
      </div>


    </React.Fragment >
  )

}


export default React.memo(BreadcrumbVertical);
