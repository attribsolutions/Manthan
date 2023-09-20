     {/* <div className="px-2 c_card_filter header text-black mb-2">
                            <Row>
                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.Date}>
                                        <C_DatePicker
                                            name='Date'
                                            value={values.Date}
                                            onChange={Date_Onchange}
                                        />
                                    </FormGroupWithLabel>
                                </Col>

                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.ClaimForTheMonth}>
                                        {renderSelect('ClaimForTheMonth', values.ClaimForTheMonth, ClaimForTheMonthOtion, (hasSelect, evn) => ClaimForTheMonthOnchange(hasSelect, evn), isError.ClaimForTheMonth)}
                                    </FormGroupWithLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.ClaimId}>
                                        {renderSelect('ClaimId', values.ClaimId, [], (hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState }), isError.ClaimId)}
                                    </FormGroupWithLabel>
                                </Col>

                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.ClaimText}>
                                        {renderInput('ClaimText', values.ClaimText, isError.ClaimText, '', onChangeText)}
                                    </FormGroupWithLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.PartyName}>
                                        {renderSelect('PartyName', values.PartyName, partyListOptions, (hasSelect, evn) => partyOnChange(hasSelect, evn), isError.PartyName)}
                                    </FormGroupWithLabel>
                                </Col>

                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.ClaimReceivedSource}>
                                        {renderSelect('ClaimReceivedSource', values.ClaimReceivedSource, [], (hasSelect, evn) => ClaimReceivedSourceOnchange(hasSelect, evn), isError.ClaimReceivedSource)}
                                    </FormGroupWithLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.Type}>
                                        {renderSelect('Type', values.Type, typeOption, (hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState }), isError.Type)}
                                    </FormGroupWithLabel>
                                </Col>

                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.ClaimTrade}>
                                        {renderSelect('ClaimTrade', values.ClaimTrade, [], (hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState }), isError.ClaimTrade)}
                                    </FormGroupWithLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.TypeOfClaim}>
                                        {renderSelect('TypeOfClaim', values.TypeOfClaim, typeOfClaimOption, (hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState }), isError.TypeOfClaim)}
                                    </FormGroupWithLabel>
                                </Col>

                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.ClaimAmount}>
                                        {renderInput('ClaimAmount', values.ClaimAmount, isError.ClaimAmount, '', onChangeText)}
                                    </FormGroupWithLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.Remark}>
                                        {renderInput('Remark', values.Remark, isError.Remark, '', onChangeText)}
                                    </FormGroupWithLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.CompanyName}>
                                        {renderSelect('CompanyName', values.CompanyName, companyListOptions, (hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState }), isError.CompanyName)}
                                    </FormGroupWithLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.ClaimCheckBy}>
                                        {renderSelect('ClaimCheckBy', values.ClaimCheckBy, claimCheckByOption, (hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState }), isError.ClaimCheckBy)}
                                    </FormGroupWithLabel>
                                </Col>

                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.CreditNotestatus}>
                                        {renderSelect('CreditNotestatus', values.CreditNotestatus, creditNoteStatusOption, (hasSelect, evn) => onChangeSelect({ hasSelect, evn, state, setState }), isError.CreditNotestatus)}
                                    </FormGroupWithLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.CreditNoteNo}>
                                        {renderInput('CreditNoteNo', values.CreditNoteNo, isError.CreditNoteNo, '', onChangeText)}
                                    </FormGroupWithLabel>
                                </Col>

                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.CreditNoteDate}>
                                        <C_DatePicker
                                            name='CreditNoteDate'
                                            value={values.CreditNoteDate}
                                            onChange={Date_Onchange}
                                        />
                                    </FormGroupWithLabel>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.CreditNoteAmount}>
                                        {renderInput('CreditNoteNo', values.CreditNoteNo, isError.CreditNoteNo, '', onChangeText)}
                                    </FormGroupWithLabel>
                                </Col>

                                <Col sm="6">
                                    <FormGroupWithLabel label={fieldLabel.ClaimSummaryDate}>
                                        <C_DatePicker
                                            name='ClaimSummaryDate'
                                            value={values.ClaimSummaryDate}
                                            onChange={Date_Onchange}
                                        />
                                    </FormGroupWithLabel>
                                </Col>
                            </Row>
                        </div> */}