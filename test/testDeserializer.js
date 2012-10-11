"use strict";

var deserializer = require('../lib/deserializer');
var assert = require('assert');
var util = require('util');
var testutils = require('./testutils');
var ws = require('./weatherService');
var ts = require('./trackerService');

testutils.makeTypePointers(ws.service);
testutils.makeTypePointers(ts.service);

var xmlResponse =
    '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n' +
        '<soap:Body>\n' +
        '<GetCityForecastByZIPResponse xmlns="http://ws.cdyne.com/WeatherWS/">\n' +
        '<GetCityForecastByZIPResult>\n' +
        '<Success>true</Success>\n' +
        '<ResponseText>City Found</ResponseText>\n' +
        '<State>CA</State>\n' +
        '<City>Oakland</City>\n' +
        '<WeatherStationCity>Oakland</WeatherStationCity>\n' +
        '<ForecastResult>\n' +
        '<Forecast>\n' +
        '<Date>2011-11-08T00:00:00</Date>\n' +
        '<WeatherID>4</WeatherID>\n' +
        '<Desciption>Sunny</Desciption>\n' +
        '<Temperatures>\n' +
        '<MorningLow>47</MorningLow>\n' +
        '<DaytimeHigh>61</DaytimeHigh>\n' +
        '</Temperatures>\n' +
        '<ProbabilityOfPrecipiation>\n' +
        '<Nighttime>00</Nighttime>\n' +
        '<Daytime>10</Daytime>\n' +
        '</ProbabilityOfPrecipiation>\n' +
        '</Forecast>\n' +
        '<Forecast>\n' +
        '<Date>2011-11-09T00:00:00</Date>\n' +
        '<WeatherID>2</WeatherID>\n' +
        '<Desciption>Partly Cloudy</Desciption>\n' +
        '<Temperatures>\n' +
        '<MorningLow>49</MorningLow>\n' +
        '<DaytimeHigh>66</DaytimeHigh>\n' +
        '</Temperatures>\n' +
        '<ProbabilityOfPrecipiation>\n' +
        '<Nighttime>10</Nighttime>\n' +
        '<Daytime>00</Daytime>\n' +
        '</ProbabilityOfPrecipiation>\n' +
        '</Forecast>\n' +
        '<Forecast>\n' +
        '<Date>2011-11-10T00:00:00</Date>\n' +
        '<WeatherID>2</WeatherID>\n' +
        '<Desciption>Partly Cloudy</Desciption>\n' +
        '<Temperatures>\n' +
        '<MorningLow>51</MorningLow>\n' +
        '<DaytimeHigh>67</DaytimeHigh>\n' +
        '</Temperatures>\n' +
        '<ProbabilityOfPrecipiation>\n' +
        '<Nighttime>00</Nighttime>\n' +
        '<Daytime>20</Daytime>\n' +
        '</ProbabilityOfPrecipiation>\n' +
        '</Forecast>\n' +
        '<Forecast>\n' +
        '<Date>2011-11-11T00:00:00</Date>\n' +
        '<WeatherID>6</WeatherID>\n' +
        '<Desciption>Showers</Desciption>\n' +
        '<Temperatures>\n' +
        '<MorningLow>52</MorningLow>\n' +
        '<DaytimeHigh>55</DaytimeHigh>\n' +
        '</Temperatures>\n' +
        '<ProbabilityOfPrecipiation>\n' +
        '<Nighttime>40</Nighttime>\n' +
        '<Daytime>70</Daytime>\n' +
        '</ProbabilityOfPrecipiation>\n' +
        '</Forecast>\n' +
        '<Forecast>\n' +
        '<Date>2011-11-12T00:00:00</Date>\n' +
        '<WeatherID>3</WeatherID>\n' +
        '<Desciption>Mostly Cloudy</Desciption>\n' +
        '<Temperatures>\n' +
        '<MorningLow>51</MorningLow>\n' +
        '<DaytimeHigh>58</DaytimeHigh>\n' +
        '</Temperatures>\n' +
        '<ProbabilityOfPrecipiation>\n' +
        '<Nighttime>70</Nighttime>\n' +
        '<Daytime>30</Daytime>\n' +
        '</ProbabilityOfPrecipiation>\n' +
        '</Forecast>\n' +
        '<Forecast>\n' +
        '<Date>2011-11-13T00:00:00</Date>\n' +
        '<WeatherID>3</WeatherID>\n' +
        '<Desciption>Mostly Cloudy</Desciption>\n' +
        '<Temperatures>\n' +
        '<MorningLow>51</MorningLow>\n' +
        '<DaytimeHigh>59</DaytimeHigh>\n' +
        '</Temperatures>\n' +
        '<ProbabilityOfPrecipiation>\n' +
        '<Nighttime>50</Nighttime>\n' +
        '<Daytime>40</Daytime>\n' +
        '</ProbabilityOfPrecipiation>\n' +
        '</Forecast>\n' +
        '<Forecast>\n' +
        '<Date>2011-11-14T00:00:00</Date>\n' +
        '<WeatherID>2</WeatherID>\n' +
        '<Desciption>Partly Cloudy</Desciption>\n' +
        '<Temperatures>\n' +
        '<MorningLow>47</MorningLow>\n' +
        '<DaytimeHigh>63</DaytimeHigh>\n' +
        '</Temperatures>\n' +
        '<ProbabilityOfPrecipiation>\n' +
        '<Nighttime>20</Nighttime>\n' +
        '<Daytime>20</Daytime>\n' +
        '</ProbabilityOfPrecipiation>\n' +
        '</Forecast>\n' +
        '</ForecastResult>\n' +
        '</GetCityForecastByZIPResult>\n' +
        '</GetCityForecastByZIPResponse>\n' +
        '</soap:Body>\n' +
        '</soap:Envelope>'

