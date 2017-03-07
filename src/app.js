'use strict';

var apiai = require('apiai');
var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');
var request = require('request');
var JSONbig = require('json-bigint');
var async = require('async');
var log4js = require('log4js');
var fs = require('fs');
var util = require('util');
var http = require('http');

var watson = require('watson-developer-cloud');

var session = require('express-session');
var sql = require('mssql');
var MssqlStore = require('../src/MSSQLSession.js')(session);


var REST_PORT = (process.env.PORT || process.env.port || process.env.OPENSHIFT_NODEJS_PORT || 5000);
var SEVER_IP_ADDR = process.env.OPENSHIFT_NODEJS_IP || process.env.HEROKU_IP ;
var APIAI_ACCESS_TOKEN = "c8021e1a2dac4f85aee8f805a5a920b2"; 
var APIAI_LANG = 'en' ;
var FB_VERIFY_TOKEN = "CAA30DE7-CC67-4CBA-AF93-2B1C5C4C19D4";
var FB_PAGE_ACCESS_TOKEN = "EAAYeV8WAScYBAJ1AriKv64KvZCr3nIudmpZBiPd3VL8j4mu3UYzZCwaSguZCFCEMTmWvunm9MbOGChZBLIyBroPxI951nFZCNP23KzyrzZCNCyfWupZCVdzhrJVeisiCPo3IrdtUsBiEA9m5vZBhPG2yxoCsL4gFTYL2rdBZCVQJ2m0AZDZD";
var APIAI_VERIFY_TOKEN = "verify123";
var apiAiService = apiai(APIAI_ACCESS_TOKEN, {language: APIAI_LANG, requestSource: "fb"});
var sessionIds = new Map();
var userData = new Map();
//==== Session



callSession(strsender,strtext)
{
var http = require('http');
var xml = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:urn=\"urn:botprocessor.webservice.interfaces.ppsh.verizon.com\"> <soapenv:Header/> <soapenv:Body> <urn:getPPSHData> <msg> <![CDATA[ <BotRequest> <id>1807994092745948</id> <time>1485873297960</time> <messaging> <sender> <id>990448381059018</id> </sender> <recipient> <id>1807994092745948</id> </recipient> <timestamp>1485873297889</timestamp> <message> <mid>mid.1485873297889:fb70dae4232</mid> <seq>43351</seq> <text>What's on HBO6</text> </message> </messaging> </BotRequest>]]> </msg> </urn:getPPSHData> </soapenv:Body> </soapenv:Envelope>";

var http_options = {
  hostname: 'ip-10-74-36-199.ebiz.verizon.com',
  port: 7002,
  path: '/ppsh/services/BotProcessor',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': xml.length,
    'SOAPAction': ''
  }
}

var req = http.request(http_options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
 
  res.on('end', () => {
    console.log('No more data in response.')
  })
});
 
req.on('error', (e) => {
  console.log(`problem with request: ${e.message}`);
});
 
// write data to request body
//req.write(xml); // xml would have been set somewhere to a complete xml document in the form of a string
req.end();
return xml;

}

//======================
log4js.configure({
    appenders: 
    [
        { type: 'console' },
        {
            type: 'dateFile', filename: 'D:\\app\\log\\bot\\botws.log', category: 'botws', "pattern": "-yyyy-MM-dd","alwaysIncludePattern": false
        },
        {		
            type: 'logLevelFilter',
            level: 'ERROR', appender: {
                type: "dateFile",
                filename: 'D:\\app\\log\\bot\\boterrors.log',
                category: 'errorlog',"pattern": "-yyyy-MM-dd","alwaysIncludePattern": false
            }
        }
        ,
        {
            type: 'logLevelFilter',
            level: 'debug', appender: {
                type: "dateFile",
                filename: 'D:\\app\\log\\bot\\ChatHistory.log',
                category: 'Debug', "pattern": "-yyyy-MM-dd", "alwaysIncludePattern": false
            }
        }
    ]
});

var logger = log4js.getLogger("botws");
var Errlogger = log4js.getLogger('errorlog');
var ChatHistoryLog = log4js.getLogger('Debug');

function validateCPNI(elementValue)
{
      console.log("checking sensitive data - validateCPNI");	
       var  ssnPattern = /^\(?([A-Za-z ]+)?([0-9]{3})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{4})$/;
       var phonenoPattern = /^\(?([A-Za-z ]+)?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;  
       var CreditcardPattern = /^\(?([A-Za-z ]+)?([0-9]{4})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
	  
	if (ssnPattern.test(elementValue) || phonenoPattern.test(elementValue) || CreditcardPattern.test(elementValue))
	    {
		console.log("ssn:" +ssnPattern.test(elementValue) +" phone:" + phonenoPattern.test(elementValue) +"ccard:"+ CreditcardPattern.test(elementValue));
		console.log('There is a sensitive data');	
		return ('xxxxxxxxx');
	    }
	    else
		console.log('There is NO sensitive data');	
	      return (elementValue);	
	
}


function processEvent(event) {
    var sender = event.sender.id.toString();
    console.log("senderid", sender);
    ChatHistoryLog.log("senderid", sender);
	
    if ((event.message && event.message.text) || (event.postback && event.postback.payload)) 
    {
        var text = event.message ? event.message.text : event.postback.payload;      
        console.log("Before Account Linking ");  
        if (!sessionIds.has(sender))
        {
            console.log("Inside sessionID:- ");
            sessionIds.set(sender, uuid.v1());
        }

	var ReqSenderID = event.sender.id.toString();
        var ReqRecipientID = event.recipient.id.toString();
	 var ReqMessageText = text;  
	    if(event.timestamp)
	    {
		var ReqTimeStamp = event.timestamp.toString();
	    }
	    if(event.message)
	    {
		    if(event.message.mid)
		    {
			var ReqMessageID = event.message.mid.toString();
		    }
	    }
	   
        console.log("Text Value", text);   
        if (event.account_linking) 
        {
            console.log("event account_linking content :- " + JSON.stringify(event.account_linking));
            console.log("Account Linking null - 1");
            if (event.account_linking == undefined) {
                console.log("Account Linking null - 2");
            }
            else if (event.account_linking.status == "linked") {
                console.log("Account Linking convert: " + JSON.stringify(event.account_linking.authorization_code, null, 2));
                console.log("Account Linking convert: " + JSON.stringify(event.account_linking.status, null, 2));
                var authCode = event.account_linking.authorization_code;
                //delete event.account_linking;
                getVzProfile(authCode, function (str) { getVzProfileCallBack(str, event) });
                MainMenu(sender);
                
            } else if (event.account_linking.status == "unlinked") {
                //Place holder code to unlink.
            }
        }
	
var conversation = watson.conversation({
    username: '5ce24ee5-4326-4056-9df1-519fcb0af445',
    password: 'h033JHyAbXph',
    version: 'v1',
    version_date: '2017-02-03'
});   
	//var masktext=validateCPNI(text); //mask sensitive data
	
 
 convMess(text);
	    
 function convMess(message) {
 var actualmessage=message;

	var InputText =validateCPNI(message);
	var sessionoutputxml =callSession(sender,text);
	 console.log('sessionoutputxml   : '+ JSONbig.stringify(sessionoutputxml))
	 /*
	 if(Inputtext !='xxxxxxxxx')
	 {	console.log('There is NO sensitive data');	
		Inputtext= actualmessage;
	 }
	 */
	console.log('In CPNII InputText  : ' + JSONbig.stringify(InputText)); 
	 
    conversation.message({
        workspace_id: 'fd85881c-2303-497d-835a-b83548ad8cea',
        input: { 'text': InputText }, 
	alternate_intents: false
    }, function (err, response) {
        if (err) {
            console.log('Watson error in CONVMess'+ err);
        }
        else {
            console.log('I got a response. Let me check');
		console.log('Watson response:' + JSONbig.stringify(response));
            if (response != '') {
                console.log('Watson response Text:' + response.output.text[0]);	             
		console.log('Watson response:' + JSONbig.stringify(response));
		    
		     
		    var strIntent ='';
		    if (response.intents!='')
		    	strIntent=response.intents[0].intent;
		    else
			    strIntent='';
		    
		   // var strIntent ="MoreOptions";
		     var responseText = response.output.text[0];
		    console.log('strIntent:' + JSONbig.stringify(strIntent));
		  //  var fallback = response.nodes_visited["fallback intent"];
		   //console.log('strIntent:' + JSONbig.stringify(fallback));							  
		    if(strIntent == '')
		    {
			   strIntent ="Default";
		    }
                    console.log("Selected_Intent : "+ strIntent);
                    // Methods to be called based on action 
                    switch (strIntent) 
                    {
                        case "getStarted":
                            console.log("----->>>>>>>>>>>> INSIDE getStarted <<<<<<<<<<<------");
                            welcomeMsg(sender);  
                            break;
                        case "LinkOptions":
                            console.log("----->>>>>>>>>>>> INSIDE LinkOptions <<<<<<<<<<<------");
                            accountlinking(response,sender);
                            break;
                        case "MoreOptions":
                            console.log("----->>>>>>>>>>>> INSIDE MoreOptions <<<<<<<<<<<------");
                            sendFBMessage(sender,  {text: responseText});
                            break;
                        case "MainMenu":
                            console.log("----->>>>>>>>>>>> INSIDE MainMenu <<<<<<<<<<<------");
                            MainMenu(sender);
                            break;
                        case "record":
                            console.log("----->>>>>>>>>>>> INSIDE recordnew <<<<<<<<<<<------");	    
                            RecordScenario (response,sender,sender); 
                            break;  
                        case "CategoryList":
                            console.log("----->>>>>>>>>>>> INSIDE CategoryList <<<<<<<<<<<------");
                            CategoryList(response,sender);
                            break;
                        case "recommendation":
                            console.log("----->>>>>>>>>>>> INSIDE recommendation <<<<<<<<<<<------");
                            recommendations(response,'OnLater',function (str) {recommendationsCallback(str,sender)}); 
                            break;
                        case "OnNowrecommendation":
                            console.log("----->>>>>>>>>>>> INSIDE OnNowrecommendation <<<<<<<<<<<------");
                            recommendations(response,'OnNow',function (str) {recommendationsCallback(str,sender)}); 
                            break;
                        case "channelsearch":
                            console.log("----->>>>>>>>>>>> INSIDE channelsearch <<<<<<<<<<<------");
                            //ChnlSearch(response,function (str){ ChnlSearchCallback(str,sender)}); 
				    stationsearch(response,function (str){ stationsearchCallback(str,sender)}); 
                            break;
			case "TeamSearch":
			case "GenreSearch":
			case "castwise":
			case "PgmDetails":
                        case "programSearch":
                            console.log("----->>>>>>>>>>>> INSIDE programSearch <<<<<<<<<<<------");
                            PgmSearch(response,sender,function (str){ PgmSearchCallback(str,sender)});
                            break;
                        case "support":
                            console.log("----->>>>>>>>>>>> INSIDE support <<<<<<<<<<<------");
                            support(sender);
                            break;
                        case "upgradeDVR":
                            console.log("----->>>>>>>>>>>> INSIDE upgradeDVR <<<<<<<<<<<------");
                            upgradeDVR(response,sender);
                            break;
                        case "upsell":
                            console.log("----->>>>>>>>>>>> INSIDE upsell <<<<<<<<<<<------");
                            upsell(response,sender);
                            break;
                        case "Billing":
			case "BillInfo":
                            console.log("----->>>>>>>>>>>> INSIDE Billing <<<<<<<<<<<------");
                          //  stationsearch(sender);
                            //  userCoversationArr.ufdreqdatetime = getDateTime();
                                showBillInfo(response, sender,  function (str) { showBillInfoCallback(str, sender) });
                                break;
		        case "cancelappointmentnotconfirmed":
                            console.log("----->>>>>>>>>>>> INSIDE cancelappointment <<<<<<<<<<<------");
                            cancelscheduledticket(response,sender,function (str){cancelscheduledticketCallBack(str,sender)});
                            break;
		        case "Rescheduleticket":
                            console.log("----->>>>>>>>>>>> INSIDE Rescheduleticket <<<<<<<<<<<------");
                            Rescheduleticket(response,sender,function (str){RescheduleticketCallback(str,sender)});
                            break;
			case "showopentickets":
                            console.log("----->>>>>>>>>>>> INSIDE showopentickets <<<<<<<<<<<------");
                            showopentickets(response,sender,function (str){showopenticketsCallback(str,sender)});
                            break;
			case "showOutagetickets":
                            console.log("----->>>>>>>>>>>> INSIDE showOutagetickets <<<<<<<<<<<------");
                            showOutagetickets(response,sender,function (str){showOutageticketsCallback(str,sender)});
                            break;				    
                        case "Default":
                            console.log("----->>>>>>>>>>>> INSIDE default <<<<<<<<<<<------");
				responseText="Hey .....I am here to help you on Verizon Services";    
			      sendFBMessage(sender,  {text: responseText});
			 case "greetings":
                            console.log("----->>>>>>>>>>>> INSIDE greetings <<<<<<<<<<<------");				   
                            //sendFBMessage(sender,  {text: responseText});	    
			  welcomeMsg(sender);   
				    case "pkgSearch":
                                logger.debug("----->>>>>>>>>>>> INSIDE Package search <<<<<<<<<<<------");                         
				var strChannelName = getEntity(response.entities,"Channel");;
                                var strGenre =getEntity(response.entities,"ChannelGenre");;
				     
                                logger.debug(" Channel Name " + strChannelName);
                                logger.debug(" Genre " + strGenre);
                                logger.debug(" Sender ID " + sender);
                                var ChnArr = { channalName: strChannelName, senderParam: sender, regionParam: "", vhoidParam: "", cktidParam: "", Genre: strGenre };
                             
                                packageChannelSearch(sender, ChnArr,  function (str) { packageChannelSearchCallback(str, ChnArr) });
                                break;
                    }		  
            }
        }
    });
}    
     
    }
}
function splitResponse(str) {
    if (str.length <= 320) {
        return [str];
    }

    return chunkString(str, 300);
}

function chunkString(s, len) {
    var curr = len, prev = 0;

    var output = [];

    while (s[curr]) {
        if (s[curr++] == ' ') {
            output.push(s.substring(prev, curr));
            prev = curr;
            curr += len;
        }
        else {
            var currReverse = curr;
            do {
                if (s.substring(currReverse - 1, currReverse) == ' ') {
                    output.push(s.substring(prev, currReverse));
                    prev = currReverse;
                    curr = currReverse + len;
                    break;
                }
                currReverse--;
            } while (currReverse > prev)
        }
    }
    output.push(s.substr(prev));
    return output;
}
	
	
	
function validateCPNI(elementValue)
{
      console.log("checking sensitive data");
       var  ssnPattern = /^\(?([A-Za-z ]+)?([0-9]{3})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{4})$/;
       var phonenoPattern = /^\(?([A-Za-z ]+)?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;  
       var CreditcardPattern = /^\(?([A-Za-z ]+)?([0-9]{4})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
	  
	if (ssnPattern.test(elementValue) || phonenoPattern.test(elementValue) || CreditcardPattern.test(elementValue))
	    {
		console.log("ssn:" +ssnPattern.test(elementValue) +" phone:" + phonenoPattern.test(elementValue) +"ccard:"+ CreditcardPattern.test(elementValue));
		return 'xxxxxxxxx';
	    }
	    else
	      return elementValue;
}
	
	
function Encrypt( actualstr)
{
    var actual = actualstr;
    var key = 256; //Any integer value
    var result = "";
    for(i=0; i<actual.length;i++)
    {
        result += String.fromCharCode(key^actual.charCodeAt(i));
    }
    alert(result);
}

function Decrypt( actualstr)
{
    var actual=actualstr;
    var key = 256; //Any integer value
    var result="";    
    for(i=0; i<actual.length; i++)
    {
        result += String.fromCharCode(key^actual.charCodeAt(i));
    }
}
function sendFBMessage(sender, messageData, callback) {
	
     console.log('sendFBMessage: sender '+ sender + "messageData  " + messageData);
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: FB_PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData	 
        }
    }, function(error, response, body)  {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }

        if (callback) {
            callback();
        }
    });
	   console.log('sendFBMessage - ResSenderID :' + sender);   

}

