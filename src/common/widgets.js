export function getRandomId() {
    const random = function () {
        return (((1+Math.random()) * 0x10000)|0).toString(16).substring(1);
    };
    return (random()+random()+"-"+random()+"-"+random()+"-"+random()+"-"+random()+random()+random());
}

export function getSeconds(timeObject) {
    if (typeof timeObject === 'undefined') {
        return 0;
    }
    return ((timeObject.hours * 60) * 60) + (timeObject.minutes * 60) + timeObject.seconds
}
export function getTimeString(seconds, minutes, hours) {
    return String(hours).padStart(2, '0') + ":" + String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
}
Date.prototype.getDateString = function () {
    const dd = String(this.getDate()).padStart(2, '0'),
        mm = String(this.getMonth() + 1).padStart(2, '0'),
        yyyy = String(this.getFullYear()).padStart(2, '0');

    return dd + '.' + mm + '.' + yyyy;
};