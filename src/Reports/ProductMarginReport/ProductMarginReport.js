import React, { useCallback, useEffect, useMemo } from 'react';
import MetaTags from 'react-meta-tags';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    Col,
    FormGroup,
    Input,
    Label,
    Modal,
    Row,
} from "reactstrap";
import { CurrentURl, breadcrumbReturnFunc, loginCompanyID, loginIsSCMParty, loginPartyID, loginUserDetails, metaTagLabel } from '../../components/Common/CommonFunction';
import * as pageId from "../../routes/allPageID"
import { BreadcrumbShowCountlabel, commonPageField, commonPageFieldSuccess, getGroupList, getGroupListSuccess, getSubGroupList, getSubGroupListSuccess, get_Sub_Group_By_Group_ForDropDown, get_Sub_Group_By_Group_ForDropDown_Success } from '../../store/actions';
import * as mode from "../../routes/PageMode"
import { ProductMargin_Go_Btn_Action, ProductMargin_Go_Btn_Success } from '../../store/Report/SapLedger Redux/action';
import { useState } from 'react';
import { url } from '../../routes';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import BootstrapTable from 'react-bootstrap-table-next';
import { globalTableSearchProps } from '../../components/Common/SearchBox/MySearch';
import { C_Button } from '../../components/Common/CommonButton';
import { C_Select } from '../../CustomValidateForm';
import { getPartyTypelist } from '../../store/Administrator/PartyTypeRedux/action';
import { priceListByPartyAction, priceListByPartyActionSuccess } from '../../store/Administrator/PriceList/action';
import { getPartyTypelistSuccess } from '../../store/Administrator/PartyTypeRedux/action';
import { Items_On_Group_And_Subgroup_API, Items_On_Group_And_Subgroup_API_Success } from '../../store/Report/ItemSaleReport/action';
import { DiscountPartyType_Dropdown_Action, DiscountPartyType_Dropdown_Success } from '../../store/Administrator/DiscountRedux/actions';
import PriceDropOptions from '../../pages/Adminisrator/PartyMaster/MasterAdd/FirstTab/PriceDropOptions';
import Slidewithcaption from '../../components/Common/CommonImageComponent';
import { ExcelReportComponent } from '../../components/Common/ReportCommonFunc/ExcelDownloadWithCSS';
import { allLabelWithZero } from '../../components/Common/CommonErrorMsg/HarderCodeData';
import { get_PriceListByPartyType_API } from '../../helpers/backend_helper';

function initialState(history) {

    let page_Id = '';
    let buttonLable = ''
    let sub_Mode = history.location.pathname;

    if (sub_Mode === url.PRODUCT_MARGIN_REPORT) {
        page_Id = pageId.PRODUCT_MARGIN_REPORT;
        buttonLable = "ProductMarginReport"
    }
    return { page_Id, buttonLable }
};

//==========================================================================================
const priceListAllObject = {// for Pricelist options, Zero index 'All; value 
    "value": 0,
    "label": "All",
    "MkUpMkDn": false,
    "BasePriceListID": 0,
    "CalculationPath": [],
    "children": []
};

