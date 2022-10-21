


export const CommonGetRoleAccessFunction = (history) => {

    const userAccessGetingfromHistory = history.location.state

    if ((userAccessGetingfromHistory === undefined)) {
        // history.push("/Dashboard")
    }
    else {
        if (!(userAccessGetingfromHistory.fromDashboardAccess)) {
            // history.push("/Dashboard")
        }
        const userAccess = userAccessGetingfromHistory.UserDetails
        if (!(userAccess === undefined)) {
            return userAccess
        }
    };
}