function sendFBSenderAction(sender, action, callback) {
    setTimeout(function() {
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: FB_PAGE_ACCESS_TOKEN},
            method: 'POST',
            json: {
                recipient: {id: sender},
                sender_action: action
            }
        }, function (error, response, body)  {
            if (error) {
                console.log('Error sending action: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
            if (callback) {
                callback();
            }
        });
    }, 1000);
}

function doSubscribeRequest() {
    request({
        method: 'POST',
        uri: "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=" + FB_PAGE_ACCESS_TOKEN
    },
        function(error, response, body)  {
            if (error) {
                console.error('Error while subscription: ', error);
            } else {
                console.log('Subscription result: ', response.body);
            }
        });
}

function isDefined(obj) {
    if (typeof obj == 'undefined') {
        return false;
    }

    if (!obj) {
        return false;
    }

    return obj != null;
}

var app = express();

app.use(bodyParser.text({type: 'application/json'}));

app.get('/webhook/', function (req, res)  {
    if (req.query['hub.verify_token'] == FB_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge']);
        setTimeout(function()  {
            doSubscribeRequest();
        }, 3000);
    } else {
        res.send('Error, wrong validation token');
    }
});

app.get('/apiaiwebhook/', function (req, res)  {
    if (req.headers['apiai_verify_token'] == APIAI_VERIFY_TOKEN) {
        return res.status(200).json({
            status: "ok"
        });
    } else {
        res.send('Error, wrong validation token');
    }
});

app.post('/apiaiwebhook/', function (req, res)  {
    try {
        console.log ("here1");
        var data = JSONbig.parse(req.body);
        var actualFBMessage={"attachment":{"type":"template","payload":{"template_type":"generic","elements":[
		{"title":"Login to Verizon","image_url":"https://ss7.vzw.com/is/image/VerizonWireless/vzw-logo-156-130-c?$pngalpha$&wid=156&hei=30","buttons":[
		{"type":"account_link","url":"https://www98.verizon.com/foryourhome/myaccount/ngen/upr/bots/preauth.aspx"}]}]}}};        
        var datResponse={"speech":"Sign in ","data":{"facebook": actualFBMessage},"contextOut":[{"name":"signin", "lifespan":2, "parameters":{"type":"signin"}}],"source":"apiaiwebhook"};
        console.log ("here"+JSONbig.stringify(datResponse));  
        res.send(datResponse);
        /*return res.status(200).json({
        status: "ok"
        });*/
    } catch (err) {
        return res.status(400).json({
            status: "error",
            error: err
        });
    }
});



app.post('/webhook/', function (req, res)  {
    try {
        var data = JSONbig.parse(req.body);
        console.log("ResBodyMessage" + req.body);
        if (data.entry) {
            var entries = data.entry;				
            entries.forEach(function (entry)  {
		    		
                var messaging_events = entry.messaging;
                if (messaging_events) {
                    messaging_events.forEach(function (event)  {
			     if (event.sender)
				{
				  var SenderID = event.sender.id;
				 }
			    if (event.recipient) 
			    {
				    var RecipientID = event.recipient.id;
				  
			    } 		
			     if (event.message) 
				 {
					  var TimeStamp = event.timestamp;
					  var MessageID = event.message.mid;
					  var MessageText = event.message.text;
console.log("API||" + JSON.stringify(SenderID) + "||" + JSON.stringify(RecipientID) +"||"+ JSON.stringify(TimeStamp) +
	    "||" + JSON.stringify(MessageID) + "|| " + JSON.stringify(MessageText)+ "|| Undefined || Undefined ||" + JSON.stringify(data));

                       		 } 
                        if (event.message && !event.message.is_echo ||
                            event.postback && event.postback.payload) {	
                            processEvent(event);
				
                        }
                    });
                }
            });
        }

        return res.status(200).json({
            status: "ok"
        });
    } catch (err) {
        return res.status(400).json({
            status: "error",
            error: err
        });
    }

});

app.listen(REST_PORT,SEVER_IP_ADDR, function()  {
    console.log('Rest service ready on port ' + REST_PORT);
});

doSubscribeRequest();
	
