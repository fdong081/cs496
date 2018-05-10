import { postJSON } from '../util/reqHandler';

var pg = require('pg');
var conString = "postgres://Abhay:12345@localhost:5000/STUDENTDATA";
var STUDENT_ID ="student1" 

function connectClient(){
  var client = new pg.Client(conString);
  client.connect();
  return client;
}

export function postNewkeyCount(key) {
  var databaseClient = connectClient();
  return (dispatch) => {
    var query = databaseClient.query("Update MyTable $1 = $1 + 1 Where studentid == student1", [key]);
    query.on('end', function() {
      databaseClient.end(); 
     }); 
    return "SUCCESS" 
  };
}

export function updateCode(code) {
  var databaseClient = connectClient();
  return (dispatch) => {
   var query =  databaseClient.query("Update MyTable flagged= $1  Where studentid == student1", [code]);
   query.on('end', function() {
      databaseClient.end(); 
    }); 
    return "SUCCESS"
  };
}

export function timeUpdate(time) {
  var databaseClient = connectClient();
  return (dispatch) => {
   var query =  databaseClient.query("Update MyTable lastSession= $1  Where studentid == student1", [time]);
   query.on('end', function() {
      databaseClient.end(); 
    }); 
    return "SUCCESS"
  };
}
