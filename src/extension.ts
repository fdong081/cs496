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
import { window, Disposable, ExtensionContext } from 'vscode';

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

  let hd = new HeaderGenerator();
  let hdCon = new HeaderController(hd);
  context.subscriptions.push(hd);
  context.subscriptions.push(hdCon);
}


class HeaderGenerator {
  private _disposable: Disposable;
  private fs =  require('fs');

  public replaceFocusTime() {
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }
    var doc = editor.document;

    var focus_time: string = "Focus Time: " + composeTimeStamp(new Date());
    var filename = doc.uri.path.substring(doc.uri.path.lastIndexOf('/') + 1);   
    this.fs.appendFileSync("./output.txt", filename + " " + focus_time + "\n", (err) => {
      if (err) {
        return console.error(err);
      }
      console.log("ts file focused!");
    });

  }
  
  public replaceOpenTime() {
    // Get the current text editor 
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    var doc = editor.document;
    var opend_time: string = "Open Time: " + composeTimeStamp(new Date());
    var filename = doc.uri.path.substring(doc.uri.path.lastIndexOf('/') + 1);
    this.fs.appendFileSync("./output.txt", filename + " " + opend_time + "\n", (err) => {
      if (err) {
        return console.error(err);
      }
      console.log("ts file opened!");
    });


  }
  public replaceCloseTime() {
    // Get the current text editor 
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }

    var doc = editor.document;
    var opend_time: string = "Close Time: " + composeTimeStamp(new Date());
    var filename = doc.uri.path.substring(doc.uri.path.lastIndexOf('/') + 1);
    this.fs.appendFileSync("./output.txt", filename + " " + opend_time + "\n", (err) => {
      if (err) {
        return console.error(err);
      }
      console.log("ts file closed!");
    });


  }
  
  public replaceSaveTime() {
    // Get the current text editor 
    let editor = window.activeTextEditor;
    if (!editor) {
      return;
    }
    // Get the document
    var edit_time: number;
    var doc = editor.document;
    var filename = doc.uri.path.substring(doc.uri.path.lastIndexOf('/') + 1);
    var saved_time: string = "Save Time: " + composeTimeStamp(new Date());
    this.fs.appendFileSync("./output.txt", filename + " " + saved_time + "\n", (err) => {
      if (err) {
        return console.error(err);
      }
      console.log("File saved");
    });
    edit_time = this.getEditTime(filename);
    this.fs.appendFileSync("./output.txt", "Total Edit time for " + filename + " is " + edit_time + "\n", (err) => {
      if (err) {
        return console.error(err);
      }
      console.log("Total Caled");
    });
  }


  getEditTime(filename: string) {
    //var lineReader = require('line-reader');
    var this_line_copy;
    var fs = require("fs");
    var total_time: number = 0; // 0 second
    var text = fs.readFileSync('./output.txt', 'utf8');
    var textByLine = text.split("\n");
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
    }
    ///console.log(total_time);
    return total_time;
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
    //this._hder.replaceSaveTime();
    //this._hder.replaceOpenTime();
  }
  dispose() {
    this._disposable.dispose();
  }
  private _onSaveEvent() {
    this._hder.replaceSaveTime();
  }
  private _onOpenEvent() {
    this._hder.replaceOpenTime();
  }
  private _onFocusEvent() {
    this._hder.replaceFocusTime();
  }
  private _onCloseEvent() {
    this._hder.replaceCloseTime();
  }

}