var expectedResponse =
{
    GetCityForecastByZIPResult:
    {
        Success: true,
        ResponseText: 'City Found',
        State: 'CA',
        City: 'Oakland',
        WeatherStationCity: 'Oakland',
        ForecastResult:
        {
            Forecast:
                [
                    {
                        Date: 1320710400000,
                        WeatherID: 4,
                        Desciption: 'Sunny',
                        Temperatures: { MorningLow: '47', DaytimeHigh: '61' },
                        ProbabilityOfPrecipiation: { Nighttime: '00', Daytime: '10' }
                    },
                    {
                        Date: 1320796800000,
                        WeatherID: 2,
                        Desciption: 'Partly Cloudy',
                        Temperatures: { MorningLow: '49', DaytimeHigh: '66' },
                        ProbabilityOfPrecipiation: { Nighttime: '10', Daytime: '00' }
                    },
                    {
                        Date: 1320883200000,
                        WeatherID: 2,
                        Desciption: 'Partly Cloudy',
                        Temperatures: { MorningLow: '51', DaytimeHigh: '67' },
                        ProbabilityOfPrecipiation: { Nighttime: '00', Daytime: '20' }
                    },
                    {
                        Date: 1320969600000,
                        WeatherID: 6,
                        Desciption: 'Showers',
                        Temperatures: { MorningLow: '52', DaytimeHigh: '55' },
                        ProbabilityOfPrecipiation: { Nighttime: '40', Daytime: '70' }
                    },
                    {
                        Date: 1321056000000,
                        WeatherID: 3,
                        Desciption: 'Mostly Cloudy',
                        Temperatures: { MorningLow: '51', DaytimeHigh: '58' },
                        ProbabilityOfPrecipiation: { Nighttime: '70', Daytime: '30' }
                    },
                    {
                        Date: 1321142400000,
                        WeatherID: 3,
                        Desciption: 'Mostly Cloudy',
                        Temperatures: { MorningLow: '51', DaytimeHigh: '59' },
                        ProbabilityOfPrecipiation: { Nighttime: '50', Daytime: '40' }
                    },
                    {
                        Date: 1321228800000,
                        WeatherID: 2,
                        Desciption: 'Partly Cloudy',
                        Temperatures: { MorningLow: '47', DaytimeHigh: '63' },
                        ProbabilityOfPrecipiation: { Nighttime: '20', Daytime: '20' }
                    }
                ]
        }
    }
}

var getCityForecastByZIP = ws.service.operations.GetCityForecastByZIP;
deserializer.deserialize(xmlResponse, getCityForecastByZIP.responseDesc, getCityForecastByZIP.deserializationOptions,
    function(err, response) {
        //console.log(util.inspect(response, null, null));
        assert.ok(testutils.areEqual(response, expectedResponse));
    });

