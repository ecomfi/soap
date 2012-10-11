exports.service =
{
    "serviceType": "tracker_ServiceType",
    "httpOptions": {
        "hostname": "localhost",
        "port": "8080",
        "path": "/ce-soap50/services/TrackerApp",
        "isHttps": false,
        "method": "POST"
    },
    "types": {
        "{http://schema.open.collab.net/sfee50/soap50/type}SoapFilter": {
            "content": [
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "name"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "value"
                }
            ],
            "ns": "http://schema.open.collab.net/sfee50/soap50/type",
            "nsChecksum": "igchZ0",
            "name": "SoapFilter"
        },
        "{http://schema.open.collab.net/sfee50/soap50/type}Artifact3SoapList": {
            "content": [
                {
                    "ns": "",
                    "xmlTypeNs": "http://schema.open.collab.net/sfee50/soap50/type",
                    "name": "dataRows",
                    "xmlType": "Artifact3SoapRow",
                    "isArray": true
                }
            ],
            "ns": "http://schema.open.collab.net/sfee50/soap50/type",
            "nsChecksum": "igchZ0",
            "name": "Artifact3SoapList"
        },
        "{http://schema.open.collab.net/sfee50/soap50/type}Artifact3SoapRow": {
            "content": [
                {
                    "ns": "",
                    "jsonType": "number",
                    "name": "actualEffort"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "artifactGroup"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "assignedToFullname"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "assignedToUsername"
                },
                {
                    "ns": "",
                    "jsonType": "boolean",
                    "name": "autosumming"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "category"
                },
                {
                    "ns": "",
                    "jsonType": "date",
                    "name": "closeDate"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "customer"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "description"
                },
                {
                    "ns": "",
                    "jsonType": "number",
                    "name": "estimatedEffort"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "folderId"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "folderPathString"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "folderTitle"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "id"
                },
                {
                    "ns": "",
                    "jsonType": "date",
                    "name": "lastModifiedDate"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "planningFolderId"
                },
                {
                    "ns": "",
                    "jsonType": "number",
                    "name": "points"
                },
                {
                    "ns": "",
                    "jsonType": "number",
                    "name": "priority"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "projectId"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "projectPathString"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "projectTitle"
                },
                {
                    "ns": "",
                    "jsonType": "number",
                    "name": "remainingEffort"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "status"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "statusClass"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "submittedByFullname"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "submittedByUsername"
                },
                {
                    "ns": "",
                    "jsonType": "date",
                    "name": "submittedDate"
                },
                {
                    "ns": "",
                    "jsonType": "string",
                    "name": "title"
                },
                {
                    "ns": "",
                    "jsonType": "number",
                    "name": "version"
                }
            ],
            "ns": "http://schema.open.collab.net/sfee50/soap50/type",
            "nsChecksum": "igchZ0",
            "name": "Artifact3SoapRow"
        }
    },
    "operations": {
        "getArtifactList3": {
            "requestDesc": {
                "opName": "getArtifactList3",
                "opNs": "http://schema.open.collab.net/sfee50/soap50/service",
                "isEncoded": true,
                "isRpc": true,
                "soapVersion": "1.1",
                "parts": [
                    {
                        "jsonType": "string",
                        "name": "sessionId"
                    },
                    {
                        "jsonType": "string",
                        "name": "containerId"
                    },
                    {
                        "xmlTypeNs": "http://schema.open.collab.net/sfee50/soap50/type",
                        "xmlType": "SoapFilter",
                        "name": "filters",
                        "isArray": true
                    }
                ]
            },
            "deserializationOptions": {
                "removeEnvelope": true,
                "soapEncoded": true
            },
            "responseDesc": {
                "isEncoded": true,
                "isRpc": true,
                "parts": [
                    {
                        "xmlTypeNs": "http://schema.open.collab.net/sfee50/soap50/type",
                        "xmlType": "Artifact3SoapList",
                        "name": "getArtifactList3Return"
                    }
                ]
            }
        }
    }
}
