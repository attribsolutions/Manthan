import React, { useState } from "react";
import {
    Button,
    Card,
    CardBody,
    Col,
    FormGroup,
    Label,
    Row,
} from "reactstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
    get_Category_By_CategoryType_ForDropDownAPI,
} from "../../../../../store/Administrator/ItemsRedux/action";
import CategoryTable from "./Table";
import { customAlert } from "../../../../../CustomAlert/ConfirmDialog";

function CategoryTab(props) {
    const dispatch = useDispatch();
    const [CategoryTypeDropdownSelect, setCategoryTypeDropdownSelect] = useState("");
    const [categoryDropdownSelect, setcategoryDropdownSelect] = useState("");

    const { CategoryType, Category } = useSelector((state) => ({
        CategoryType: state.categoryTypeReducer.categoryTypeListData,
        Category: state.ItemMastersReducer.Category,
    }));


    const CategoryType_DropdownOptions = CategoryType.map((data) => ({
        value: data.id,
        label: data.Name,
    }));

    const Category_DropdownOptions = Category.map((data) => ({
        value: data.id,
        label: data.Name,
    }));


    const CategoryType_Handler = (event) => {
        setCategoryTypeDropdownSelect(event);
        dispatch(get_Category_By_CategoryType_ForDropDownAPI(event.value))
    };

    const Category_Handler = (event) => {
        setcategoryDropdownSelect(event);

    };

    const addRowsHandler = (e) => {

        const find = props.tableData.find((element) => {
            return element.value === categoryDropdownSelect.value
        });

        if (!(find === undefined)) {
            dispatch(customAlert({
                Type: 4,
                Status: true,
                Message: "Category alredy Select",
            }))
            return
        }
        const val = {
            CategoryType: CategoryTypeDropdownSelect === "" ? "" : CategoryTypeDropdownSelect.value,
            CategoryTypeName: CategoryTypeDropdownSelect.label,
            Category: categoryDropdownSelect === "" ? "" : categoryDropdownSelect.value,
            CategoryName: categoryDropdownSelect.label,

        };

        const totalTableData = props.tableData.length;
        val.id = totalTableData + 1;
        const updatedTableData = [...props.tableData];
        updatedTableData.push(val);
        props.func(updatedTableData);
        clearState();

    };
    const clearState = () => {
        setCategoryTypeDropdownSelect("");
        setcategoryDropdownSelect("");

    };

    return (
        <Row>
            <Col md={12}>
                <Card className="text-black">
                    <CardBody style={{ backgroundColor: "whitesmoke" }}>
                        <Row className="mt-3">

                            <Row>
                                <FormGroup className="mb-3 col col-sm-4 ">
                                    <Label>Category Type</Label>
                                    <Select
                                        id={`dropCategoryType-${0}`}
                                        value={CategoryTypeDropdownSelect}
                                        options={CategoryType_DropdownOptions}
                                        onChange={CategoryType_Handler}
                                    />
                                </FormGroup>

                                <FormGroup className="mb-3 col col-sm-4 ">
                                    <Label>Category</Label>
                                    <Select
                                        id={`dropCategory-${0}`}
                                        value={categoryDropdownSelect}
                                        options={Category_DropdownOptions}
                                        onChange={Category_Handler}
                                    />
                                </FormGroup>

                                <Col md={1}>
                                    <Row className=" mt-3">
                                        <Col >
                                            <Button
                                                className="btn btn-sm mt-1 mt-3 btn-light  btn-outline-primary  "
                                                type="button"
                                                onClick={addRowsHandler}
                                            >
                                                <i className="dripicons-plus mt-3"> </i> Add
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Row>
                    </CardBody>
                </Card>
                <Row>
                    <CategoryTable tableData={props.tableData} func={props.func} />
                </Row>
            </Col>

        </Row>
    );
}

export default CategoryTab;