//=========================================
// function calls
function getvzUserID(authCode, apireq, senderid) {
    // Using Authcode pull the user ID from DB.
    var strAuth = userData.get("authcode");

    var args = {
        json: {
            Request: {
                op: "GETFBACCOUNTLINKDETAILS",              
                Authcode: strAuth               
            }
        }       
    }
    console.log('args ' + JSON.stringify(args));
    request({
        url: 'https://www.verizon.com/fiostv/myservices/admin/botapinew.ashx',
        proxy: '',
        headers: headersInfo,
        method: 'POST',
        json: args.json
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            console.log("body " + body);
            callback(body);
        }
        else
            console.log('error: ' + error + ' body: ' + body);
    });
}


function getvzUserIDCallback(apiresp, senderid) {

    // Using Authcode pull the user ID from DB.
    var objToJson = {};
    objToJson = apiresp;  

    var UD_UserID = objToJson.oDSAccountDetails.oDAAccountDetails.strUserID;
    userData.set("UD_UserID", UD_UserID.replace(/\"/g, ""));
    console.log("UserID:" + JSON.stringify(UD_UserID))
    console.log("UserID:" + UD_UserID)
    
    getVzProfileAccountUpdate(UD_UserID, function (str) { getVzProfileAccountUpdateCallBack(str, senderid) });
  
   
} 

function getVzProfileAccountUpdate(struserid, callback) {
    console.log('Inside getVzProfileAccountUpdate Profile');
       
    if (struserid == '' || struserid == undefined) struserid = 'lt6sth2'; //hardcoding if its empty
    console.log('struserid ' + struserid);

    var headersInfo = { "Content-Type": "application/json" };
    var args = {
        json: {
            Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
            Request: { ThisValue: 'GetProfile', Userid: struserid }
        }

    };
    console.log('args ' + JSON.stringify(args));

    request({
        url: config.rest_api,
        proxy: config.vz_proxy,
        headers: headersInfo,
        method: 'POST',
        json: args.json
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            console.log("body " + body);
            callback(body);
        }
        else
            console.log('error: ' + error + ' body: ' + body);
    });
}

function getVzProfileAccountUpdateCallBack(apiresp,senderid) {
    console.log('Inside getVzProfileAccountUpdateCallBack');
    try {
        var strUserid = userData.get("UD_UserID");
        var strAuth1 = userData.get("authcode");
        var objToJson = {};
        objToJson = apiresp;
        var profileDetails = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
        console.log('Profile Details ' + JSON.stringify(profileDetails));
        var CKTID_1 = JSON.stringify(profileDetails.ProfileResponse.CKTID, null, 2)
        var regionId = JSON.stringify(profileDetails.ProfileResponse.regionId, null, 2)
        var vhoId = JSON.stringify(profileDetails.ProfileResponse.vhoId, null, 2)
        var CanNo = JSON.stringify(profileDetails.ProfileResponse.Can, null, 2)
        var VisionCustId = JSON.stringify(profileDetails.ProfileResponse.VisionCustId, null, 2)
        var VisionAcctId = JSON.stringify(profileDetails.ProfileResponse.VisionAcctId, null, 2)
        
        var args = {
            json: {
                Request: {
                    op: "FBACCOUNTLINKACTIVITY",               
                    VHOID: vhoId,
                    RegionID: regionId,
                    CircuitID: CKTID_1,
                    SenderID: senderid,
                    UserID: strUserid,
                    Authcode: strAuth1
                }
            }       
        }
        console.log('args FBACCOUNTLINKACTIVITY' + JSON.stringify(args));

        request({
            url: 'https://www.verizon.com/fiostv/myservices/admin/botapinew.ashx',
            proxy: '',
            headers: headersInfo,
            method: 'POST',
            json: args.json
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {

                console.log("body " + body);
                callback(body);
            }
            else
                console.log('error: ' + error + ' body: ' + body);
        });
    }
    catch (err) {
        console.error(err);
      
    }
}

function getVzProfile(apireq,callback) { 
    console.log('Inside Verizon Profile');
	
    var struserid = ''; 
    
    if (struserid == '' || struserid == undefined) struserid='lt6sth2'; //hardcoding if its empty
    console.log('struserid '+ struserid);
        
    var headersInfo = { "Content-Type": "application/json" };
    var args = {"headers":headersInfo,"json":{Flow:'TroubleShooting Flows\\Test\\APIChatBot.xml',Request:{ThisValue:'GetProfile',Userid:struserid}}};
    console.log('args ' + JSON.stringify(args));
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                console.log('body ' + JSON.stringify(body));
                callback(body);
            }
            else
                console.log('error: ' + error + ' body: ' + body);
        }
    );
} 
	
	function showBillInfo(apireq, sender, callback)	{
		logger.debug("showBillInfo Called");
 		var headersInfo = {"Content-Type": "application/json"};
	     var args = {
	    		"headers":headersInfo,"json":
		{
			Flow:'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
			Request:{
				ThisValue:'BillInfo',
				 BotProviderId:sender
				}
		}    		};	    
    
        logger.debug(" Request for showBillInfo json " + JSON.stringify(args));
	  request.post(" https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {	 
            if (!error && response.statusCode == 200) {             
                console.log("body " + JSON.stringify(body));
                callback(body);
            }	    
            else
                console.log('error: ' + error + ' body: ' + body);
        }
    );       
   
     console.log("showBillInfo completed");
}

function showBillInfoCallback(apiresp, senderid) {
    var objToJson = {};
    objToJson = apiresp;
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;

    logger.debug("Response from showBillInfoCallback=" + JSON.stringify(subflow));

    if (subflow != null
        && subflow.facebook != null
        && subflow.facebook.text != null && subflow.facebook.text == 'UserNotFound') {
        console.log("showBillInfo subflow " + subflow.facebook.text);
        var respobj = {
            "facebook": {
                "attachment": {
                    "type": "template", "payload": {
                        "template_type": "generic", "elements": [
                            {
                                //"title": "You have to Login to Verizon to proceed", "image_url": config.vzImage, "buttons": [
                                "title": " Sorry, but we have to make sure you are you. Login to your Verizon account to continue!", "image_url": config.vzImage, "buttons": [
                                    { "type": "account_link", "url": config.AccountLink },
                                    { "type": "postback", "title": "Maybe later", "payload": "Main Menu" }
                                ]
                            }]
                    }
                }
            }
        };

        sendFBMessage(senderid, respobj.facebook);
    }
    else {
        sendFBMessage(senderid, subflow.facebook);
    }
}
//==================
	
function packageChannelSearch(senderid, ChnArr, callback) {

    logger.debug("Package Channel Search Called");
    try {
     console.log('ChnArr' +JSONbig.stringify(ChnArr));
	var channe_Name = getEntity(ChnArr.entities,"channalName");
        var senderid = getEntity(ChnArr.entities,"senderParam");	   
        var genre = getEntity(ChnArr.entities,"Genre"); 

        logger.debug(" Sender ID " + senderid);
        logger.debug(" Channel Name " + channe_Name);
        logger.debug(" Genre " + genre);
	var headersInfo = {"Content-Type": "application/json"};
        var args = {};

        if (genre == "" || genre == undefined) {
            args = {		  
                json: {
                   Flow:'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
                    Request: {
                        'ThisValue': 'AuthPKGSearch',
                        'BotCircuitID': '',
                        'BotstrStationCallSign': channe_Name,
                        'BotChannelNo': '',
                        'BotVhoId': '',
                        'BotstrFIOSRegionID': '',
                        'BotProviderId' : senderid
                    }
                }

            };
        }
        else {
            args = {		     
                json: {
                  Flow:'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
                    Request: {
                        'ThisValue': 'AuthPKGSearch',
                        'BotCircuitID': '',
                        'BotstrGenreRootId': genre,
                        'BotChannelNo': '',
                        'BotVhoId': '',
                        'BotstrFIOSRegionID': '',
                        'BotProviderId' : senderid
                    }
                }

            };

        }
        logger.debug(" Request for package search json " + JSON.stringify(args));

        request({
            url: "https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx",          
            headers: headersInfo,
            method: 'POST',
            json: args.json
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                callback(body);
            }
            else
            {               
                logger.debug(' error on callback for package search : ' + error + ' body: ' + JSON.stringify(body));
            }
        });
    }
    catch (experr) {
        logger.debug('error on  package search : ' + experr);       
    }
    logger.debug("Package Channel Search completed");
}

function packageChannelSearchCallback(apiresp, ChnArr) {

    logger.debug("packageChannelSearchCallback called");

    var senderid = ChnArr.senderParam;
    var channe_Name = ChnArr.channalName;
    var Genre = ChnArr.Genre;
    var returntext;

    try {

        var objToJson = {};
        objToJson = apiresp;

        var respobj = objToJson[0].Inputs.newTemp.Section.Inputs.Response;

        logger.debug(" Package Search Response " + JSON.stringify(respobj));

        if (respobj != null && respobj.facebook != null && respobj.facebook.attachment != null) {

            //console.log("less than 10 channels ");

            //fix to single element array 
            if (respobj != null
                && respobj.facebook != null
                && respobj.facebook.attachment != null
                && respobj.facebook.attachment.payload != null
                && respobj.facebook.attachment.payload.elements != null) {
                try {
                    var chanls = respobj.facebook.attachment.payload.elements;
                    //console.log(" Is array? " + util.isArray(chanls))
                    if (!util.isArray(chanls)) {
                        respobj.facebook.attachment.payload.elements = [];
                        respobj.facebook.attachment.payload.elements.push(chanls);
                        logger.debug(" Package Search CallBack = After =" + JSON.stringify(respobj));
                    }
                } catch (err) { logger.debug("Error on channel not available on PKG Search " + err); }
            }

            if (Genre == "" || Genre == undefined) {
                if (channe_Name == "" || channe_Name == undefined) {
                    //returntext = "Your package does include following channels!! Watch it on the channels below!";
                    returntext = "Here are some awesome listings included in your package!";
                }
                else {
                    returntext = "Good News! Your package does include " + channe_Name + "! Watch it on the channels below!";
                }
            }
            else {
                // returntext = "That's right, following " + Genre + " channel(s) are part of your package:";
                //returntext = "Your package does include "+ Genre + "! Watch it on the channels below!";
                returntext = "Here are the " + Genre + " listings that are on today ! And the good news is� they're are all a part of your package. Enjoy!"
            }
            sendFBMessage(senderid, { text: returntext }, userCoversationArr);
            sendFBMessage(senderid, respobj.facebook, userCoversationArr);
        }
        else {
            logger.debug("Sorry i dont find channel details");
            if (Genre == "" || Genre == undefined) {
                if (channe_Name == "" || channe_Name == undefined) {
                    //returntext = "Sorry we don't find any channels in your package. Can you try another";
                    //returntext = "I can't find any channels right now. Can you try a different channel?";
                    returntext = "Can you do me a favor and search for something else? I am having trouble finding what you are looking for.";
                }
                else {
                    //returntext = "Sorry " + channe_Name + " is not part for your package. Can you try another.";
                    //returntext = "Sorry your package does not include "+ channe_Name + ". Can you try another.";
                    //returntext = "I can't find " + channe_Name + ", right now. Can you try a different channel?";
                    returntext = "My bad, but I am having trouble finding what you are looking for. Can you try searching for something else?";
                }
            }
            else {
                //returntext = "Sorry following " + Genre + " is not part for your package. Can you try another.";
                //returntext = "Sorry your package does not include "+ Genre + ". Can you try another.";
                //returntext = "I can't find " + Genre + ", right now. Can you try a different genre?";
                returntext = "My bad, but I am having trouble finding what you are looking for. Can you try searching for something else?";
            }
            sendFBMessage(senderid, { text: returntext }, userCoversationArr);
        }
    }
    catch (err) {
        logger.debug(" Catch Error on pkg search call back " + err);
        var senderid = ChnArr.senderParam;
        //var channe_Name = ChnArr.channalName;
        //var returntext = "I can't find any channels right now. Can you try a different channel?";
        var returntext = "Can you do me a favor and search for something else? I am having trouble finding what you are looking for.";
        sendFBMessage(senderid, { text: returntext }, userCoversationArr);
    }

    logger.debug("packageChannelSearchCallback completed");
}