//==========================================================================================
const ProductMarginReport = (props) => {

    const history = useHistory()
    const dispatch = useDispatch();
    const isSCMParty = loginIsSCMParty();

    const [userPageAccessState, setUserAccState] = useState('');

    const [page_Id] = useState(() => initialState(history).page_Id);
    const [tableData, setTableData] = useState([]);
    const [btnMode, setBtnMode] = useState("");
    const [columns, setcolumn] = useState([{}]);
    const [columnsCreated, setColumnsCreated] = useState(false)



    const [PartyTypePriceList, setPartyTypePriceList] = useState([]);


    const [partyTypeSelect, setPartyTypeSelect] = useState([allLabelWithZero]);
    const [priceListSelect, setPriceListSelect] = useState(allLabelWithZero);
    const [itemNameSelect, setItemNameSelect] = useState([allLabelWithZero]);
    const [groupSelect, setGroupSelect] = useState([allLabelWithZero]);
    const [subGroupSelect, setSubGroupSelect] = useState([allLabelWithZero]);

    const [imageTable, setImageTable] = useState([]);  // Selected Image Array
    const [modal_backdrop, setmodal_backdrop] = useState(false);   // Image Model open Or not

    //Access redux store Data /  'save_ModuleSuccess' action data
    const {
        ProductMargin,
        userAccess,
        downloadProductMargin,
        pageField,
        PartyTypeLoading,
        PartyType,
        priceListByPartyType,
        ItemDropdownloading,
        ItemNameList,
        productLoading,
        productDropdown,
        subProductLoading,
        subProductDropdown,
        getSubProductbyProduct,
        DiscountPartyTypeLoading,
        DiscountPartyType
    } = useSelector((state) => ({

        downloadProductMargin: state.SapLedgerReducer.downloadProductMargin,
        ProductMargin: state.SapLedgerReducer.ProductMargin,

        userAccess: state.Login.RoleAccessUpdateData,
        pageField: state.CommonPageFieldReducer.pageField,

        DiscountPartyTypeLoading: (state.DiscountReducer.partyTypeDropDownLoading || state.PartyTypeReducer.goBtnLoading),
        DiscountPartyType: state.DiscountReducer.partyType,
        PartyType: state.PartyTypeReducer.ListData,

        priceListByPartyType: state.PriceListReducer.priceListByPartyType,

        ItemDropdownloading: state.ItemSaleReportReducer.itemListLoading,
        ItemNameList: state.ItemSaleReportReducer.itemList,

        productLoading: state.GroupReducer.goBtnLoading,
        productDropdown: state.GroupReducer.groupList,

        subProductLoading: (state.SubGroupReducer.goBtnLoading || state.ItemMastersReducer.subgroupDropDownLoading),
        subProductDropdown: state.SubGroupReducer.SubgroupList,
        getSubProductbyProduct: state.ItemMastersReducer.SubGroupList,
    }));

    useEffect(() => {

        dispatch(commonPageFieldSuccess(null));
        dispatch(commonPageField(page_Id));
        if (isSCMParty) {
            dispatch(getPartyTypelist());
        } else {
            dispatch(DiscountPartyType_Dropdown_Action(loginPartyID()));
        }
        dispatch(getGroupList());
        dispatch(getSubGroupList());
        dispatch(Items_On_Group_And_Subgroup_API({ Group: 0, SubGroup: 0 }));
        dispatch(BreadcrumbShowCountlabel(`Count:${0}`));

        return () => {
            dispatch(getPartyTypelistSuccess([]));
            dispatch(ProductMargin_Go_Btn_Success([]));
            dispatch(DiscountPartyType_Dropdown_Success([]));
            dispatch(priceListByPartyActionSuccess([]));
            dispatch(getGroupListSuccess([]));
            dispatch(getSubGroupListSuccess([]));
            dispatch(Items_On_Group_And_Subgroup_API_Success([]));
        }
    }, []);


    useEffect(async () => {
        
        let results = [];
        if (partyTypeSelect.length > 0) {
            for (const PartyType of partyTypeSelect) {
                try {
                    const response = await get_PriceListByPartyType_API(PartyType.value);
                    results.push(response.Data);
                } catch (error) {
                    console.error(`Error fetching price list for ${PartyType.value}:`, error);
                }
            }
        }
        setPartyTypePriceList(results.flat())
    }, [partyTypeSelect])



    const partyTypeDropdownOptions = useMemo(() => {
        const getOptions = (partyTypes) => [
            { value: 0, label: " All" },
            ...partyTypes.map((i) => ({ value: i.id, label: i.Name })),
        ];

        return isSCMParty
            ? getOptions(PartyType)
            : getOptions(DiscountPartyType);

    }, [DiscountPartyTypeLoading, DiscountPartyType, PartyType, PartyTypeLoading]);

    const priceListByPartyType_WithAll = useMemo(() => {
        if (PartyTypePriceList.length > 0) {
            return [priceListAllObject, ...PartyTypePriceList,];
        }
        return PartyTypePriceList;
    }, [PartyTypePriceList]);

    const location = { ...history.location }
    const hasShowloction = location.hasOwnProperty(mode.editValue)//changes
    const hasShowModal = props.hasOwnProperty(mode.editValue)//changes

    // userAccess useEffect
    useEffect(() => {
        let userAcc = null;
        let locationPath = location.pathname;

        if (hasShowModal) {
            locationPath = props.masterPath;
        };

        userAcc = userAccess.find((inx) => {
            return (`/${inx.ActualPagePath}` === locationPath)
        })

        if (userAcc) {
            setUserAccState(userAcc)
            breadcrumbReturnFunc({ dispatch, userAcc });
        };
    }, [userAccess])


    useEffect(() => {
        if (imageTable.length > 0) {
            setmodal_backdrop(true)
        }
    }, [imageTable])

    function tog_backdrop() {
        setmodal_backdrop(!modal_backdrop)
        removeBodyCss()
    }
    function removeBodyCss() {
        document.body.classList.add("no_padding")
    }

    useEffect(() => {
        if ((ProductMargin.length > 0)) {
            let columns = []
            const objectAtIndex0 = ((ProductMargin[0]));
            for (const key in objectAtIndex0) {

                let column = {}
                let imageColumns = ["SideView(L)", "TopView", "SideView(R)", "BackView", "BarCode", "Poster", "FrontView", "Nutrition"];
                let isImageColumn = imageColumns.includes(key);
                if (isImageColumn) {

                    column = {
                        text: key,
                        dataField: key,
                        sort: true,
                        classes: "table-cursor-pointer",
                        formatter: (cell, row, key) => {

                            const imageShowHandler = async ({ ImageUrl, }) => { // image Show handler                               
                                let slides = []
                                if (ImageUrl !== "") {
                                    slides = [{
                                        Image: ImageUrl
                                    }];
                                }
                                setImageTable(slides)
                            }
                            return (
                                <>
                                    {cell !== "" ?
                                        <div className="d-flex justify-content-center"> {/* Center the column */}
                                            <button
                                                name="image"
                                                style={{
                                                    backgroundImage: `url(${cell})`,
                                                    backgroundSize: 'cover'
                                                }}
                                                onClick={() => {

                                                    imageShowHandler({ ImageUrl: cell })
                                                }}
                                                id={`ImageID_${key}`}
                                                type="button"
                                                className="btn btn-success mt-1"
                                            >
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </button>

                                        </div>
                                        : null}
                                </>
                            );
                        },
                    };
                } else {
                    column = {
                        text: key,
                        dataField: key,
                        sort: true,
                        classes: "table-cursor-pointer",
                    };
                }

                columns.push(column);
            }

            setcolumn(columns)
            setColumnsCreated(true)
        }
    }, [columnsCreated, ProductMargin]);

    useEffect(() => {

        if ((ProductMargin.length > 0)) {

            if (btnMode === "showOnTable") {
                setTableData(ProductMargin)
            } else if (btnMode === "downloadExcel") {

                ExcelReportComponent({  // Download CSV
                    excelTableData: ProductMargin,
                    excelFileName: "Product Margin Report",
                    numericHeaders: ['FE2ItemID', 'SAPCode', 'Barcode', 'HSNCode', 'MRP',
                        // 'GST', 'SKUVol', 'ShelfLife', 'PcsInBox', 'PcsInKG', 'FranchisesMargin', 'GeneralTradeMargin',
                        // 'DistributorMargin', 'SuperStokiestMargin', 'ModernTradeMargin', 'DMartMargin', 'ChitaleXpressMargin',
                        // 'COFOMargin', 'FOFOMargin', 'AirportCXMargin', 'OMHRRMargin', 'OMHDDMargin', 'OMHSSMargin',
                        // 'DirectRetailerMargin', 'HaikoMargin', 'BigBasketMargin', 'RelianceMartMargin', 'StarBazarMargin',
                        // 'FranchisesRateWithGST', 'FranchisesRateWithOutGST', 'GeneralTradeRateWithGST', 'GeneralTradeRateWithOutGST',
                        // 'DistributorRateWithGST', 'DistributorRateWithOutGST', 'SuperStokiestRateWithGST', 'SuperStokiestRateWithOutGST',
                        // 'ModernTradeRateWithGST', 'ModernTradeRateWithOutGST', 'DMartRateWithGST', 'DMartRateWithOutGST',
                        // 'ChitaleXpressRateWithGST', 'ChitaleXpressRateWithOutGST', 'COFORateWithGST', 'COFORateWithOutGST',
                        // 'FOFORateWithGST', 'FOFORateWithOutGST', 'AirportCXRateWithGST', 'AirportCXRateWithOutGST', 'OMHRRRateWithGST',
                        // 'OMHRRRateWithOutGST', 'OMHDDRateWithGST', 'OMHDDRateWithOutGST', 'OMHSSRateWithGST', 'OMHSSRateWithOutGST',
                        // 'DirectRetailerRateWithGST', 'DirectRetailerRateWithOutGST', 'HaikoRateWithGST', 'HaikoRateWithOutGST',
                        // 'BigBasketRateWithGST', 'BigBasketRateWithOutGST', 'RelianceMartRateWithGST', 'RelianceMartRateWithOutGST',
                        // 'StarBazarRateWithGST', 'StarBazarRateWithOutGST'
                    ],
                    dateHeader: ''
                })
            }
            dispatch(ProductMargin_Go_Btn_Success([]));   // Reset Excel Data
        }
    }, [ProductMargin, pageField]);

    function GobtnExcelhandler(Type) {
        
        setBtnMode(Type)
        const userDetails = loginUserDetails();

        const jsonBody = JSON.stringify({
            "IsSCM": (userDetails.IsSCMPartyType).toString(),
            "Party": loginPartyID(),// if IsSCM 0 then Party ID ignore.
            "PartyType": partyTypeSelect.map(i => i.value).join(','),
            "PriceList": priceListSelect.value,
            "Group": groupSelect[0].value === 0 ? "" : groupSelect.map(i => i.value).join(','),
            "SubGroup": subGroupSelect[0].value === 0 ? "" : subGroupSelect.map(i => i.value).join(','),
            "Item": itemNameSelect[0].value === 0 ? "" : itemNameSelect.map(i => i.value).join(','),
            "Company": loginCompanyID()
        });
        dispatch(ProductMargin_Go_Btn_Action({ jsonBody }))
    }

    const partyTypeOptions = PartyType.map((i) => ({
        value: i.id,
        label: i.Name,
    }));

    partyTypeOptions.unshift({
        value: 0,
        label: " All"
    });

    const subProductDropdownOptions = useMemo(() => {
        let options = [];
        if (groupSelect[0].value === 0) {
            options = subProductDropdown.map((i) => ({
                value: i.id,
                label: i.Name,
            }));
        } else {
            options = getSubProductbyProduct.map((i) => ({
                value: i.id,
                label: i.Name,
            }));
        }
        return options;
    }, [groupSelect, subProductDropdown, getSubProductbyProduct]);

    const generateOptions1 = (
        sourceArray,
        labelField = "Name",
        valueField = "id"
    ) => [
            ...sourceArray.map((item) => ({
                value: item[valueField],
                label: item[labelField],
            })),
        ];

    const itemNameDropdownOptions = useMemo(
        () => generateOptions1(ItemNameList),
        [ItemNameList]
    );

    const productDropdownOptions = useMemo(
        () => generateOptions1(productDropdown),
        [productDropdown]
    );

    function PartyTypeOnchange(e) {

        if (e.length > 0 && e[0].value === 0) {
            e.shift()
        } else if (e.some(obj => obj.value === 0)) {
            e = [allLabelWithZero]
        }
        setPartyTypeSelect(e);
        setPriceListSelect(allLabelWithZero);
        dispatch(ProductMargin_Go_Btn_Success([]));
        setTableData([]);
        setcolumn([{}]);
        // dispatch(priceListByPartyAction(e.value))
    }

    function GroupOnchange(e = []) {
        dispatch(ProductMargin_Go_Btn_Success([]));
        setTableData([]);
        setcolumn([{}]);
        dispatch(getSubGroupListSuccess([]));
        dispatch(get_Sub_Group_By_Group_ForDropDown_Success([]));
        dispatch(Items_On_Group_And_Subgroup_API_Success([]));
        setSubGroupSelect([allLabelWithZero]);
        setItemNameSelect([allLabelWithZero]);

        if (e.length === 0) {
            e = [allLabelWithZero];
            dispatch(getGroupList());
            dispatch(getSubGroupList());
            dispatch(Items_On_Group_And_Subgroup_API({ Group: 0, SubGroup: 0 }));
        } else {
            e = e.filter((i) => i.value > 0);
            if (e.length === 1) {
                dispatch(get_Sub_Group_By_Group_ForDropDown(e[0].value));
                dispatch(
                    Items_On_Group_And_Subgroup_API({ Group: e[0].value, SubGroup: 0 })
                );
            } else {
                dispatch(get_Sub_Group_By_Group_ForDropDown_Success([]));
                dispatch(Items_On_Group_And_Subgroup_API_Success([]));
                setSubGroupSelect([allLabelWithZero]);
                setItemNameSelect([allLabelWithZero]);
            }
        }
        setGroupSelect(e);
    }

    function Sub_GroupOnChange(e = []) {
        dispatch(ProductMargin_Go_Btn_Success([]));
        setTableData([]);
        setcolumn([{}]);

        dispatch(Items_On_Group_And_Subgroup_API_Success([]));
        setItemNameSelect([allLabelWithZero]);

        if (e.length === 0) {
            e = [allLabelWithZero];
            dispatch(Items_On_Group_And_Subgroup_API({ Group: 0, SubGroup: 0 }));
            setItemNameSelect([allLabelWithZero]);
        } else {
            e = e.filter((i) => i.value > 0);
            if (e.length === 1) {
                dispatch(
                    Items_On_Group_And_Subgroup_API({ Group: 0, SubGroup: e[0].value })
                );
            } else {
                dispatch(Items_On_Group_And_Subgroup_API_Success([]));
                setItemNameSelect([allLabelWithZero]);
            }
        }
        setSubGroupSelect(e);
    }

    function ItemOnChange(e = []) {
        dispatch(ProductMargin_Go_Btn_Success([]));
        setTableData([]);
        setcolumn([{}]);
        if (e.length === 0) {
            e = [allLabelWithZero];
        } else {
            e = e.filter((i) => i.value > 0);
        }
        setItemNameSelect(e);
    }

    const priceListOnClick = function () {

        const hasNone = document.getElementById("price-drop").style;

        if ((priceListByPartyType_WithAll.length > 0)) {

            if ((hasNone.display === "none") || (hasNone.display === "")) {
                hasNone.display = "block";
            } else {
                hasNone.display = "none";
            }
        }
    };

    function priceListOnChange() {
        dispatch(ProductMargin_Go_Btn_Success([]));
        setTableData([]);
        setcolumn([{}]);
    }

    return (
        <React.Fragment>
            <MetaTags>{metaTagLabel(userPageAccessState)}</MetaTags>
            <div className="page-content">
                <Modal
                    isOpen={modal_backdrop}
                    toggle={() => {
                        tog_backdrop()
                    }}

                    style={{ width: "800px", height: "800px", borderRadius: "50%" }}
                    className="modal-dialog-centered "
                >
                    {(imageTable.length > 0) && <Slidewithcaption Images={imageTable} />}

                </Modal>
                <div className="px-2 c_card_filter text-black" >
                    <Row className="mb-1 row ">
                        <Col sm="3 mt-1" >
                            <FormGroup>
                                <div className="d-flex align-items-center">
                                    <Label className="col-sm-5 p-2">
                                        Party Type
                                    </Label>
                                    <Col sm="8">
                                        <C_Select
                                            classNamePrefix="select2-Customer"
                                            value={partyTypeSelect}
                                            isMulti={true}
                                            isLoading={DiscountPartyTypeLoading}
                                            onChange={(e) => { PartyTypeOnchange(e) }}
                                            options={partyTypeDropdownOptions}
                                            styles={{
                                                menu: (provided) => ({ ...provided, zIndex: 2 }),
                                            }}
                                        />
                                    </Col>
                                </div>
                            </FormGroup>
                        </Col>

                        <Col sm="1"></Col>
                        <Col sm="3 mt-1" >
                            <FormGroup >
                                <div className="d-flex align-items-center">
                                    <Label className="col-sm-5 p-2" >
                                        PriceList
                                    </Label>
                                    <Col sm="8">

                                        <Input
                                            value={priceListSelect.label}
                                            autoComplete={"off"}
                                            placeholder="Select..."
                                            onClick={priceListOnClick}
                                        >
                                        </Input>

                                        <PriceDropOptions
                                            data={priceListByPartyType_WithAll}
                                            priceList={priceListSelect}
                                            setPriceSelect={setPriceListSelect}
                                            onChange={priceListOnChange} />
                                    </Col>
                                </div>
                            </FormGroup>
                        </Col>

                        <Col sm="4 mt-1" ></Col>

                        <Col sm="1" className="mt-2 mb-1 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(downloadProductMargin && btnMode === "showOnTable") && true}
                                className="btn btn-success"
                                onClick={() => GobtnExcelhandler("showOnTable")}
                            >
                                Show
                            </C_Button>
                        </Col>
                    </Row>

                    <Row className="mb-1  row ">
                        <Col sm="3" >
                            <FormGroup>
                                <div className="d-flex align-items-center">
                                    <Label className="col-sm-5 p-2">
                                        Product
                                    </Label>
                                    <Col sm="8">
                                        <C_Select
                                            classNamePrefix="select2-Customer"
                                            isSearchable={true}
                                            isLoading={productLoading}
                                            isMulti={true}
                                            value={groupSelect}
                                            onChange={GroupOnchange}
                                            options={productDropdownOptions}
                                            styles={{
                                                menu: (provided) => ({ ...provided, zIndex: 2 }),
                                            }}
                                        />
                                    </Col>
                                </div>
                            </FormGroup>
                        </Col>
                        <Col sm="1"></Col>

                        <Col sm="3" >
                            <FormGroup >
                                <div className="d-flex align-items-center">
                                    <Label className="col-sm-5 p-2" >
                                        Sub Product
                                    </Label>
                                    <Col sm="8">
                                        <C_Select
                                            classNamePrefix="select2-Customer"
                                            isSearchable={true}
                                            isLoading={subProductLoading}
                                            isMulti={true}
                                            value={subGroupSelect}
                                            onChange={Sub_GroupOnChange}
                                            options={subProductDropdownOptions}
                                            styles={{
                                                menu: (provided) => ({ ...provided, zIndex: 2 }),
                                            }}
                                        />
                                    </Col>
                                </div>
                            </FormGroup>
                        </Col>

                        <Col sm="1"></Col>
                        <Col sm="3" >
                            <FormGroup >
                                <div className="d-flex align-items-center">
                                    <Label className="col-sm-5 p-2" >
                                        SKU Name
                                    </Label>
                                    <Col sm="7">
                                        <C_Select
                                            classNamePrefix="select2-Customer"
                                            isSearchable={true}
                                            isLoading={ItemDropdownloading}
                                            isMulti={true}
                                            value={itemNameSelect}
                                            onChange={ItemOnChange}
                                            options={itemNameDropdownOptions}
                                            styles={{
                                                menu: (provided) => ({ ...provided, zIndex: 2 }),
                                            }}
                                        />
                                    </Col>
                                </div>
                            </FormGroup>
                        </Col>

                        <Col sm="1" className="mt-2 mb-1 ">
                            <C_Button
                                type="button"
                                spinnerColor="white"
                                loading={(downloadProductMargin && btnMode === "downloadExcel") && true}
                                className="btn btn-primary"
                                onClick={() => GobtnExcelhandler("downloadExcel")}
                            >
                                Excel
                            </C_Button>
                        </Col>
                    </Row>
                </div >

                <div className="mt-1">
                    <ToolkitProvider
                        keyField="FE2ItemID"
                        data={tableData}
                        columns={columns}
                        search
                    >
                        {(toolkitProps,) => (
                            <React.Fragment>
                                <Row>
                                    <Col xl="12">
                                        <div className="table-responsive table">
                                            <BootstrapTable
                                                keyField="FE2ItemID"
                                                classes={"table  table-bordered table-hover"}
                                                noDataIndication={
                                                    <div className="text-danger text-center ">
                                                        Record Not available
                                                    </div>
                                                }
                                                onDataSizeChange={({ dataSize }) => {
                                                    dispatch(BreadcrumbShowCountlabel(`Count:${dataSize}`));
                                                }}
                                                {...toolkitProps.baseProps}
                                            />
                                            {globalTableSearchProps(toolkitProps.searchProps)}
                                        </div>
                                    </Col>
                                </Row>

                            </React.Fragment>
                        )}
                    </ToolkitProvider>
                </div>

            </div>
        </React.Fragment>
    );
}

export default ProductMarginReport;