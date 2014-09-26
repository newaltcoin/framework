var blockstrap_setup_steps = [
    {
        "steps": [
            {
                "id": "step1",
                "css": "btn-page active",
                "href": "",
                "text": "SALT GENERATION"
            },
            {
                "id": "step2",
                "css": "btn-page",
                "href": "",
                "text": "ADDITIONAL SECURITY"
            },
            {
                "id": "step3",
                "css": "btn-page",
                "href": "",
                "text": "CREATE ACCOUNT"
            }
        ],
        "form": {
            "func": "bootstrap",
            "type": "forms",
            "objects": [
                {
                    "id": "setup-device",
                    "fields": [
                        {
                            "inputs": {
                                "id": "app_url",
                                "label": {
                                    "text": "App URL",
                                    "css": "col-sm-3"
                                },
                                "type": "text",
                                "placeholder": "",
                                "value": "{{urls.root}}",
                                "wrapper": {
                                    "css": "col-sm-9"
                                },
                                "attributes": [
                                    {
                                        "key": "data-setup-type",
                                        "value": "module"
                                    }
                                ]
                            }
                        },
                        {
                            "inputs": {
                                "id": "your_name",
                                "label": {
                                    "text": "Your Name",
                                    "css": "col-sm-3"
                                },
                                "type": "text",
                                "placeholder": "Using your actual name is easier to remember",
                                "value": "",
                                "wrapper": {
                                    "css": "col-sm-9"
                                },
                                "attributes": [
                                    {
                                        "key": "data-setup-type",
                                        "value": "module"
                                    }
                                ]
                            }
                        },
                        {
                            "dobs": {
                                "id": "your_dob",
                                "label": {
                                    "text": "Date of Birth",
                                    "css": "col-sm-3"
                                },
                                "placeholder": "",
                                "value": "",
                                "wrapper": {
                                    "css": "col-sm-9"
                                },
                                "day": {
                                    "text": "Day",
                                    "css": "col-sm-4"
                                },
                                "month": {
                                    "text": "Month",
                                    "css": "col-sm-4"
                                },
                                "year": {
                                    "text": "Year",
                                    "css": "col-sm-4"
                                },
                                "attributes": [
                                    {
                                        "key": "data-setup-type",
                                        "value": "module"
                                    }
                                ]
                            }
                        },
                        {
                            "inputs": {
                                "id": "your_city",
                                "label": {
                                    "text": "City of Birth",
                                    "css": "col-sm-3"
                                },
                                "type": "text",
                                "placeholder": "It is easier to remember your real city of birth",
                                "value": "",
                                "wrapper": {
                                    "css": "col-sm-9"
                                },
                                "attributes": [
                                    {
                                        "key": "data-setup-type",
                                        "value": "module"
                                    }
                                ]
                            }
                        },
                        {
                            "inputs": {
                                "id": "salt_pw",
                                "label": {
                                    "text": "Device Password",
                                    "css": "col-sm-3"
                                },
                                "type": "password",
                                "placeholder": "It is important that this is memorable",
                                "wrapper": {
                                    "css": "col-sm-9"
                                },
                                "attributes": [
                                    {
                                        "key": "data-setup-type",
                                        "value": "module"
                                    }
                                ]
                            }
                        },
                        {
                            "inputs": {
                                "id": "salt_pw_repeat",
                                "label": {
                                    "text": "Repeat Password",
                                    "css": "col-sm-3"
                                },
                                "type": "password",
                                "placeholder": "Better safe than sorry",
                                "wrapper": {
                                    "css": "col-sm-9"
                                },
                                "css": "ignore",
                                "attributes": [
                                    {
                                        "key": "data-repeat-id",
                                        "value": "salt_pw"
                                    }
                                ]
                            }
                        }
                    ]
                }
            ],
            "buttons": {
                "forms": [
                    {
                        "id": "setup",
                        "href": "#",
                        "type": "submit",
                        "css": "btn-primary pull-right",
                        "text": "Setup"
                    }
                ]
            }
        }
    }
]