//=====================showOutage
	function showOutagetickets(apireq,sender,callback) { 
    console.log('inside showOutagetickets call ');  
    var headersInfo = {"Content-Type": "application/json"};
    var args = {
	    		"headers":headersInfo,"json":
		{
			Flow:'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
			Request:{
				ThisValue:'showOutage',
				 BotProviderId:sender
				}
		}    		};

   // var args = {"json":{Flow:'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',Request:{ThisValue: 'showOutage',BotProviderId :sender}}};	
  
console.log("args=" + JSON.stringify(args));
    request.post(" https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {	 
            if (!error && response.statusCode == 200) {             
                console.log("body " + JSON.stringify(body));
                callback(body);
            }	    
            else
                console.log('error: ' + error + ' body: ' + body);
        }
    );
} 
  
function showOutageticketsCallback(apiresp,usersession) 
	{	
console.log('Inside showOutageCallback');
    var objToJson = {};
    objToJson = apiresp;
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response; 
    console.log("showOutagetickets=" + JSON.stringify(subflow));
		
    //fix to single element array 
   if (subflow != null 
         && subflow.facebook != null 
         && subflow.facebook.attachment != null 
         && subflow.facebook.attachment.payload != null 
         && subflow.facebook.attachment.payload.buttons != null) {
        try {
            var pgms = subflow.facebook.attachment.payload.buttons;
            console.log ("Is array? "+ util.isArray(pgms))
            if (!util.isArray(pgms))
            {
                subflow.facebook.attachment.payload.buttons = [];
                subflow.facebook.attachment.payload.buttons.push(pgms);
                console.log("showopentickets=After=" + JSON.stringify(subflow));
            }
        }catch (err) { console.log(err); }
    } 
	 console.log("showOutageticketsCallBack=" + JSON.stringify(subflow));	
	if (subflow != null 
        && subflow.facebook != null 
        && subflow.facebook.text != null && subflow.facebook.text =='UserNotFound')
	{
		console.log ("showOutageticketsCallBack subflow "+ subflow.facebook.text);
		var respobj ={"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[
		{"title":"You have to Login to Verizon to proceed","image_url":"https://www98.verizon.com/foryourhome/vzrepair/siwizard/img/verizon-logo-200.png","buttons":[
			{"type":"account_link","url":"https://www98.verizon.com/vzssobot/upr/preauth"}]}]}}}};		
		sendFBMessage(usersession,  respobj.facebook);
	}
	else
	{	
         sendFBMessage(usersession,  subflow.facebook);
	}
} 

//====================================
//=====================showopentickets
	function showopentickets(apireq,sender,callback) { 
    console.log('inside showopentickets call ');
	
    var headersInfo = { "Content-Type": "application/json" };
    var args = {
        "headers": headersInfo,
        "json": {Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
            Request: {ThisValue: 'ShowOpenTicket',
		       BotProviderId :sender} 
        }		
    };	
    //var args = {"json": {Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',Request: {ThisValue: 'ShowOpenTicket',BotProviderId :sender}}};
		
console.log("args=" + JSON.stringify(args));
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("body " + body);
                callback(body);
            }
            else
                console.log('error: ' + error + ' body: ' + body);
        }
    );
} 
  
function showopenticketsCallback(apiresp,usersession) 
	{	
console.log('Inside showopenticketsCallback');
    var objToJson = {};
    objToJson = apiresp;
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response; 
	console.log("showopentickets=" + JSON.stringify(subflow));
    //fix to single element array 
    if (subflow != null 
         && subflow.facebook != null 
         && subflow.facebook.attachment != null 
         && subflow.facebook.attachment.payload != null 
         && subflow.facebook.attachment.payload.buttons != null) {
        try {
            var pgms = subflow.facebook.attachment.payload.buttons;
            console.log ("Is array? "+ util.isArray(pgms))
            if (!util.isArray(pgms))
            {
                subflow.facebook.attachment.payload.buttons = [];
                subflow.facebook.attachment.payload.buttons.push(pgms);
                console.log("showopentickets=After=" + JSON.stringify(subflow));
            }
        }catch (err) { console.log(err); }
    } 
	 console.log("showopenticketsCallBack=" + JSON.stringify(subflow));	
	if (subflow != null 
        && subflow.facebook != null 
        && subflow.facebook.text != null && subflow.facebook.text =='UserNotFound')
	{
		console.log ("showopenticketsCallBack subflow "+ subflow.facebook.text);
		var respobj ={"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[
		{"title":"You have to Login to Verizon to proceed","image_url":"https://www98.verizon.com/foryourhome/vzrepair/siwizard/img/verizon-logo-200.png","buttons":[
			{"type":"account_link","url":"https://www98.verizon.com/vzssobot/upr/preauth"}]}]}}}};		
		sendFBMessage(usersession,  respobj.facebook);
	}
	else
	{	
         sendFBMessage(usersession,  subflow.facebook);
	}
   
   
} 

//====================================
	
//******************** cancelscheduledticket
	function cancelscheduledticket(apireq,sender,callback) { 
    console.log('inside cancelscheduledticket call '+ JSON.stringify(apireq.contexts));
   var strCancelTicketNumber =  apireq.result.parameters.CancelTicketNumber;
   var strTCStateCode =  apireq.result.parameters.TktRegion;
		//var strCancelTicketNumber='MAEH08TQAS';
		//var strTCStateCode='MA';
		console.log(' strCancelTicketNumber '+ JSON.stringify(strCancelTicketNumber));
		console.log(' cancelscheduledticket '+ JSON.stringify(strTCStateCode));
    var struserid = ''; 
		
    for (var i = 0, len = apireq.result.contexts.length; i < len; i++) {
        if (apireq.result.contexts[i].name == "sessionuserid") {

            struserid = apireq.result.contexts[i].parameters.Userid;
            console.log("original userid " + ": " + struserid);
        }
    } 
	
    if (struserid == '' || struserid == undefined) struserid='lt6sth2'; //hardcoding if its empty
	
    console.log('struserid '+ struserid);
    var headersInfo = { "Content-Type": "application/json" };
    var args = {
        "headers": headersInfo,
        "json": {Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
            Request: {ThisValue: 'CancelTicket',
		       BotProviderId :sender, 
		       CancelTicketNumber:strCancelTicketNumber,
		       BotTCStateCode:strTCStateCode,
		       Platform:'Web'} 
        }		
    };
console.log("args=" + JSON.stringify(args));
	 var strConfirmation =apireq.result.parameters.Tktcancelconfirmation;
		 var isconfirm ='';
                    console.log("Selected_strConfirmation : "+ strConfirmation);
		    console.log("Selected_isconfirm : "+ isconfirm);       
                     if(strConfirmation == null || strConfirmation == undefined || strConfirmation =='' )
		     {
			     console.log("inside IF");
	  	 var respobj ={"facebook":{"attachment":{"type":"template","payload":
                      {"template_type":"button","text":"Are you sure to cancel this appointment ?","buttons":[
		       {"type":"postback","title":"Cancel","payload":"Main Menu"},
			{"type":"postback","title":"Confirm","payload":"Want to cancel "+ strCancelTicketNumber+ " statecode "+strTCStateCode+ " cancel status canConfirmed"}
			]}}}};
			     
			   
			 console.log(JSON.stringify(respobj));
                         sendFBMessage(sender, respobj.facebook);				 
		     }
		else
			if(strConfirmation == 'canConfirmed')
		{	  
				       request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
					function (error, response, body)
					{
					    if (!error && response.statusCode == 200) 
					    {             
						console.log("AFter ASHX call" + JSON.stringify(body));
						console.log("RESPONSE" + JSON.stringify(response));
						callback(body);
					    }
					    else
						console.log('error: ' + error + ' body: ' + JSON.stringify(body));
					       console.log("ELSE RESPONSE" + JSON.stringify(response));
					});
		}
} 
  
