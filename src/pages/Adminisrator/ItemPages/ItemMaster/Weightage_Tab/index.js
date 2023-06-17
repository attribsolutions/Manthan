import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Col,
    Input,
    Label,
    Row,
} from "reactstrap";

function WeightageTab(props) {
    const { weightageTabMaster, setWeightageTabMaster } = props;

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        // Update the state with the new value
        setWeightageTabMaster((prevWeightageTabMaster) => ({
            ...prevWeightageTabMaster,
            [name]: value,
        }));
    };

    return (
        <Row>
            <Col md={12}>
                <Card className="text-black">
                    <CardBody className="c_card_body">
                        <Row className="mt-3">
                            <Col className="col col-12 ">
                                <Row>
                                    <div className="mb-3 col col-sm-4">
                                        <Label>Breadth</Label>
                                        <Input
                                            type="text"
                                            name="Breadth"
                                            value={weightageTabMaster.Breadth}
                                            placeholder="Please Enter Breadth"
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="mb-3 col col-sm-4">
                                        <Label>Grammage</Label>
                                        <Input
                                            type="text"
                                            name="Grammage"
                                            value={weightageTabMaster.Grammage}
                                            placeholder="Please Enter Grammage"
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="mb-3 col col-sm-4">
                                        <Label>Height</Label>
                                        <Input
                                            type="text"
                                            name="Height"
                                            value={weightageTabMaster.Height}
                                            placeholder="Please Enter Height"
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="mb-3 col col-sm-4">
                                        <Label>Length</Label>
                                        <Input
                                            type="text"
                                            name="Length"
                                            value={weightageTabMaster.Length}
                                            placeholder="Please Enter Length"
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="mb-3 col col-sm-4">
                                        <Label>Storing Condition</Label>
                                        <Input
                                            type="text"
                                            name="StoringCondition"
                                            value={weightageTabMaster.StoringCondition}
                                            placeholder="Please Enter Storing Condition"
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
}

export default WeightageTab;