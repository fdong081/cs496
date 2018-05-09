/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-06 22:54:28 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-09 20:56:57
 */
/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-04-06 22:54:04 
 * @Last Modified by:   mikey.zhaopeng 
 * @Last Modified time: 2018-04-06 22:54:04 
 */
'use strict';
// The module 'vscode' contains the VS Code extensibility API

// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
//var http = require('./lib/request');
import { window, Disposable, ExtensionContext } from 'vscode';
//var mLab = require('mongolab-data-api')('pqn8bKvN0LmnOlf9WNYA7GR40ahMbDSW');

var async = require('async');
var Timeline = require('../models/timeline');
var EdtiTime = require('../models/edittime');

var mongoose = require('mongoose');
var mongoDB = 'mongodb://cs496:cs496spring@ds161029.mlab.com:61029/cs496';

var times: any= [];


async function timelineCreate(_time: String, _file_name: String, _action: String) {
  var detail = { time: _time, file_name: _file_name, action: _action };
  var timeline = new Timeline(detail);
  mongoose.connection.collection("timelines", timeline);

  timeline.save(function (err) {
    if (err) {
      throw err;

    }
    console.log('New entry: ' + timeline);
    times.push(timeline);
  });
}
async function edittimeCreate(_file_name: String, _edittime: Number) {
  var detail = { file_name: _file_name, edit_time: _edittime };
  var edittime = new EdtiTime(detail);
  
  mongoose.connection.collection("edittimes", edittime);
  edittime.save(function (err) {
    if (err) {
      throw err;

    }
    console.log('New entry: ' + edittime);
    times.push(edittime);
  });

}
/*
function createTimeline() {
  async.parallel([
    function (callback) {
      timelineCreate('Thu April 19 13:57:51 EDT 2018', 'routs.ts', 'open');
    },
    function (callback) {
      timelineCreate('Thu April 19 13:57:58 EDT 2018', 'index.ts', 'open');
    },
    function (callback) {
      timelineCreate('Thu April 19 13:58:10 EDT 2018', 'routs.ts', 'focus');
    },
    function (callback) {
      timelineCreate('Thu April 19 13:58:13 EDT 2018', 'index.ts', 'focus');
    },
  ]
  );
}

async.series([
  createTimeline
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  });
*/
function composeTimeStamp(date: Date): string {

  let weekDayName: string = getTodayWeekDayName(date);
  let monthName: string = geTodayMonthName(date);
  let monthDay: string = date.getDate().toString();
  let time: string = date.toLocaleTimeString('en-US', { hour12: false });
  let timeZoneAbbr: string = getTimeZoneAbbreviation();
  let year: string = date.getFullYear().toString();
  return concatWithDelimiter(" ", [weekDayName, monthName, monthDay, time, timeZoneAbbr, year]);
}

function geTodayMonthName(date: Date): string {
  let fullNameList: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  //let shortNameList: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let targetIndex: number = date.getMonth();
  return (fullNameList[targetIndex]);
}

function getTodayWeekDayName(date: Date): string {
  // let fullNameList: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let shortNameList: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let targetIndex: number = date.getDay();
  return (shortNameList[targetIndex]);
}

function getTimeZoneAbbreviation(): string {
  let timezone = require('moment-timezone');
  let userTimeZone: string = timezone.tz.guess();
  return timezone.tz(userTimeZone).zoneAbbr();
}

function concatWithDelimiter(delimiter: string, stringList: string[]): string {
  let result: string[] = [];
  for (var i = 0; i < stringList.length - 1; i++) {
    result.push(stringList[i]);
    result.push(delimiter);
  }
  result.push(stringList[stringList.length - 1]);
  return result.join("");
}

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension is now active!');

  mongoose.connect(mongoDB);
  mongoose.Promise = global.Promise;

  mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

  let hd = new HeaderGenerator();
  let hdCon = new HeaderController(hd);
  context.subscriptions.push(hd);
  context.subscriptions.push(hdCon);
}


class HeaderGenerator {
  private _disposable: Disposable;

  public getOpenTime() {
    // Get the current text editor 
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }
    var doc = editor.document;
    var time = composeTimeStamp(new Date());
    //var opend_time: string = "Open Time: " + time;
    var filename = doc.uri.path.substring(doc.uri.path.lastIndexOf('/') + 1);