function cancelscheduledticketCallBack(apiresp,usersession) {
    var objToJson = {};
    objToJson = apiresp;
	console.log("APIRESP===" + JSON.stringify(objToJson));
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response; 
	console.log("Canceltickets=" + JSON.stringify(subflow));
    //fix to single element array 
    if (subflow != null 
         && subflow.facebook != null 
         && subflow.facebook.attachment != null 
         && subflow.facebook.attachment.payload != null 
         && subflow.facebook.attachment.payload.buttons != null) {
        try {
            var pgms = subflow.facebook.attachment.payload.buttons;
            console.log ("Is array? "+ util.isArray(pgms))
            if (!util.isArray(pgms))
            {
                subflow.facebook.attachment.payload.buttons = [];
                subflow.facebook.attachment.payload.buttons.push(pgms);
                console.log("CancelopenticketsCallBack=After=" + JSON.stringify(subflow));
            }
        }catch (err) { console.log(err); }
    } 
    console.log("cancelscheduledticketCallBack=" + JSON.stringify(subflow));
	
	if (subflow != null 
        && subflow.facebook != null 
        && subflow.facebook.text != null && subflow.facebook.text =='UserNotFound')
	{
		console.log ("cancelscheduledticketCallBack subflow "+ subflow.facebook.text);
		var respobj ={"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[
		{"title":"You have to Login to Verizon to proceed","image_url":"https://www98.verizon.com/foryourhome/vzrepair/siwizard/img/verizon-logo-200.png","buttons":[
			{"type":"account_link","url":"https://www98.verizon.com/vzssobot/upr/preauth"}]}]}}}};
		sendFBMessage(usersession, respobj.facebook);
	}
	else
	{	
         sendFBMessage(usersession, subflow.facebook);
	}
   
} 

//********************
	
//******************** Rescheduledticket
function Rescheduleticket(apireq,sender,callback) { 
    console.log('inside Rescheduleticket call '+ apireq.contexts);
    var struserid = ''; 
    for (var i = 0, len = apireq.result.contexts.length; i < len; i++) {
        if (apireq.result.contexts[i].name == "sessionuserid") {

            struserid = apireq.result.contexts[i].parameters.Userid;
            console.log("original userid " + ": " + struserid);
        }
    } 
	
    if (struserid == '' || struserid == undefined) struserid='lt6sth2'; //hardcoding if its empty
	
    console.log('struserid '+ struserid);
    var headersInfo = { "Content-Type": "application/json" };
    var args = {
        "headers": headersInfo,
        "json": {Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
            Request: {ThisValue: 'ticketreschedule',
		       BotProviderId :sender, 
		      Userid:''} 
        }		
    };
console.log("args=" + JSON.stringify(args));
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                console.log("body " + body);
                callback(body);
            }
            else
                console.log('error: ' + error + ' body: ' + body);
        }
    );
} 
  
function RescheduleticketCallBack(apiresp,usersession) {
    var objToJson = {};
    objToJson = apiresp;
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response; 
	console.log("Rescheduleticket=" + JSON.stringify(subflow));
    //fix to single element array 
    if (subflow != null 
         && subflow.facebook != null 
         && subflow.facebook.attachment != null 
         && subflow.facebook.attachment.payload != null 
         && subflow.facebook.attachment.payload.buttons != null) {
        try {
            var pgms = subflow.facebook.attachment.payload.buttons;
            console.log ("Is array? "+ util.isArray(pgms))
            if (!util.isArray(pgms))
            {
                subflow.facebook.attachment.payload.buttons = [];
                subflow.facebook.attachment.payload.buttons.push(pgms);
                console.log("CancelopenticketsCallBack=After=" + JSON.stringify(subflow));
            }
        }catch (err) { console.log(err); }
    } 
    console.log("RescheduleticketCallBack=" + JSON.stringify(subflow));
	
	if (subflow != null 
        && subflow.facebook != null 
        && subflow.facebook.text != null && subflow.facebook.text =='UserNotFound')
	{
		console.log ("RescheduleticketCallBack subflow "+ subflow.facebook.text);
		var respobj ={"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[
		{"title":"You have to Login to Verizon to proceed","image_url":"https://www98.verizon.com/foryourhome/vzrepair/siwizard/img/verizon-logo-200.png","buttons":[
			{"type":"account_link","url":"https://www98.verizon.com/vzssobot/upr/preauth"}]}]}}}};		
		sendFBMessage(usersession,  respobj.facebook);
	}
	else
	{	
         sendFBMessage(usersession,  subflow.facebook);
	}
   
} 

//********************

function stationsearch(apireq,callback) { 
	console.log("srationSearch called " );
	 console.log("<<<apireq>>>" + JSONbig.stringify(apireq));
	var strChannelName = getEntity(apireq.entities,"channel"); 
	var strChannelNo = getEntity(apireq.entities,"channelNo"); 
        var strRegionid = 91629;
	
    console.log("strChannelName :   :   :" + strChannelName);
	 console.log("strChannelNo :   :   :" + strChannelNo);
	console.log("strRegionid :   :   :"+ strRegionid);
    var headersInfo = { "Content-Type": "application/json" };
    var args = {
        "headers": headersInfo,
        "json": {Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',   
		  Request: {
                    ThisValue: 'StationSearch',
                    BotRegionID : strRegionid ,
                    BotstrFIOSServiceId : strChannelNo, 
                    BotstrStationCallSign: strChannelName
                }
        }
		
    };
    console.log("json " + String(args));
	
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                console.log("body " + body);
                callback(body);
            }
            else
                console.log('error: ' + error + ' body: ' + body);
        }
    );
 } 
  
function stationsearchCallback(apiresp,usersession) {
    var objToJson = {};
    objToJson = apiresp;
	var respobj = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	 console.log(JSON.stringify(respobj));
	if (respobj != null && respobj.facebook != null && respobj.facebook.channels != null)
	{
	 if (respobj.facebook.channels.channel) {
           // let entries = respobj.facebook.channels.channel;
		  var entries = respobj.facebook.channels.channel;
		 console.log("entries: "+entries);
            entries.forEach((channel) => {
		     console.log("channel: "+channel);
               			sendFBMessage(usersession,  {text: channel});
		    		//usersession.send(channel);
	    			}
			   )};
	}
	else if (respobj != null && respobj.facebook != null && respobj.facebook.attachment != null)
	{	 console.log("less than 10 channels ");
		//sendFBMessage(usersession,  respobj.facebook);
	 
	 		//fix to single element array 
			if (respobj != null 
			&& respobj.facebook != null 
			&& respobj.facebook.attachment != null 
			&& respobj.facebook.attachment.payload != null 
			&& respobj.facebook.attachment.payload.elements != null) {
			try {
				var chanls = respobj.facebook.attachment.payload.elements;
				console.log ("Is array? "+ util.isArray(chanls))
						if (!util.isArray(chanls))
						{
							respobj.facebook.attachment.payload.elements = [];
							respobj.facebook.attachment.payload.elements.push(chanls);
							console.log("ProgramSearchCallBack=After=" + JSON.stringify(respobj));
						}
					 }catch (err) { console.log(err); }
			}

	 	sendFBMessage(usersession, respobj.facebook);
	 
	}
	else
	{
		 console.log("Sorry i dont find channel details");
		sendFBMessage(usersession,  {text: "Sorry I dont find the channel details. Can you try another."});
	}
	
} 	

function getVzProfileCallBack(apiresp,usersession) {
    console.log('Inside Verizon Profile Call back');
    var objToJson = {};
    objToJson = apiresp;
	
    var profileDetails = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
    console.log('Profile Details ' + JSON.stringify(profileDetails));
	
    var CKTID_1 = JSON.stringify(profileDetails.ProfileResponse.CKTID, null, 2)
    var regionId = JSON.stringify(profileDetails.ProfileResponse.regionId, null, 2)
    var vhoId = JSON.stringify(profileDetails.ProfileResponse.vhoId, null, 2)
    var CanNo = JSON.stringify(profileDetails.ProfileResponse.Can, null, 2)
    var VisionCustId = JSON.stringify(profileDetails.ProfileResponse.VisionCustId, null, 2)
    var VisionAcctId = JSON.stringify(profileDetails.ProfileResponse.VisionAcctId, null, 2)
	
    console.log("CKT ID  " + CKTID_1 );
    console.log("regionId  " + regionId );
    console.log("vhoId  " + vhoId );
    console.log("CanNo  " + CanNo );
    console.log("VisionCustId  " + VisionCustId );
    console.log("VisionAcctId  " + VisionAcctId );
	
    usersession.userData.CKTID_1 = CKTID_1;
    usersession.userData.regionId = regionId;
    usersession.userData.vhoId = vhoId;
    usersession.userData.Can = CanNo;
    usersession.userData.VisionCustId = VisionCustId;
    usersession.userData.VisionAcctId = VisionAcctId;
	
    console.log("In userData Session CKT ID  " + usersession.userData.CKTID_1 );
    console.log("In userData Session regionId  " + usersession.userData.regionId );
    console.log("In userData Session vhoId  " + usersession.userData.vhoId );
    console.log("In userData Session CanNo  " + usersession.userData.Can );
    console.log("In userData Session VisionCustId  " + usersession.userData.VisionCustId );
    console.log("In userData Session VisionAcctId  " + usersession.userData.VisionAcctId );
}

//====================

