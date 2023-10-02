import Vue from "vue";

const frogTools = {
  formatDateTime(timestamp, showTime) {
    let date = new Date(+timestamp),
        month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear(),
        hours = '' + date.getHours(),
        minutes = '' + date.getMinutes(),
        seconds = '' + date.getSeconds();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;

    let dateFormated = [year, month, day].join('-');

    if (showTime) {
      dateFormated += ' ' + [hours, minutes, seconds].join(':');
    }

    return dateFormated;
  }
}

Vue.prototype.$frogTools = frogTools;

export default (context, inject) => {
  inject('frogTools', frogTools);
  context.$frogTools = frogTools;
}