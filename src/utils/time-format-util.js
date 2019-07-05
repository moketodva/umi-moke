import moment from 'moment/moment';


export const momentOfArrayToDateString = (obj, format) => {
    for (let key in obj) {
        if (obj[key] instanceof Array) {
            obj[key].forEach((item, index) => {
                if (item instanceof moment && index === 0) {
                    obj[key + 'Start'] = item.format(format && format[key] ? format[key] : 'YYYY-MM-DD');
                }
                if (item instanceof moment && index === 1) {
                    obj[key + 'End'] = item.format(format && format[key] ? format[key] : 'YYYY-MM-DD');
                }
            });
            delete obj[key];
        }
    }
};

export const momentOfObjToDateString = (obj, format) => {
    for (let key in obj) {
        if (obj[key] instanceof moment) {
            obj[key] = obj[key].format(format && format[key] ? format[key] : 'YYYY-MM-DD');
        }
    }
};