app.use(bodyParser.text({ type: 'application/json' }));
app.get('/deeplink', function (req, res) {
    var cType;
    var reqUrl;
    var redirectURL;
    var contentString;
    var redirectAppStoreURL;
    var redirectPlayStoreURL;
    
    var contentType = req.query.ContentType;
    var userAgent = req.headers['user-agent'].toLowerCase();
    
    console.log("DeepLink-Started");
    console.log(req.get('User-Agent'));
    
    if (userAgent.match(/(iphone|ipod|ipad)/)) {
        console.log("iOS");
        
        cType = contentType? ((contentType == 'MOVIE')? 'MOV' : (contentType == 'SEASON')? 'SEASON' : 'TVS') :'TVS';
        
        if (req.query.fiosID) {
            
            reqUrl = "fiosID=" + req.query.fiosID + "&ContentType=" + cType;

            if (req.query.SeriesID)
                reqUrl = reqUrl + "&SeriesID=" + req.query.SeriesID;
            
            console.log("TV Listing - " + contentType);
        }
        else {
            if (cType == 'SEASON')
            {
                reqUrl = "SeriesID=" + encodeURI(req.query.SeriesID);
            }
            else
            {
                if(req.query.PID && req.query.PAID)
                    reqUrl = "PID=" + req.query.PID + "&PAID=" + req.query.PAID;
                else
                    reqUrl = "CID=" + req.query.CID + "&ContentType=" + cType;
            }
            console.log("On Demand - " + contentType);
        }
        
        redirectURL = 'vz-carbon://app/details?' + reqUrl;
        redirectAppStoreURL = "https://itunes.apple.com/us/app/verizon-fios-mobile/id406387206";
        
        console.log("Request URL = " + redirectURL);
        
        contentString = "<html><head><script type='text/javascript' charset='utf-8'>window.location = '" + redirectURL + "';  var isActive = true;  var testInterval = function () { if(isActive) { window.location='" + redirectAppStoreURL + "';} else {clearInterval(testInterval); testInterval = null;} }; window.onfocus = function () { if(!isActive) return; else {isActive = true;}}; window.onblur = function () { isActive = false; };  setInterval(testInterval, 5000); </script></head> <body> Hello </body> </html>";
    }
    else if (userAgent.match(/(android)/)) {
        console.log("Android");
        
        var now = new Date().valueOf();
        
        if (req.query.fiosID) {
            reqUrl = "/tvlistingdetail/" + req.query.fiosID;
            
            console.log("TV Listing - " + contentType);
        }
        else {
            var conType = (cType == 'MOV')? 'moviedetails':'tvepisodedetails';
            
            reqUrl = ".mm/" + conType + "/" + req.query.CID;
            
            console.log("On Demand - " + contentType);
        }
        
        redirectURL = 'app://com.verizon.fiosmobile' + reqUrl;
        redirectPlayStoreURL = "market://details?id=com.verizon.fiosmobile";
        
        console.log("Request URL = " + redirectURL);
        
        contentString = "<html><head><title></title><script type='text/javascript' charset='utf-8'> window.location = '" + redirectURL + "'; setTimeout(function () { window.location.replace('" + redirectPlayStoreURL + "'); }, 500); </script></head><body></body></html>"
    }
    else {
        console.log("WebSite");
        
        var uri = 'http://tv.verizon.com/';
        
        var callSign = req.query.CallSign;
        callSign = callSign? ((callSign.slice(-2) == 'HD')? callSign.slice(0, -2) : callSign) : '';
        
        redirectURL = req.query.IsLive? (uri + 'livetv/' + callSign) : uri;
        contentString = "<html><head><script type='text/javascript' charset='utf-8'> window.location='" + redirectURL + "'; </script></head></html>";
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(contentString);
    res.end();
    
    console.log("URI = " + redirectURL);
    console.log("DeepLink-Ended");
});

//=================================
	

function accountlinking(apireq,usersession)
{
    console.log('Account Linking Button') ;
    var respobj ={"facebook":
		      {"attachment":
		       {"type":"template","payload":
			{"template_type":"generic","elements":[
				{"title":"Login to Verizon","image_url":"https://www98.verizon.com/foryourhome/vzrepair/siwizard/img/verizon-logo-200.png","buttons":[
					{"type":"account_link","url":"https://www98.verizon.com/vzssobot/upr/preauth"}]}]}}}};
    // AccountLinkDBcall(apireq,usersession);         
    sendFBMessage(usersession,  respobj.facebook);	
}

// function calls
function welcomeMsg(usersession)
{
	//var authCode = "lt6sth2"; 
   // getvzUserID(authCode, function (str) { getvzUserIDCallBack(str, event) });
    console.log("inside welcomeMsg");
    var respobj= {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Want to know what’s on tonight? When your favorite sports team is playing? What time your favorite show is coming on? I can answer almost anything, so try me! Before we get started—let’s take a few minutes to get me linked to your Verizon account, this way I can send you personalized recommendations, alerts.","buttons":[{"type":"postback","title":"Link Account","payload":"Link Account"},{"type":"postback","title":"Maybe later","payload":"Main Menu"}]}}}};
    console.log(JSON.stringify(respobj)); 
    sendFBMessage(usersession, {text: "Hi Welcome to Verizon"});
    sendFBMessage(usersession,  respobj.facebook);
}
	

function MainMenu(usersession)
{
    // var respobj = {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Are you looking for something to watch, or do you want to see more options? Type or tap below.","buttons":[{"type":"postback","title":"What's on tonight?","payload":"On Later"},{"type":"postback","title":"More Options","payload":"More Options"}]}}}};
    var respobj ={"facebook":{"attachment":{"type":"template","payload":
{"template_type":"button","text":"Are you looking for something to watch, or do you want to see more options? Type or tap below.",
 "buttons":[{"type":"postback","title":"On Now","payload":"On Now"},{"type":"postback","title":"On Later","payload":"On Later"},
	    {"type":"postback","title":"More Options","payload":"More Options"}]}}}};
    sendFBMessage(usersession,  respobj.facebook);
}


function CategoryList(apireq,usersession) {
	
    var pgNo = '';//apireq.result.parameters.PageNo;
    var categlist={}
	
    switch(pgNo)
    {
        case '1':
            categlist={"facebook":
			{ "text":"Pick a category", 
			    "quick_replies":[ 
               //    "content_type":"text", "title":"Red", "payload":"red"
                   { "content_type": "text", "title":"Children & Family", "payload":"show Kids movies" }, 
                   { "content_type": "text", "title":"Action & Adventure", "payload":"show Action movies" }, 
                   { "content_type": "text", "title":"Horror", "payload":"show Documentary movies" }, 
                   { "content_type": "text", "title":"Mystery", "payload":"show Mystery movies" },
                   { "content_type": "text", "title":"More Categories ", "payload":"show categories list pageno: 2" }
			    ] }};
            break;
        default :
            categlist={"facebook":
                { "text":"I can also sort my recommendations for you by genre. Type or tap below", 
                    "quick_replies":[ 
                       { "content_type": "text", "payload":"Show Comedy movies", "title":"Comedy" }, 
                       { "content_type": "text", "payload":"Show Drama movies", "title":"Drama" }, 
                       { "content_type": "text", "title":"Music", "payload":"show Music shows" },
                       { "content_type": "text", "payload":"Show Sports program" , "title":"Sports"}, 
                       { "content_type": "text", "payload":"show Sci-Fi movies" , "title":"Sci-Fi"},
                       { "content_type": "text", "title":"Children & Family", "payload":"show Kids movies" }, 
                       { "content_type": "text", "title":"Action & Adventure", "payload":"show Action movies" }, 
                       { "content_type": "text", "title":"Documentary", "payload":"show Documentary movies" }, 
                       { "content_type": "text", "title":"Mystery", "payload":"show Mystery movies" }
                      // { "content_type": "text", "payload":"show categories list pageno: 1" , "title":"More Categories "}
                    ] }};
            break;
    }           
    sendFBMessage(usersession,  categlist.facebook);
	
	
} 

	function getEntity(entitycoll,entityValue) {
	var i = null;
	for (i = 0; entitycoll.length > i; i += 1) {
		if (entitycoll[i].entity === entityValue) {
			return entitycoll[i].value;
		}
	}	
	return '';
        }
	
	function PgmSearch(watres,sender,callback) 
	{ 
	 console.log("<<<Inside PgmSearch>>>");	
	 console.log("<<<sender>>>" + sender);
		
         //var strProgram = watres.entities[0].value;
	 var strProgram =  getEntity(watres.entities,"Programs");
	 console.log("<<<strProgram   : >>>"+ strProgram);
	 var strGenre =  getEntity(watres.entities,"Genre");	
	 var strCast =  getEntity(watres.entities,"cast");	
	 var strTeam =  getEntity(watres.entities,"Teams");	
	 var strdate =  getEntity(watres.entities,"sys-date");
	 var strChannelName =  getEntity(watres.entities,"channel");
	 console.log("<<<strChannelName   : >>>" + strChannelName);	 
	 var strFiosId =getEntity(watres.entities,"FiosID"); 
	 var strStationId = getEntity(watres.entities,"Stationid");
	 var strRegionId = "";	
	
         var headersInfo = { "Content-Type": "application/json" };
	
	var args = {
		"headers": headersInfo,
		"json": {Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
			 Request: {ThisValue: 'AdvProgramSearch', //  EnhProgramSearch
				   BotProviderId :sender, //'1113342795429187',  // usersession ; sender id
				   BotstrTitleValue:strProgram, 
				   BotdtAirStartDateTime : strdate,
				   BotstrGenreRootId : strGenre,
				   BotstrStationCallSign:strChannelName,
				   BotstrFIOSRegionID : strRegionId,
				   BotstrFIOSID : strFiosId,
				   BotstrEpisodeTitleValue : strTeam,
				   BotstrCastCreditNamesRoles : strCast,
				   BotstrFIOSServiceId : strStationId		   
				  } 
			}
		};
		
	  console.log("args " + JSON.stringify(args));
	
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                 console.log("body " + body);
                callback(body);
            }
            else
            	console.log('error: ' + error + ' body: ' + body);
        }
    );
 } 



function PgmSearchCallback(apiresp,usersession) {
    var objToJson = {};
    objToJson = apiresp;
	var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	 console.log("subflow " + JSON.stringify(subflow));
	 logger.info("subflow-PgmSearchCallback" + subflow );
	
	//fix to single element array 
	if (subflow != null 
        && subflow.facebook != null 
        && subflow.facebook.attachment != null 
        && subflow.facebook.attachment.payload != null 
        && subflow.facebook.attachment.payload.buttons != null) {
        try {
				var pgms = subflow.facebook.attachment.payload.buttons;
		console.log ("Is array? "+ util.isArray(pgms))
				if (!util.isArray(pgms))
				{
					subflow.facebook.attachment.payload.buttons = [];
					subflow.facebook.attachment.payload.buttons.push(pgms);
					console.log("ProgramSearchCallBack=After=" + JSON.stringify(subflow));
				}
			 }catch (err) { console.log(err); }
        } 
   
	
	if (subflow != null
            && subflow.facebook != null
            && subflow.facebook.attachment != null
            && subflow.facebook.attachment.payload != null
            && subflow.facebook.attachment.payload.elements != null) {
            try {
                var pgms = subflow.facebook.attachment.payload.elements;

                if (!util.isArray(pgms)) {
                    subflow.facebook.attachment.payload.elements = [];
                    subflow.facebook.attachment.payload.elements.push(pgms);

                }
            } catch (err) { logger.debug("Error on pgm search " + err); }
        }

	
	if (subflow != null 
        && subflow.facebook != null 
        && subflow.facebook.text != null && subflow.facebook.text =='UserNotFound')
	{
		console.log ("PGM Serach subflow "+ subflow.facebook.text);
		var respobj ={"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[
		{"title":"You have to Login to Verizon to proceed","image_url":"https://www98.verizon.com/foryourhome/vzrepair/siwizard/img/verizon-logo-200.png","buttons":[
			{"type":"account_link","url":"https://www98.verizon.com/vzssobot/upr/preauth"}]}]}}}};
		
		sendFBMessage(usersession,  respobj.facebook);
	}
	else
	{	
         sendFBMessage(usersession,  subflow.facebook);
	}
} 
	
	
function ChnlSearch(apireq,callback) { 
    console.log("ChnlSearch called " );
    	var strChannelName = getEntity(apireq.entities,"Channel"); 
	var strChannelNo = getEntity(apireq.entities,"ChannelNo"); 
        var strRegionid = 91629;
	
    console.log("strChannelName : strChannelNo  : strRegionid  :" + strChannelName + strChannelNo + strRegionid);
    var headersInfo = { "Content-Type": "application/json" };
    var args = {
        "headers": headersInfo,
        "json": {Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
          
		  Request: {
                    ThisValue: 'StationSearch',
                    BotRegionID : strRegionid ,
                    BotstrFIOSServiceId : strChannelNo, //channel number search
                    BotstrStationCallSign: strChannelName
                }
        }
		
    };
    console.log("json " + String(args));
	
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                console.log("body " + body);
                callback(body);
            }
            else
                console.log('error: ' + error + ' body: ' + body);
        }
    );
} 
  
