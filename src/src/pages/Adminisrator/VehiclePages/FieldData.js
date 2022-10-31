export const fieldData = [

    {
        controlId: 'DriverName',
        controlType: 2,
        controltypeName: "select",
        fieldLabel: "Driver Name ",
        isCompulsory: true,
        defaultSort: true,
        fieldValidation: 4,
        fieldValidationName: "10 digit Number",
        showInListPage: true,
        showInDownload: true,
        downloadDefaultSelect: false,
        regExp: /^.{4,100}$/,
        inValidMsg: "DriverName  is invalid",

    },

    {
        controlId: 'Vehicletype',
        controlType: 2,
        controltypeName: "select",
        fieldLabel: "Vehicle Type ",
        isCompulsory: true,
        defaultSort: true,
        fieldValidation: 4,
        fieldValidationName: "10 digit Number",
        showInListPage: true,
        showInDownload: true,
        downloadDefaultSelect: false,
        regExp: /^.{4,100}$/,
        inValidMsg: "VehicleType  is invalid",

    },

    {

        controlId: 'VehicleNumber',
        ControlType: 2,
        ControlTypeName: "text",
        fieldLabel: "Vehicle Number ",
        isCompulsory: true,
        defaultSort: true,
        showInListPage: true,
        showInDownload: true,
        downloadDefaultSelect: false,
        regExp: /^.{4,100}$/,
        inValidMsg: "VehicleNumber is invalid",

    },

    {
        controlId: 'Description',
        ControlType: 2,
        ControlTypeName: "text",
        fieldLabel: "Description ",
        isCompulsory: true,
        defaultSort: true,
        showInListPage: true,
        showInDownload: true,
        downloadDefaultSelect: false,
        regExp: /^.{4,100}$/,
        inValidMsg: "Description is invalid",

    },



    {
        controlId: 'VehicleDivisions',
        controlType: 2,
        controltypeName: "select",
        fieldLabel: "Division ",
        isCompulsory: true,
        defaultSort: true,
        fieldValidation: 4,
        fieldValidationName: "10 digit Number",
        showInListPage: true,
        showInDownload: true,
        downloadDefaultSelect: false,
        regExp: /^.{4,100}$/,
        inValidMsg: "Division  is invalid",

    },
]