xmlResponse =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n' +
        '<soapenv:Body>\n' +
        '<ns1:getArtifactList3Response soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns1="http://schema.open.collab.net/sfee50/soap50/service">\n' +
        '<getArtifactList3Return href="#id0"/>\n' +
        '</ns1:getArtifactList3Response>\n' +
        '<multiRef id="id0" soapenc:root="0" soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xsi:type="ns2:Artifact3SoapList" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns2="http://schema.open.collab.net/sfee50/soap50/type">\n' +
        '<dataRows soapenc:arrayType="ns2:Artifact3SoapRow[2]" xsi:type="soapenc:Array">\n' +
        '<dataRows href="#id1"/>\n' +
        '<dataRows href="#id2"/>\n' +
        '</dataRows>\n' +
        '</multiRef>\n' +
        '<multiRef id="id1" soapenc:root="0" soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xsi:type="ns3:Artifact3SoapRow" xmlns:ns3="http://schema.open.collab.net/sfee50/soap50/type" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n' +
        '<actualEffort xsi:type="xsd:int">0</actualEffort>\n' +
        '<artifactGroup xsi:type="xsd:string"/>\n' +
        '<assignedToFullname xsi:type="xsd:string">Brian Gaffney</assignedToFullname>\n' +
        '<assignedToUsername xsi:type="xsd:string">brianatemotive</assignedToUsername>\n' +
        '<autosumming xsi:type="xsd:boolean">false</autosumming>\n' +
        '<category xsi:type="xsd:string"/>\n' +
        '<closeDate xsi:type="xsd:dateTime" xsi:nil="true"/>\n' +
        '<customer xsi:type="xsd:string"/>\n' +
        '<description xsi:type="xsd:string">Consider C instead</description>\n' +
        '<estimatedEffort xsi:type="xsd:int">50</estimatedEffort>\n' +
        '<folderId xsi:type="xsd:string">tracker1006</folderId>\n' +
        '<folderPathString xsi:type="xsd:string">tracker.stories</folderPathString>\n' +
        '<folderTitle xsi:type="xsd:string">Stories</folderTitle>\n' +
        '<id xsi:type="xsd:string">artf1004</id>\n' +
        '<lastModifiedDate xsi:type="xsd:dateTime">2012-10-02T17:02:43.000Z</lastModifiedDate>\n' +
        '<planningFolderId xsi:type="xsd:string">plan1010</planningFolderId>\n' +
        '<points xsi:type="xsd:int">0</points>\n' +
        '<priority xsi:type="xsd:int">3</priority>\n' +
        '<projectId xsi:type="xsd:string">proj1015</projectId>\n' +
        '<projectPathString xsi:type="xsd:string">projects.emotive</projectPathString>\n' +
        '<projectTitle xsi:type="xsd:string">Emotive</projectTitle>\n' +
        '<remainingEffort xsi:type="xsd:int">2</remainingEffort>\n' +
        '<status xsi:type="xsd:string">Pending</status>\n' +
        '<statusClass xsi:type="xsd:string">Open</statusClass>\n' +
        '<submittedByFullname xsi:type="xsd:string">Brian Gaffney</submittedByFullname>\n' +
        '<submittedByUsername xsi:type="xsd:string">brianatemotive</submittedByUsername>\n' +
        '<submittedDate xsi:type="xsd:dateTime">2012-06-28T17:40:51.000Z</submittedDate>\n' +
        '<title xsi:type="xsd:string">Rewrite in Bliss-32</title>\n' +
        '<version xsi:type="xsd:int">114</version>\n' +
        '</multiRef>\n' +
        '<multiRef id="id2" soapenc:root="0" soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xsi:type="ns4:Artifact3SoapRow" xmlns:ns4="http://schema.open.collab.net/sfee50/soap50/type" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">\n' +
        '<actualEffort xsi:type="xsd:int">1</actualEffort>\n' +
        '<artifactGroup xsi:type="xsd:string"/>\n' +
        '<assignedToFullname xsi:type="xsd:string">Brian Gaffney</assignedToFullname>\n' +
        '<assignedToUsername xsi:type="xsd:string">brianatemotive</assignedToUsername>\n' +
        '<autosumming xsi:type="xsd:boolean">false</autosumming>\n' +
        '<category xsi:type="xsd:string"/>\n' +
        '<closeDate xsi:type="xsd:dateTime" xsi:nil="true"/>\n' +
        '<customer xsi:type="xsd:string"/>\n' +
        '<description xsi:type="xsd:string">May contract this out</description>\n' +
        '<estimatedEffort xsi:type="xsd:int">11</estimatedEffort>\n' +
        '<folderId xsi:type="xsd:string">tracker1006</folderId>\n' +
        '<folderPathString xsi:type="xsd:string">tracker.stories</folderPathString>\n' +
        '<folderTitle xsi:type="xsd:string">Stories</folderTitle>\n' +
        '<id xsi:type="xsd:string">artf1008</id>\n' +
        '<lastModifiedDate xsi:type="xsd:dateTime">2012-10-04T17:39:02.000Z</lastModifiedDate>\n' +
        '<planningFolderId xsi:type="xsd:string">plan1009</planningFolderId>\n' +
        '<points xsi:type="xsd:int">50</points>\n' +
        '<priority xsi:type="xsd:int">3</priority>\n' +
        '<projectId xsi:type="xsd:string">proj1015</projectId>\n' +
        '<projectPathString xsi:type="xsd:string">projects.emotive</projectPathString>\n' +
        '<projectTitle xsi:type="xsd:string">Emotive</projectTitle>\n' +
        '<remainingEffort xsi:type="xsd:int">0</remainingEffort>\n' +
        '<status xsi:type="xsd:string">Pending</status>\n' +
        '<statusClass xsi:type="xsd:string">Open</statusClass>\n' +
        '<submittedByFullname xsi:type="xsd:string">Brian Gaffney</submittedByFullname>\n' +
        '<submittedByUsername xsi:type="xsd:string">brianatemotive</submittedByUsername>\n' +
        '<submittedDate xsi:type="xsd:dateTime">2012-06-28T17:52:41.000Z</submittedDate>\n' +
        '<title xsi:type="xsd:string">Build JQuery Mobile emulator</title>\n' +
        '<version xsi:type="xsd:int">118</version>\n' +
        '</multiRef>\n' +
        '</soapenv:Body>\n' +
        '</soapenv:Envelope>\n';

