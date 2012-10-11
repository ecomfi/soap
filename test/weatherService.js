exports.service =
{
    "serviceType": "weather_ServiceType",
    "httpOptions": {
        "hostname": "wsf.cdyne.com",
        "path": "/WeatherWS/Weather.asmx",
        "isHttps": false,
        "method": "POST"
    },
    "types": {
        "{http://ws.cdyne.com/WeatherWS/}GetCityForecastByZIP_Type_VxlRT1": {
            "content": [
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "ZIP"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "isSynthetic": true,
            "name": "GetCityForecastByZIP_Type_VxlRT1",
            "stem": "GetCityForecastByZIP_Type"
        },
        "{http://ws.cdyne.com/WeatherWS/}GetCityForecastByZIPResponse_Type_9d23U3": {
            "content": [
                {
                    "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "xmlType": "ForecastReturn",
                    "name": "GetCityForecastByZIPResult",
                    "minOccurs": "0"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "isSynthetic": true,
            "name": "GetCityForecastByZIPResponse_Type_9d23U3",
            "stem": "GetCityForecastByZIPResponse_Type"
        },
        "{http://ws.cdyne.com/WeatherWS/}ForecastReturn": {
            "content": [
                {
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "jsonType": "boolean",
                    "name": "Success"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "ResponseText"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "State"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "City"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "WeatherStationCity"
                },
                {
                    "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "xmlType": "ArrayOfForecast",
                    "name": "ForecastResult",
                    "minOccurs": "0"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "nsChecksum": "JvmG91",
            "name": "ForecastReturn"
        },
        "{http://ws.cdyne.com/WeatherWS/}ArrayOfForecast": {
            "content": [
                {
                    "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "xmlType": "Forecast",
                    "name": "Forecast",
                    "minOccurs": "0",
                    "maxOccurs": "-1"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "nsChecksum": "JvmG91",
            "name": "ArrayOfForecast"
        },
        "{http://ws.cdyne.com/WeatherWS/}Forecast": {
            "content": [
                {
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "jsonType": "date",
                    "name": "Date"
                },
                {
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "jsonType": "number",
                    "name": "WeatherID"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "Desciption"
                },
                {
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/",
                    "name": "Temperatures",
                    "xmlType": "temp"
                },
                {
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/",
                    "name": "ProbabilityOfPrecipiation",
                    "xmlType": "POP"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "nsChecksum": "JvmG91",
            "name": "Forecast"
        },
        "{http://ws.cdyne.com/WeatherWS/}temp": {
            "content": [
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "MorningLow"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "DaytimeHigh"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "nsChecksum": "JvmG91",
            "name": "temp"
        },
        "{http://ws.cdyne.com/WeatherWS/}POP": {
            "content": [
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "Nighttime"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "Daytime"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "nsChecksum": "JvmG91",
            "name": "POP"
        },
        "{http://ws.cdyne.com/WeatherWS/}GetCityWeatherByZIP_Type_F3l0V1": {
            "content": [
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "ZIP"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "isSynthetic": true,
            "name": "GetCityWeatherByZIP_Type_F3l0V1",
            "stem": "GetCityWeatherByZIP_Type"
        },
        "{http://ws.cdyne.com/WeatherWS/}GetCityWeatherByZIPResponse_Type___lVt3": {
            "content": [
                {
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/",
                    "name": "GetCityWeatherByZIPResult",
                    "xmlType": "WeatherReturn"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "isSynthetic": true,
            "name": "GetCityWeatherByZIPResponse_Type___lVt3",
            "stem": "GetCityWeatherByZIPResponse_Type"
        },
        "{http://ws.cdyne.com/WeatherWS/}WeatherReturn": {
            "content": [
                {
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "jsonType": "boolean",
                    "name": "Success"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "ResponseText"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "State"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "City"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "WeatherStationCity"
                },
                {
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "jsonType": "number",
                    "name": "WeatherID"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "Description"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "Temperature"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "RelativeHumidity"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "Wind"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "Pressure"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "Visibility"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "WindChill"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "Remarks"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "nsChecksum": "JvmG91",
            "name": "WeatherReturn"
        },
        "{http://ws.cdyne.com/WeatherWS/}GetWeatherInformation_Type_QwmCH1": {
            "content": [],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "isSynthetic": true,
            "name": "GetWeatherInformation_Type_QwmCH1",
            "stem": "GetWeatherInformation_Type"
        },
        "{http://ws.cdyne.com/WeatherWS/}GetWeatherInformationResponse_Type_ncoxk2": {
            "content": [
                {
                    "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "xmlType": "ArrayOfWeatherDescription",
                    "name": "GetWeatherInformationResult",
                    "minOccurs": "0"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "isSynthetic": true,
            "name": "GetWeatherInformationResponse_Type_ncoxk2",
            "stem": "GetWeatherInformationResponse_Type"
        },
        "{http://ws.cdyne.com/WeatherWS/}ArrayOfWeatherDescription": {
            "content": [
                {
                    "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "xmlType": "WeatherDescription",
                    "name": "WeatherDescription",
                    "minOccurs": "0",
                    "maxOccurs": "-1"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "nsChecksum": "JvmG91",
            "name": "ArrayOfWeatherDescription"
        },
        "{http://ws.cdyne.com/WeatherWS/}WeatherDescription": {
            "content": [
                {
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "jsonType": "number",
                    "name": "WeatherID"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "Description"
                },
                {
                    "jsonType": "string",
                    "ns": "http://ws.cdyne.com/WeatherWS/",
                    "minOccurs": "0",
                    "name": "PictureURL"
                }
            ],
            "ns": "http://ws.cdyne.com/WeatherWS/",
            "nsChecksum": "JvmG91",
            "name": "WeatherDescription"
        }
    },
    "operations": {
        "GetCityForecastByZIP": {
            "requestDesc": {
                "opName": "GetCityForecastByZIP",
                "opNs": "http://ws.cdyne.com/WeatherWS/",
                "soapAction": "http://ws.cdyne.com/WeatherWS/GetCityForecastByZIP",
                "isEncoded": false,
                "isRpc": false,
                "soapVersion": "1.1",
                "parts": [
                    {
                        "elementName": "GetCityForecastByZIP",
                        "name": "parameters",
                        "elementNs": "http://ws.cdyne.com/WeatherWS/",
                        "xmlType": "GetCityForecastByZIP_Type_VxlRT1",
                        "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/"
                    }
                ]
            },
            "deserializationOptions": {
                "removeEnvelope": true,
                "soapEncoded": false
            },
            "responseDesc": {
                "isEncoded": false,
                "isRpc": false,
                "parts": [
                    {
                        "elementName": "GetCityForecastByZIPResponse",
                        "name": "parameters",
                        "elementNs": "http://ws.cdyne.com/WeatherWS/",
                        "xmlType": "GetCityForecastByZIPResponse_Type_9d23U3",
                        "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/"
                    }
                ]
            }
        },
        "GetCityWeatherByZIP": {
            "requestDesc": {
                "opName": "GetCityWeatherByZIP",
                "opNs": "http://ws.cdyne.com/WeatherWS/",
                "soapAction": "http://ws.cdyne.com/WeatherWS/GetCityWeatherByZIP",
                "isEncoded": false,
                "isRpc": false,
                "soapVersion": "1.1",
                "parts": [
                    {
                        "elementName": "GetCityWeatherByZIP",
                        "name": "parameters",
                        "elementNs": "http://ws.cdyne.com/WeatherWS/",
                        "xmlType": "GetCityWeatherByZIP_Type_F3l0V1",
                        "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/"
                    }
                ]
            },
            "deserializationOptions": {
                "removeEnvelope": true,
                "soapEncoded": false
            },
            "responseDesc": {
                "isEncoded": false,
                "isRpc": false,
                "parts": [
                    {
                        "elementName": "GetCityWeatherByZIPResponse",
                        "name": "parameters",
                        "elementNs": "http://ws.cdyne.com/WeatherWS/",
                        "xmlType": "GetCityWeatherByZIPResponse_Type___lVt3",
                        "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/"
                    }
                ]
            }
        },
        "GetWeatherInformation": {
            "requestDesc": {
                "opName": "GetWeatherInformation",
                "opNs": "http://ws.cdyne.com/WeatherWS/",
                "soapAction": "http://ws.cdyne.com/WeatherWS/GetWeatherInformation",
                "isEncoded": false,
                "isRpc": false,
                "soapVersion": "1.1",
                "parts": [
                    {
                        "elementName": "GetWeatherInformation",
                        "name": "parameters",
                        "elementNs": "http://ws.cdyne.com/WeatherWS/",
                        "xmlType": "GetWeatherInformation_Type_QwmCH1",
                        "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/"
                    }
                ]
            },
            "deserializationOptions": {
                "removeEnvelope": true,
                "soapEncoded": false
            },
            "responseDesc": {
                "isEncoded": false,
                "isRpc": false,
                "parts": [
                    {
                        "elementName": "GetWeatherInformationResponse",
                        "name": "parameters",
                        "elementNs": "http://ws.cdyne.com/WeatherWS/",
                        "xmlType": "GetWeatherInformationResponse_Type_ncoxk2",
                        "xmlTypeNs": "http://ws.cdyne.com/WeatherWS/"
                    }
                ]
            }
        }
    }
}