function ChnlSearchCallback(apiresp,usersession) {
    var objToJson = {};
    objToJson = apiresp;
    var chposition = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
	
    console.log("chposition :" + chposition)
    if(chposition !=null)
        sendFBMessage(usersession,  {text:"You can watch it on channel # " + chposition});
    else
        sendFBMessage(usersession,  {text:"Sorry I don't have the details. Can you try with another. "});
} 
	
function recommendations(apireq,pgmtype,callback) { 
    console.log('inside recommendations ');
    var struserid = '';
    if (struserid == '' || struserid == undefined) struserid='lt6sth4'; //hardcoding if its empty*/	
    var headersInfo = { "Content-Type": "application/json" };
    var args={};
    if(pgmtype == "OnNow")
    {
        args = {
            "headers": headersInfo,
            "json": {
                Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
                Request: {
                    ThisValue:  'HydraTrending', 
                    BotPgmType :"MyDashBoard",
                    BotstrVCN:''
                }
            }
        };
    }
    else
    {
        args = {
            "headers": headersInfo,
            "json": {
                Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
                Request: {
                    ThisValue:  'HydraOnLater', 
                    Userid :struserid,
                    BotVhoId:'VHO1'
                }
            }
        };
	
    }
    console.log("args " + JSON.stringify(args));
	
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                console.log("body " + body);
                callback(body);
            }
            else
                console.log('error: ' + error + ' body: ' + body);
        }
    );
} 

function recommendationsCallback(apiresp,usersession) {
    var objToJson = {};
    objToJson = apiresp;
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;	
    console.log("subflow " + JSON.stringify(subflow));		               
    sendFBMessage(usersession,  subflow.facebook);
} 

function LinkOptions(apireq,usersession)
{
    console.log('Calling from  link options:') ;
	
    var strRegionId =  apireq.result.parameters.RegionId;
    console.log('strRegionId:' + strRegionId) ;
    var respobj={};
    if (strRegionId != undefined  && strRegionId !='')
    {
        respobj= {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Are you looking for something to watch, or do you want to see more options? Type or tap below.","buttons":[{"type":"postback","title":"What's on tonight?","payload":"On Later"},{"type":"postback","title":"More Options","payload":"More Options"}]}}}};
    }
    else
    {
        var struserid = ''; 
        for (var i = 0, len = apireq.result.contexts.length; i < len; i++) 
        {
            if (apireq.result.contexts[i].name == "sessionuserid")
            {
                struserid = apireq.result.contexts[i].parameters.Userid;
                console.log("original userid " + ": " + struserid);
            }
        } 

        if (struserid == '' || struserid == undefined) struserid='lt6sth4'; //hardcoding if its empty	

        respobj= {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Congrats, we got your details. Tap Continue to proceed.","buttons":[{"type":"postback","title":"Continue","payload":"Userid : " + struserid + "   Regionid : 92377"}]}}}};
    }
    sendFBMessage(usersession,  respobj.facebook);
}

function RecordScenario (apiresp,sender,usersession)
{
    console.log("inside RecordScenario");
	// getEntity(apireq.entities,"ChannelNo"); 
    var channel = getEntity(apireq.entities,"channel");
    var program = getEntity(apireq.entities,"Programs");
    var time =  getEntity(apireq.entities,"timeofpgm"); 
    var dateofrecord = getEntity(apireq.entities,"date"); 
    var SelectedSTB = getEntity(apireq.entities,"SelectedSTB");  
	
    console.log("SelectedSTB : " + SelectedSTB + " channel : " + channel + " dateofrecord :" + dateofrecord + " time :" + time);
		
    if (time == "") //if time is empty show schedule
    { PgmSearch(apiresp,function (str){ PgmSearchCallback(str,usersession)});}
    else if (SelectedSTB == "" || SelectedSTB == undefined) 
    { STBList(apiresp,sender,function (str){ STBListCallBack(str,usersession)}); }
        /*else if (channel == 'HBOSIG') //not subscribed scenario - call to be made
			{
			  var respobj = {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":" Sorry you are not subscribed to " + channel +". Would you like to subscribe " + channel + " ?","buttons":[{"type":"postback","title":"Subscribe","payload":"Subscribe"},{"type":"postback","title":"No, I'll do it later ","payload":"Main Menu"}]}}}};	
			  sendFBMessage(usersession,  respobj.facebook);
				
			}
		else if (channel == 'CBSSN')  //DVR full scenario - call to be made
			{
			   var respobj= {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":" Sorry your DVR storage is full.  Would you like to upgrade your DVR ?","buttons":[{"type":"postback","title":"Upgrade my DVR","payload":"Upgrade my DVR"},{"type":"postback","title":"No, I'll do it later ","payload":"Main Menu"}]}}}};
			   sendFBMessage(usersession,  respobj.facebook);
			}*/
    else 
    {  //Schedule Recording
        console.log(" Channel: " + apiresp.result.parameters.Channel +" Programs: " + apiresp.result.parameters.Programs +" SelectedSTB: " + apiresp.result.parameters.SelectedSTB +" Duration: " + apiresp.result.parameters.Duration +" FiosId: " + apiresp.result.parameters.FiosId +" RegionId: " + apiresp.result.parameters.RegionId +" STBModel: " + apiresp.result.parameters.STBModel +" StationId: " + apiresp.result.parameters.StationId +" date: " + apiresp.result.parameters.date +" timeofpgm: " + apiresp.result.parameters.timeofpgm );
        DVRRecord(apiresp,function (str){ DVRRecordCallback(str,usersession)});
    }  
}


function STBList(apireq,sender,callback) { 
    console.log('inside external call '+ apireq.contexts);
    var struserid = ''; 
    for (var i = 0, len = apireq.result.contexts.length; i < len; i++) {
        if (apireq.result.contexts[i].name == "sessionuserid") {

            struserid = apireq.result.contexts[i].parameters.Userid;
            console.log("original userid " + ": " + struserid);
        }
    } 
	
    if (struserid == '' || struserid == undefined) struserid='lt6sth2'; //hardcoding if its empty
	
    console.log('struserid '+ struserid);
    var headersInfo = { "Content-Type": "application/json" };
    var args = {
        "headers": headersInfo,
        "json": {Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
            Request: {ThisValue: 'AuthSTBList',
		       BotProviderId :sender, 
		      Userid:''} 
        }		
    };
console.log("args=" + JSON.stringify(args));
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                console.log("body " + body);
                callback(body);
            }
            else
                console.log('error: ' + error + ' body: ' + body);
        }
    );
} 
  
function STBListCallBack(apiresp,usersession) {
    var objToJson = {};
    objToJson = apiresp;
    var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response; 
	console.log("STBListCresp=" + JSON.stringify(subflow));
    //fix to single element array 
    if (subflow != null 
         && subflow.facebook != null 
         && subflow.facebook.attachment != null 
         && subflow.facebook.attachment.payload != null 
         && subflow.facebook.attachment.payload.buttons != null) {
        try {
            var pgms = subflow.facebook.attachment.payload.buttons;
            console.log ("Is array? "+ util.isArray(pgms))
            if (!util.isArray(pgms))
            {
                subflow.facebook.attachment.payload.buttons = [];
                subflow.facebook.attachment.payload.buttons.push(pgms);
                console.log("STBListCallBack=After=" + JSON.stringify(subflow));
            }
        }catch (err) { console.log(err); }
    } 
    console.log("STBListCallBack=" + JSON.stringify(subflow));
	
	if (subflow != null 
        && subflow.facebook != null 
        && subflow.facebook.text != null && subflow.facebook.text =='UserNotFound')
	{
		console.log ("STBListCallBack subflow "+ subflow.facebook.text);
		var respobj ={"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[
		{"title":"You have to Login to Verizon to proceed","image_url":"https://www98.verizon.com/foryourhome/vzrepair/siwizard/img/verizon-logo-200.png","buttons":[
			{"type":"account_link","url":"https://www98.verizon.com/vzssobot/upr/preauth"}]}]}}}};		
		sendFBMessage(usersession,  respobj.facebook);
	}
	else
	{	
         sendFBMessage(usersession,  subflow.facebook);
	}
   
} 

