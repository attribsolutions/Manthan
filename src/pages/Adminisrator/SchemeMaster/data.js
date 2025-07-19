export const Validation = {
    "1": {
        "SchemeValue": {
            "fieldType": "input",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "type": "numeric",
                "greaterThan": 0,
                "lessThan": 10000
            }
        },
        "FromPeriod": {
            "fieldType": "datepicker",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "minDate": "2024-01-01",
                "maxDate": "2025-12-31"
            }
        },
        "ToPeriod": {
            "fieldType": "datepicker",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "minDate": "2024-01-01",
                "maxDate": "2025-12-31"
            }
        },
        "VoucherLimit": {
            "fieldType": "select",
            "isRequired": true,
            "isDisabled": true,
            "validation": {
                "options": [
                    "Active",
                    "Inactive"
                ]
            }
        },
        "BillAbove": {
            "fieldType": "input",
            "isRequired": true,
            "isDisabled": true,
            "validation": {
                "type": "numeric",
                "greaterThan": 0,
                "lessThan": 10000
            }
        },
        "SchemeValueUpto": {
            "fieldType": "input",
            "isRequired": true,
            "isDisabled": true,
            "validation": {
                "type": "numeric",
                "greaterThan": 0,
                "lessThan": 10000
            }
        },
        "Overlap": {
            "fieldType": "checkbox",
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "SchemeQuantity": {
            "fieldType": "input",
            "isRequired": true,
            "isDisabled": true,
            "validation": {
                "type": "numeric",
                "greaterThan": 0,
                "lessThan": 10000
            }
        },
        "QRPrefix": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": false,
            "validation": null
        },
        "SchemeTab": {
            hidden: false,
        },
        "SchemeItemTab": {
            hidden: true,
            Quantityhidden: false,
            Discounthidden: false

        },
        "SchemePartyTab": {
            hidden: false,

        }

    },
    "2": {
        "SchemeValue": {
            "fieldType": "input",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "type": "numeric",
                "greaterThan": 0,
                "lessThan": 10000
            }
        },
        "FromPeriod": {
            "fieldType": "datepicker",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "minDate": "2024-01-01",
                "maxDate": "2025-12-31"
            }
        },
        "ToPeriod": {
            "fieldType": "datepicker",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "minDate": "2024-01-01",
                "maxDate": "2025-12-31"
            }
        },
        "VoucherLimit": {
            "fieldType": "select",
            "isRequired": true,
            "isDisabled": true,
            "validation": {
                "options": [
                    "Active",
                    "Inactive"
                ]
            }
        },
        "BillAbove": {
            "fieldType": "input",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "type": "numeric",
                "greaterThan": 0,
                "lessThan": 10000
            }
        },
        "SchemeValueUpto": {
            "fieldType": "input",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "type": "numeric",
                "greaterThan": 0,
                "lessThan": 10000
            }
        },
        "Overlap": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "SchemeQuantity": {
            "fieldType": "input",
            "isRequired": true,
            "isDisabled": true,
            "validation": {
                "type": "numeric",
                "greaterThan": 0,
                "lessThan": 10000
            }
        },
        "QRPrefix": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": false,
            "validation": null
        },
        "SchemeTab": {
            hidden: false,
        },
        "SchemeItemTab": {
            hidden: false,
            Quantityhidden: true,
            Discounthidden: true

        },
        "SchemePartyTab": {
            hidden: false,
        }

    },
    "3": {
        "SchemeValue": {
            "fieldType": "input",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "type": "numeric",
                "greaterThan": 0,
                "lessThan": 10000
            }
        },
        "FromPeriod": {
            "fieldType": "datepicker",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "minDate": "2024-01-01",
                "maxDate": "2025-12-31"
            }
        },
        "ToPeriod": {
            "fieldType": "datepicker",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "minDate": "2024-01-01",
                "maxDate": "2025-12-31"
            }
        },
        "VoucherLimit": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "BillAbove": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": false,
            "validation": null
        },
        "SchemeValueUpto": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": false,
            "validation": null
        },
        "Overlap": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": false,
            "validation": null
        },
        "SchemeQuantity": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "QRPrefix": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": false,
            "validation": null
        },
        "SchemeTab": {
            hidden: false,
        },
        "SchemeItemTab": {
            hidden: false,
            Quantityhidden: false,
            Discounthidden: false
        },
        "SchemePartyTab": {
            hidden: false,
        }

    },
    "10": {
        "SchemeValue": {
            "fieldType": "input",
            "isRequired": true,
            "isDisabled": true,
            "validation": {
                "type": "numeric",
                "greaterThan": 0,
                "lessThan": 10000
            }
        },
        "FromPeriod": {
            "fieldType": "datepicker",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "minDate": "2024-01-01",
                "maxDate": "2025-12-31"
            }
        },
        "ToPeriod": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": false,
            "validation": null
        },
        "VoucherLimit": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "BillAbove": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": false,
            "validation": null
        },
        "SchemeValueUpto": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "Overlap": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "SchemeQuantity": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "QRPrefix": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "SchemeTab": {
            hidden: false,
        },
        "SchemeItemTab": {
            hidden: true,
            Quantityhidden: true,
            Discounthidden: true

        },
        "SchemePartyTab": {
            hidden: false,
        }

    },
    "13": {
        "SchemeValue": {
            "fieldType": "input",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "type": "numeric",
                "greaterThan": 0,
                "lessThan": 10000
            }
        },
        "FromPeriod": {
            "fieldType": "datepicker",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "minDate": "2024-01-01",
                "maxDate": "2025-12-31"
            }
        },
        "ToPeriod": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": false,
            "validation": null
        },
        "VoucherLimit": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "BillAbove": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": false,
            "validation": null
        },
        "SchemeValueUpto": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "Overlap": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": false,
            "validation": null
        },
        "SchemeQuantity": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "QRPrefix": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "SchemeTab": {
            hidden: false,
        },
        "SchemeItemTab": {
            hidden: false,
            Quantityhidden: true,
            Discounthidden: true

        },
        "SchemePartyTab": {
            hidden: false,
        }

    },
    "14": {
        "SchemeValue": {
            "fieldType": "input",
            "isRequired": true,
            "isDisabled": true,
            "validation": {
                "type": "numeric",
                "greaterThan": 0,
                "lessThan": 10000
            }
        },
        "FromPeriod": {
            "fieldType": "datepicker",
            "isRequired": true,
            "isDisabled": false,
            "validation": {
                "minDate": "2024-01-01",
                "maxDate": "2025-12-31"
            }
        },
        "ToPeriod": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": false,
            "validation": null
        },
        "VoucherLimit": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "BillAbove": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "SchemeValueUpto": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "Overlap": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "SchemeQuantity": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },
        "QRPrefix": {
            "fieldType": null,
            "isRequired": false,
            "isDisabled": true,
            "validation": null
        },

        "SchemeTab": {
            hidden: false,
        },
        "SchemeItemTab": {
            hidden: false,
            Quantityhidden: false,
            Discounthidden: false

        },
        "SchemePartyTab": {
            hidden: false,
        }


    }
}







export const ItemTabValidation = {



}