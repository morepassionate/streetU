export function DataFormated(date) {
    var d = date.getDate();
    var m = date.getMonth() + 1; //Month from 0 to 11
    var y = date.getFullYear();
    let hora = date.getHours();
    let min = date.getMinutes();
    if (String(d).toString().length === 1) {
        d = `0${d}`;
    }
    if (String(m).toString().length === 1) {
        m = `0${m}`;
    }

    if (String(hora).toString().length === 1) {
        hora = `0${hora}`;
    }
    if (String(min).toString().length === 1) {
        min = `0${min}`;
    }
    return `${d}/${m}/${y}\n${hora}:${min}`;
}