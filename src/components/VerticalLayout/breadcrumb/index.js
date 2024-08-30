import React, { useEffect } from "react"
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { BreadcrumbReset } from "../../../store/Utilites/Breadcrumb/actions";
import ExcelDownloadButton from "./ExcelDownloadButton";
import DeletedOrNonDeletedButton from "./DeletedOrNonDeletedButton";
import HeaderTitleNewBtn from "./HeaderTitleNewBtn";
import CountLabelComp from "./CountLabelComp";
import { MySearch } from "../../Common/SearchBox/MySearch";
import { Col, Row } from "reactstrap";
import { IsLoginFromOutsideLink } from "../../Common/CommonFunction";

const BreadcrumbVertical = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(BreadcrumbReset())
  }, [history.location.pathname]);


  return (
    <React.Fragment>
      <div className="breadcrumb-header">
        <div className="d-flex flex-grow-0"  >
          <HeaderTitleNewBtn />
        </div>

        <div className=" d-flex gap-2 justify-content-end  align-items-center"  >
          {IsLoginFromOutsideLink(history.location.pathname) && <Col sm={6}>
            <Row>
              <Col sm={12}>
                <div className="input-group">
                  <MySearch className="form-control" isButton={false} />
                  <button
                    className="btn btn-primary"
                    type="button"
                    style={{ borderRadius: "4px", cursor: "default" }}
                  >
                    <i className="bx bx-search-alt align-middle" />
                  </button>
                </div>
              </Col>
            </Row>
          </Col>}
          <ExcelDownloadButton />
          <DeletedOrNonDeletedButton />
          <div className="align-items-center">
            <CountLabelComp />
          </div>
        </div>
      </div>


    </React.Fragment >
  )

}


export default React.memo(BreadcrumbVertical);
