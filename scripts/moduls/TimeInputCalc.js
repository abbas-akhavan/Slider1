//*Time Input Calc
let setCounterDate = (date) => {
    let DateParse = (string) => {
        let y = string.match(/[0-9]+(?=\/?)/g)[2];
        let m = string.match(/[0-9]+(?=\/?)/g)[0];
        let d = string.match(/[0-9]+(?=\/?)/g)[1];

        y = parseInt(y);
        m = parseInt(m);
        d = parseInt(d);
        let result = { year: y, mounth: m, day: d };
        return result;
    }
    date = DateParse(date);
    let countDownDate = new Date(date.year, date.mounth - 1, date.day).getTime();

    return remainingTime = () => {
        let now = new Date().getTime();
        let timeleft = countDownDate - now;
        let remTime = {
            days: Math.floor(timeleft / (1000 * 60 * 60 * 24)),
            hours: Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((timeleft % (1000 * 60)) / 1000)
        }
        Object.entries(remTime).filter((key, val) => {
            if (val < 0) remTime[key] = 0;
        })
        return remTime;
    }
}