    timelineCreate(time, filename, "open");

  }
  public getFocusTime() {
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }
    var doc = editor.document;
    var time = composeTimeStamp(new Date()); 
   // var focus_time: string = "Focus Time: " + time;
    var filename = doc.uri.path.substring(doc.uri.path.lastIndexOf('/') + 1);   

    timelineCreate(time, filename, "focus");
 }

  public getCloseTime() {
    // Get the current text editor 
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    var doc = editor.document;
    var time = composeTimeStamp(new Date());
    //var opend_time: string = "Close Time: " + time;
    var filename = doc.uri.path.substring(doc.uri.path.lastIndexOf('/') + 1);
    timelineCreate(time, filename, "close");

  }
  
  public getSaveTime() {
    // Get the current text editor 
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }
    // Get the document
    var edit_time: number;
    var doc = editor.document;
    var time = composeTimeStamp(new Date());
    //var saved_time: string = "Save Time: " + time;

    var filename = doc.uri.path.substring(doc.uri.path.lastIndexOf('/') + 1);
    timelineCreate(time, filename, "save");

    edit_time = this.getEditTime(filename);
    edittimeCreate(filename, edit_time);
  }


  getEditTime(filename: string) {
    var total_time: number = 0; // 0 second
    console.log("Data: ");
    var textByLine = Timeline
      .find().sort({ time: 1 })
      .then(doc => {
        console.log(doc);
      })
      .catch(err => {
        console.error(err);
      });
    console.log("text"+textByLine);
    return total_time;
/*
    var this_line_copy;
    
    var text = fs.readFileSync('./output.txt', 'utf8');
    
    textByLine.reverse();

    var next_line;
    var prev_line;
    var timeStr;
    var diff;
    for (var i = 1; i < textByLine.length; i++) {
      if (textByLine[i].includes("Total Edit time for " + filename)) {
        this_line_copy = textByLine[i].slice(0);
        next_line = textByLine[i - 1].slice(0);
        prev_line = textByLine[i + 1].slice(0);
        timeStr = next_line.substring(next_line.indexOf(":") + 2, next_line.length);
        var next_time = new Date(this.formatTime(timeStr));
        timeStr = prev_line.substring(prev_line.indexOf(":") + 2, prev_line.length);
        var prev_time = new Date(this.formatTime(timeStr));
        diff = (next_time.getTime() - prev_time.getTime()) / 1000;
        total_time = total_time + diff + Number(this_line_copy.substring(this_line_copy.lastIndexOf('s') + 2, this_line_copy.length));
        break;
      }
      else if (textByLine[i].includes(filename)){
        if ((textByLine[i].includes("Focus") || textByLine[i].includes("Open") )) {
          next_line = textByLine[i - 1].slice(0);
          if(next_line.includes("Close") && next_line.includes(filename))
          {
            continue;
          }
          timeStr = next_line.substring(next_line.indexOf(":") + 2, next_line.length);
          //console.log(this.formatTime(timeStr));
          var closeTime = new Date(this.formatTime(timeStr));

          this_line_copy = textByLine[i].slice(0);
          timeStr = this_line_copy.substring(this_line_copy.indexOf(":") + 2, this_line_copy.length);
          //console.log(this.formatTime(timeStr)+"formated time");
          var openTime = new Date(this.formatTime(timeStr));
          diff = (closeTime.getTime() - openTime.getTime()) / 1000;
          //console.log(diff+"diff");
          total_time = total_time + diff;
        }
      }
    }*/
    ///console.log(total_time);
   
  }

  formatTime(time_string: string) {
    var monthName = time_string.split(" ")[1];
    var monthDay = time_string.split(" ")[2];
    var time = time_string.split(" ")[3];

    var year = time_string.split(" ")[5];
    var formated_time = monthName + " " + monthDay + ", " + year + " " + time;

    return formated_time;
  }

  dispose() {
    this._disposable.dispose();
  }
}



class HeaderController {
  private _hder: HeaderGenerator;
  private _disposable: Disposable;

  constructor(hd: HeaderGenerator) {
    this._hder = hd;
    let subscriptions: Disposable[] = [];
    vscode.workspace.onDidOpenTextDocument(this._onOpenEvent, this, subscriptions);
    window.onDidChangeActiveTextEditor(this._onFocusEvent, this, subscriptions);
    vscode.workspace.onDidSaveTextDocument(this._onSaveEvent, this, subscriptions);
    vscode.workspace.onDidCloseTextDocument(this._onCloseEvent, this, subscriptions);

    this._disposable = Disposable.from(...subscriptions);

  }
  dispose() {
    this._disposable.dispose();
    mongoose.connection.close();
    console.log("connection closed ");
  }
  private _onOpenEvent() {
    this._hder.getOpenTime();
  }

  private  _onSaveEvent() {
     this._hder.getSaveTime();
  }

  private  _onFocusEvent() {
     this._hder.getFocusTime();
  }
  private  _onCloseEvent() {
     this._hder.getCloseTime();
  }

}

