// ------------------------------------------------------------------------------//
// ---------------------------------- TESTING ---------------------------------- //
// ------------------------------------------------------------------------------//
var storeIds = [175, 42, 0, 9]
var transactionIds = [9675, 23, 123, 7]

storeIds.forEach(function (storeId) {
    transactionIds.forEach(function (transactionId) {
        var shortCode = generateShortCode(storeId, transactionId);
        var decodeResult = decodeShortCode(shortCode);
        console.log(shortCode);
        // $("#test-results").append("<div>" + storeId + " - " + transactionId + ": " + shortCode + "</div>");
        console.log("Length <= 9", shortCode.length <= 9);
        console.log("Is String", (typeof shortCode === 'string'));
        console.log("Is Today", IsToday(decodeResult.shopDate));
        console.log("StoreId", storeId === decodeResult.storeId);
        console.log("TransId", transactionId === decodeResult.transactionId);
    })
})

// ------------------------------------------------------------------------------//
// ------------------------------ Helper Function ------------------------------ //
// ------------------------------------------------------------------------------//
function getDateStr(date) {
    return date.getFullYear().toString().slice(-2) 
        + (date.getMonth() + 1).toString().padStart(2, '0') 
        + date.getDate().toString().padStart(2, '0');
}

function padCodeLength(code, length) {
    return code.toString().padStart(length, '0');
}

function encodeStoreId(storeId) {
    var digit = Math.floor(storeId / 21);
    var charCode = (storeId % 21) + 65; // convert 0-20 to A-V ASCII code (65-86)
    var char = String.fromCharCode(charCode);
    return digit.toString() + char;
}

function decodeStoreId(storeCode) {
    var digit = parseInt(storeCode.charAt(0));
    var charCode = storeCode.charCodeAt(1) - 65; // convert A-V ASCII code (65-86) to 0-20
    var storeId = digit * 21 + charCode;
    return storeId;
}

function encodeTransactionId(transactionId) {
    var base = 26; // 26 chars in the alphabet
    var offset = 65; // ASCII code for 'A'
    var digits = [];
    for (var i = 0; i < 3; i++) {
      var remainder = transactionId % base;
      digits.unshift(String.fromCharCode(offset + remainder));
      transactionId = Math.floor(transactionId / base);
    }
    var transactionCode = digits.join("");
    return transactionCode;
}

function decodeTransactionId(transactionIdStr) {
    // Convert the transactionIdStr to a decimal number
    var transactionId = 0;
    for (var i = 0; i < 3; i++) {
    // [O, I, D]
      transactionId += (transactionIdStr.charCodeAt(i) - 65) * (26 ** (2 - i));
    }
    
    return transactionId;
}

function encodeDate(dateStr) {
    // Extract the year, month, and day from the dateStr
    var year = dateStr.slice(0, 2); // 23
    var month = dateStr.slice(2, 4); // 03
    var day = dateStr.slice(4); // 20
    
    // Convert the year to a single digit (0-9)
    var yearDigit = parseInt(year) % 10;
    
    // Convert the month to a char (A-Z)
    var monthChar = String.fromCharCode(parseInt(month) + 64);
    
    // Got the 1st digit of day
    var dayDigitOne =  day.charAt(0);
    
    // match dayDigit 0-3 to E-H instead of A-Z
    var dayCharOne = String.fromCharCode(parseInt(dayDigitOne) + 69);
    
    // Got the 2nd digit of day
    var dayDigTwo =  day.charAt(1);
    
    // Convert 0-9 to I-R
    var dayCharTwo = String.fromCharCode(parseInt(dayDigTwo) + 73);
    
    // Concatenate the year digit, month char, and day code
    var code = `${yearDigit}${monthChar}${dayCharOne}${dayCharTwo}`;

    return code;
  }
  

//   function decodeDate(code) {
//     // Extract the year digit, month char, and day code from the code
//     var yearDigit = parseInt(code.charAt(0));
//     var month = code.charAt(1);
//     var dayDigit = parseInt(code.charAt(2));
//     var dayCode = code.charAt(3);
    
//     // Convert the year digit back to a two-digit year
//     var year = `${parseInt(new Date().getFullYear().toString().slice(0, 1))}${yearDigit}`;
    
//     // Convert the month char back to a two-digit month
//     var monthNum = month.charCodeAt(0) - 64;
//     var monthStr = (monthNum < 10) ? `0${monthNum}` : `${monthNum}`;
    
//     // Convert the day code back to a two-digit day
//     var day = ((dayCode.charCodeAt(0) - 58) + dayDigit).toString().padStart(2, "0");
    
//     // Concatenate the year, month, and day to form the date string
//     var dateStr = `${year}${monthStr}${day}`;
//     return dateStr;
//   }
  

/* storeId: 0-200
 * transactionId: 0-10000
 * date: when the code is issued
 */
function generateShortCode(storeId, transactionId) {
    var dateStr = getDateStr(new Date()); // 230313
    var storeIdStr = padCodeLength(storeId, 3); // 175
    var transactionIdStr = padCodeLength(transactionId, 4); // 9675
    
    var encodedStoreId = encodeStoreId(storeIdStr); // 0-9+A-Z
    var encodedTransactionId = encodeTransactionId(transactionIdStr); // A-Z+A-Z+A-Z
    var encodedDate = encodeDate(dateStr); // 
    
    return encodedStoreId + encodedTransactionId + encodedDate;
}

function decodeShortCode(shortCode) {
    return {
        storeId: decodeStoreId(shortCode.slice(0, 2)),
        shopDate: new Date(),
        transactionId: decodeTransactionId(shortCode.slice(2, 5))
    };
}

// ------------------------------------------------------------------------------//
// --------------- Don't touch this area, all tests have to pass --------------- //
// ------------------------------------------------------------------------------//
function RunTests() {

    var storeIds = [175, 42, 0, 9]
    var transactionIds = [9675, 23, 123, 7]

    storeIds.forEach(function (storeId) {
        transactionIds.forEach(function (transactionId) {
            var shortCode = generateShortCode(storeId, transactionId);
            var decodeResult = decodeShortCode(shortCode);
            $("#test-results").append("<div>" + storeId + " - " + transactionId + ": " + shortCode + "</div>");
            AddTestResult("Length <= 9", shortCode.length <= 9);
            AddTestResult("Is String", (typeof shortCode === 'string'));
            AddTestResult("Is Today", IsToday(decodeResult.shopDate));
            AddTestResult("StoreId", storeId === decodeResult.storeId);
            AddTestResult("TransId", transactionId === decodeResult.transactionId);
        })
    })
}

function IsToday(inputDate) {
    // Get today's date
    var todaysDate = new Date();
    // call setHours to take the time out of the comparison
    return (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0));
}

function AddTestResult(testName, testResult) {
    var div = $("#test-results").append("<div class='" + (testResult ? "pass" : "fail") + "'><span class='tname'>- " + testName + "</span><span class='tresult'>" + testResult + "</span></div>");
}