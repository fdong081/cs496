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
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const vscode_1 = require("vscode");
function composeTimeStamp(date) {
    let weekDayName = getTodayWeekDayName(date);
    let monthName = geTodayMonthName(date);
    let monthDay = date.getDate().toString();
    let time = date.toLocaleTimeString('en-US', { hour12: false });
    let timeZoneAbbr = getTimeZoneAbbreviation();
    let year = date.getFullYear().toString();
    return concatWithDelimiter(" ", [weekDayName, monthName, monthDay, time, timeZoneAbbr, year]);
}
function geTodayMonthName(date) {
    let fullNameList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    //let shortNameList: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let targetIndex = date.getMonth();
    return (fullNameList[targetIndex]);
}
function getTodayWeekDayName(date) {
    // let fullNameList: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let shortNameList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let targetIndex = date.getDay();
    return (shortNameList[targetIndex]);
}
function getTimeZoneAbbreviation() {
    let timezone = require('moment-timezone');
    let userTimeZone = timezone.tz.guess();
    return timezone.tz(userTimeZone).zoneAbbr();
}
function concatWithDelimiter(delimiter, stringList) {
    let result = [];
    for (var i = 0; i < stringList.length - 1; i++) {
        result.push(stringList[i]);
        result.push(delimiter);
    }
    result.push(stringList[stringList.length - 1]);
    return result.join("");
}
function activate(context) {
    console.log('Congratulations, your extension is now active!');
    let hd = new HeaderGenerator();
    let hdCon = new HeaderController(hd);
    context.subscriptions.push(hd);
    context.subscriptions.push(hdCon);
}
exports.activate = activate;
class HeaderGenerator {
    constructor() {
        this.fs = require('fs');
    }
    replaceFocusTime() {
        let editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var doc = editor.document;
        var focus_time = "Focus Time: " + composeTimeStamp(new Date());
        var filename = doc.uri.path.substring(doc.uri.path.lastIndexOf('/') + 1);
        this.fs.appendFileSync("./output.txt", filename + " " + focus_time + "\n", (err) => {
            if (err) {
                return console.error(err);
            }
            console.log("ts file focused!");
        });
    }
    replaceOpenTime() {
        // Get the current text editor 
        let editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var doc = editor.document;
        var opend_time = "Open Time: " + composeTimeStamp(new Date());
        var filename = doc.uri.path.substring(doc.uri.path.lastIndexOf('/') + 1);
        this.fs.appendFileSync("./output.txt", filename + " " + opend_time + "\n", (err) => {
            if (err) {
                return console.error(err);
            }
            console.log("ts file opened!");
        });
    }
    replaceCloseTime() {
        // Get the current text editor 
        let editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var doc = editor.document;
        var opend_time = "Close Time: " + composeTimeStamp(new Date());
        var filename = doc.uri.path.substring(doc.uri.path.lastIndexOf('/') + 1);
        this.fs.appendFileSync("./output.txt", filename + " " + opend_time + "\n", (err) => {
            if (err) {
                return console.error(err);
            }
            console.log("ts file closed!");
        });
    }
    replaceSaveTime() {
        // Get the current text editor 
        let editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            return;
        }
        // Get the document
        var edit_time;
        var doc = editor.document;
        var filename = doc.uri.path.substring(doc.uri.path.lastIndexOf('/') + 1);
        var saved_time = "Save Time: " + composeTimeStamp(new Date());
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
    getEditTime(filename) {
        //var lineReader = require('line-reader');
        var this_line_copy;
        var fs = require("fs");
        var total_time = 0; // 0 second
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
            else if (textByLine[i].includes(filename)) {
                if ((textByLine[i].includes("Focus") || textByLine[i].includes("Open"))) {
                    next_line = textByLine[i - 1].slice(0);
                    if (next_line.includes("Close") && next_line.includes(filename)) {
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
    formatTime(time_string) {
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
    constructor(hd) {
        this._hder = hd;
        let subscriptions = [];
        vscode.workspace.onDidOpenTextDocument(this._onOpenEvent, this, subscriptions);
        vscode_1.window.onDidChangeActiveTextEditor(this._onFocusEvent, this, subscriptions);
        vscode.workspace.onDidSaveTextDocument(this._onSaveEvent, this, subscriptions);
        vscode.workspace.onDidCloseTextDocument(this._onCloseEvent, this, subscriptions);
        this._disposable = vscode_1.Disposable.from(...subscriptions);
        //this._hder.replaceSaveTime();
        //this._hder.replaceOpenTime();
    }
    dispose() {
        this._disposable.dispose();
    }
    _onSaveEvent() {
        this._hder.replaceSaveTime();
    }
    _onOpenEvent() {
        this._hder.replaceOpenTime();
    }
    _onFocusEvent() {
        this._hder.replaceFocusTime();
    }
    _onCloseEvent() {
        this._hder.replaceCloseTime();
    }
}
//# sourceMappingURL=extension.js.map