expectedResponse =
{
    "dataRows": [
        {
            "actualEffort": 0,
            "assignedToFullname": "Brian Gaffney",
            "assignedToUsername": "brianatemotive",
            "autosumming": false,
            "description": "Consider C instead",
            "estimatedEffort": 50,
            "folderId": "tracker1006",
            "folderPathString": "tracker.stories",
            "folderTitle": "Stories",
            "id": "artf1004",
            "lastModifiedDate": 1349197363000,
            "planningFolderId": "plan1010",
            "points": 0,
            "priority": 3,
            "projectId": "proj1015",
            "projectPathString": "projects.emotive",
            "projectTitle": "Emotive",
            "remainingEffort": 2,
            "status": "Pending",
            "statusClass": "Open",
            "submittedByFullname": "Brian Gaffney",
            "submittedByUsername": "brianatemotive",
            "submittedDate": 1340905251000,
            "title": "Rewrite in Bliss-32",
            "version": 114
        },
        {
            "actualEffort": 1,
            "assignedToFullname": "Brian Gaffney",
            "assignedToUsername": "brianatemotive",
            "autosumming": false,
            "description": "May contract this out",
            "estimatedEffort": 11,
            "folderId": "tracker1006",
            "folderPathString": "tracker.stories",
            "folderTitle": "Stories",
            "id": "artf1008",
            "lastModifiedDate": 1349372342000,
            "planningFolderId": "plan1009",
            "points": 50,
            "priority": 3,
            "projectId": "proj1015",
            "projectPathString": "projects.emotive",
            "projectTitle": "Emotive",
            "remainingEffort": 0,
            "status": "Pending",
            "statusClass": "Open",
            "submittedByFullname": "Brian Gaffney",
            "submittedByUsername": "brianatemotive",
            "submittedDate": 1340905961000,
            "title": "Build JQuery Mobile emulator",
            "version": 118
        }
    ]
};



var getArtifactList3 = ts.service.operations.getArtifactList3;
deserializer.deserialize(xmlResponse, getArtifactList3.responseDesc, getArtifactList3.deserializationOptions,
    function(err, response) {
        //console.log(JSON.stringify(response, null, 2));
        assert.ok(testutils.areEqual(response, expectedResponse));
    });