function DVRRecord(apireq,callback) { 
	
    console.log("<<< Inside DVRRecord function >>>");
    var strUserid = ''; 
    var args ={};
    for (var i = 0, len = apireq.result.contexts.length; i < len; i++) {
        if (apireq.result.contexts[i].name == "sessionuserid") 
        {
            strUserid = apireq.result.contexts[i].parameters.Userid;
            console.log("original userid " + ": " + strUserid);
        }
    } 
    if (strUserid == '' || strUserid == undefined) strUserid='lt6sth2'; //hardcoding if its empty
		
    var strProgram =  apireq.result.parameters.Programs;
    var strChannelName =  apireq.result.parameters.Channel;
    var strGenre =  apireq.result.parameters.Genre;

    var strFiosId = apireq.result.parameters.FiosId;
    var strSeriesId = apireq.result.parameters.SeriesId;
    var strStationId =apireq.result.parameters.StationId  ;
	
    var strAirDate =apireq.result.parameters.date  ;
    var strAirTime =apireq.result.parameters.timeofpgm  ;
    var strDuration =apireq.result.parameters.Duration  ;
	
    var strRegionId =apireq.result.parameters.RegionId;
    var strSTBModel =apireq.result.parameters.STBModel  ;
    var strSTBId =apireq.result.parameters.SelectedSTB  ;	
    var strVhoId =apireq.result.parameters.VhoId  ;
    var strProviderId =apireq.result.parameters.ProviderId  ;
	
    console.log(" strUserid " + strUserid + "Recording strProgram " + strProgram + " strGenre " + strGenre + " strdate " +strAirDate + " strFiosId " +strFiosId +" strSeriesId "+ strSeriesId +" strStationId " +strStationId  +" strAirDate " + strAirDate + " strAirTime " + strAirTime+ " strSTBId " +strSTBId + " strSTBModel " +strSTBModel+" strRegionId " +strRegionId+ " strDuration " +strDuration );
	
    var headersInfo = { "Content-Type": "application/json" };
	
    if (strSeriesId !='' && strSeriesId != undefined  )
    {
        console.log ("Record Series");
        args = {
            "headers": headersInfo,
            "json": {Flow: 'TroubleShooting Flows\\ChatBot\\APIChatBot.xml',
                Request: {ThisValue: 'DVRSeriesSchedule',  //DVRSeriesSchedule
                    Userid : strUserid,
                    BotStbId:strSTBId, 
                    BotDeviceModel : strSTBModel,
                    BotstrFIOSRegionID : '91629',
                    BotstrFIOSID:strFiosId,
                    BotstrFIOSServiceId : strSeriesId, //yes its series id
                    BotStationId : strStationId,
                    BotAirDate : strAirDate,
                    BotAirTime : strAirTime,
                    BotDuration : strDuration,
                    BotstrTitleValue: strProgram,
                    BotVhoId : strVhoId,
                    BotProviderId : strProviderId,
                    BotstrFIOSRegionID : strRegionId
                } 
            }
	
        };
    }
    else
    {
        console.log ("Record Episode");
        args = {
            "headers": headersInfo,
            "json": {Flow: 'TroubleShooting Flows\\Test\\APIChatBot.xml',
                Request: {ThisValue: 'DVRSchedule', 
                    Userid : strUserid,
                    BotStbId:strSTBId, 
                    BotDeviceModel : strSTBModel,
                    BotstrFIOSRegionID : '91629',
                    BotstrFIOSServiceId : strFiosId,
                    BotStationId : strStationId,
                    BotAirDate : strAirDate,
                    BotAirTime : strAirTime,
                    BotDuration : strDuration,
                    BotVhoId : strVhoId,
                    BotProviderId : strProviderId
                } 
            }
        };
    }
	
    console.log("args " + JSON.stringify(args));
	
    request.post("https://www.verizon.com/foryourhome/vzrepair/flowengine/restapi.ashx", args,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
             
                console.log("body " + JSON.stringify(body));
                callback(body);
            }
            else
                console.log('error: ' + error + ' body: ' + body);
        }
    );
} 

function DVRRecordCallback(apiresp,usersession) 
{
    var objToJson = {};
    objToJson = apiresp;
    try{
        var subflow = objToJson[0].Inputs.newTemp.Section.Inputs.Response;
        console.log( "subflow Value -----" + JSON.stringify(subflow));
        var respobj={};
        if (subflow !=null )
        {
            if (subflow != null  && subflow.facebook != null  && subflow.facebook.result != null && subflow.facebook.result.msg !=null && subflow.facebook.result.msg =="success" )
            {
                respobj = {"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"Good news, you have successfully scheduled this recording. Would you like to see some other TV Recommendations for tonight?","buttons":[{"type":"postback","title":"Show Recommendations","payload":"Show Recommendations"},{"type":"postback","title":"More Options","payload":"More Options"}]}}}};				
                sendFBMessage(usersession,  respobj.facebook);
            }
            else if (subflow != null  && subflow.facebook != null  && subflow.facebook.result != null && subflow.facebook.result.code != null &&  subflow.facebook.result.code == "9507")
            {
                respobj = "This Program has already been scheduled";
                sendFBMessage(usersession,  {text: respobj});
            }
            else if (subflow != null  && subflow.facebook != null  && subflow.facebook.result != null && subflow.facebook.result.code != null && subflow.facebook.result.code == "9117") //not subscribed
            {
                respobj = {"facebook":{"attachment":{"type":"template","payload":
                                    {"template_type":"button","text":" Sorry you are not subscribed to this channel. Would you like to subscribe ?","buttons":[
                                        {"type":"postback","title":"Subscribe","payload":"Subscribe"},
                                        {"type":"postback","title":"No, I'll do it later ","payload":"Main Menu"}]}}}};	
                sendFBMessage(usersession,  respobj.facebook);
            }
            else
            {				
                console.log( "Error occured in recording: ");
                if (subflow != null  && subflow.facebook != null  && subflow.facebook.result != null && subflow.facebook.result.msg != null)
                    respobj =  "I'm unable to schedule this Program now. Can you please try this later ("+subflow.facebook.result.code+" : " + subflow.facebook.result.msg +")"  ;
                else if (subflow != null  && subflow.facebook != null  && subflow.facebook.errorPage != null && subflow.facebook.errorPage.errormsg  != null)
                    respobj =  "I'm unable to schedule this Program now. Can you please try this later (" + subflow.facebook.errorPage.errormsg +")"  ;
                else
                    respobj =  "I'm unable to schedule this Program now. Can you please try this later" ;
                sendFBMessage(usersession,  {text: respobj});				
            }
        }
        else
        {
            respobj = "I'm unable to schedule this Program now. Can you please try this later";			
            sendFBMessage(usersession,  {text: respobj});
        }
    }
    catch (err) 
    {
        console.log( "Error occured in recording: " + err);
        respobj = "I'm unable to schedule this Program now. Can you please try this later (" + err + ")";
        //sendFBMessage(usersession,  respobj.facebook);
        sendFBMessage(usersession,  {text: respobj});
    }
}

function support(usersession)
{
    var respobj={"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text":"You may need some additional help. Tap one below.","buttons":[{"type":"web_url","url":"https://m.me/fios","title":"Chat with Agent "},{"type":"phone_number","title":"Talk to an agent","payload":"+918554804789"}]}}}};	
    //var msg = new builder.Message(usersession).sourceEvent(respobj);              
    //usersession.send(respobj);
    sendFBMessage(usersession,  respobj.facebook);
}

function upsell(apiresp,usersession) 
{
    var respstr ='Congrats, Now you are subscribed for ' + apiresp.result.parameters.Channel +" Channel.  Now  I can help you with  TV Recommendations or Recording a program. What would you like to do?" ;
    var respobj={"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text": respstr,"buttons":[{"type":"postback","title":"TV Recommendations","payload":"Yes"},{"type":"postback","title":"Record","payload":"I want to record"}]}}}};
    //var msg = new builder.Message(usersession).sourceEvent(respobj);              
    sendFBMessage(usersession,  respobj.facebook);
}

function upgradeDVR(apiresp,usersession) 
{
    var purchasepin =  apiresp.result.parameters.purchasepin;
    if (purchasepin !="" || purchasepin !=undefined )
        var respstr ="Congrats, Your DVR is upgraded.  Now  I can help you with  TV Recommendations or Recording a program. What would you like to do?" ;
    else
        var respstr ="Ok, we are not upgratding the DVR now.  Now  I can help you with  TV Recommendations or Recording a program. What would you like to do?" ;

    var respobj={"facebook":{"attachment":{"type":"template","payload":{"template_type":"button","text": respstr ,"buttons":[{"type":"postback","title":"TV Recommendations","payload":"Yes"},{"type":"postback","title":"Record","payload":"I want to record"}]}}}}
    // var msg = new builder.Message(usersession).sourceEvent(respobj);              
    sendFBMessage(usersession,  respobj.facebook);
}

function demowhatshot(usersession) 
{
    var respobj =  {"facebook":{"attachment":{"type":"template","payload":{"template_type":"generic","elements":[{"title":"Family Guy","subtitle":"WBIN : Comedy","image_url":"http://image.vam.synacor.com.edgesuite.net/8d/53/8d532ad0e94c271f8fb153a86141de2c92ee15b0/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Family Guy Channel: WBIN"}]},{"title":"NCIS","subtitle":"USA : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/85/ed/85ed791472df3065ae5462d42560773a649fdfaf/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: NCIS Channel: USA"}]},{"title":"Shark Tank","subtitle":"CNBC : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/0f/07/0f07592094a2a596d2f6646271e9cb0311508415/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Shark Tank Channel: CNBC"}]},{"title":"Notorious","subtitle":"ABC WCVB : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/ba/51/ba51ba91eafe2da2a01791589bca98c0044b6622/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Notorious Channel: ABC WCVB"}]},{"title":"Chicago Med","subtitle":"NBC WHDH : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/e1/93/e1933b6aee82a467980415c36dced6fddf64d80a/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Chicago Med Channel: NBC WHDH"}]},{"title":"Modern Family","subtitle":"CW WLVI : Action &amp; Adventure,Drama","image_url":"http://image.vam.synacor.com.edgesuite.net/c1/58/c1586d0e69ca53c32ae64526da7793b8ec962678/w=207,h=151,crop=auto/?sig=0cdc5e32bc854a2e2d767ab10d96385797b360a24c9f845ead33b1ea3d79aa01&app=powerplay","buttons":[{"type":"web_url","url":"http://www.verizon.com/msvsearch/whatshotimage/thumbnails/default.jpg","title":"Watch Video"},{"type":"postback","title":"RecordNow","payload":"Get Program info of Program: Modern Family Channel: CW WLVI"}]}]}}}};
    //  var msg = new builder.Message(usersession).sourceEvent(respobj);              
    sendFBMessage(usersession,  respobj.facebook);
}

function testmethod(usersession)
{
    console.log("inside test method");
    var myobj=  {   "facebook": {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Are you looking for something to watch, or do you want to see more options? Type or tap below.",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "What's on tonight?",
                        "payload": "On Later"
                    },
                    {
                        "type": "postback",
                        "title": "More Options",
                        "payload": "More Options"
                    }
                ]
            }
        }
    }
    };
	
    //  var msg = new builder.Message(usersession).sourceEvent(myobj);              
    sendFBMessage(usersession,  myobj.facebook);
}
