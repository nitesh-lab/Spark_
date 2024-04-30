"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getCurrentDateTimeAsString() {
    const currentDate = new Date();
    // Extract individual components
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    // Create the formatted date-time string
    const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return dateTimeString;
}
exports.default = getCurrentDateTimeAsString;
//# sourceMappingURL=getTime.js.map