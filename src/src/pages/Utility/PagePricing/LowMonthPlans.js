import React from 'react';

const LowMonthPlans = () => {
    return (
        <React.Fragment>
            <div className="table-responsive text-center">
                <table className="table table-bordered mb-0 table-centered align-middle">
                    <tbody>
                        <tr>
                            <td></td>
                            <td style={{ width: '20%' }}>
                                <div className="py-3">
                                    <h5 className="font-size-16 mb-0">1 Month</h5>
                                </div>
                            </td>
                            <td style={{ width: '20%' }}>
                                <div className="py-3">
                                    <h5 className="font-size-16 mb-0">3 Month</h5>
                                </div>
                            </td>
                            <td style={{ width: '20%' }}>
                                <div className="py-3">
                                    <h5 className="font-size-16 mb-0">6 Month</h5>
                                </div>
                            </td>
                            <td style={{ width: '20%' }}>
                                <div className="py-3">
                                    <h5 className="font-size-16 mb-0">1 Years</h5>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Users</th>
                            <td>1</td>
                            <td>3</td>
                            <td>5</td>
                            <td>7</td>
                        </tr>
                        <tr>
                            <th scope="row">Storage</th>
                            <td>1 GB</td>
                            <td>10 GB</td>
                            <td>20 GB</td>
                            <td>40 GB</td>
                        </tr>
                        <tr>
                            <th scope="row">Domain</th>
                            <td>
                                <div>
                                    <i className="mdi mdi-close-circle text-danger font-size-20"></i>
                                </div>
                            </td>
                            <td>1</td>
                            <td>2</td>
                            <td>4</td>
                        </tr>
                        <tr>
                            <th scope="row">Hidden Fees</th>
                            <td>Yes</td>
                            <td>Yes</td>
                            <td>No</td>
                            <td>No</td>
                        </tr>
                        <tr>
                            <th scope="row">Support</th>
                            <td>
                                <div>
                                    <i className="mdi mdi-close-circle text-danger font-size-20"></i>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <i className="mdi mdi-check-circle text-success font-size-20"></i>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <i className="mdi mdi-check-circle text-success font-size-20"></i>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <i className="mdi mdi-check-circle text-success font-size-20"></i>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Update</th>
                            <td>
                                <div>
                                    <i className="mdi mdi-close-circle text-danger font-size-20"></i>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <i className="mdi mdi-close-circle text-danger font-size-20"></i>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <i className="mdi mdi-check-circle text-success font-size-20"></i>
                                </div>
                            </td>
                            <td>
                                <div>
                                    <i className="mdi mdi-check-circle text-success font-size-20"></i>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    );
}

export default LowMonthPlans;