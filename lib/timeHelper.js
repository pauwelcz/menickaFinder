'use-strict';

function returnTodayAsObject() {
    const dateToday = new Date();
    return {
        day: dateToday.getDate(),
        month: dateToday.getMonth() + 1,
        year: dateToday.getFullYear(),
    };
}

exports.returnTodayAsObject = returnTodayAsObject;