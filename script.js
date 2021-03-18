const sendForm = document.getElementById('SendForm');

let payment_arr = [['Дата', 'Ежемесячный платёж, руб.', 'Погашение процентов, руб.', 'Погашение кредита, руб.', 'Остаток долга, руб.']];


function reFreshPayment_arr() {
    payment_arr = [['Дата', 'Ежемесячный платёж, руб.', 'Погашение процентов, руб.', 'Погашение кредита, руб.', 'Остаток долга, руб.']];
}



sendForm.addEventListener('submit', function (e) { /* !!! ЭТА ФУН. ОБРАБ. СОБЫТИЕ SUBMIT*/

    e.preventDefault(); /*//!!! ОЧЕНЬ ВАЖНАЯ ИНСТРУКЦИЯ - "НЕ ПЕРЕЗАГРУЖАЙ СТРАНИЦУ!"*/
    
    let name_in = document.getElementsByTagName("input")[3].value;
    let phone_in = document.getElementsByTagName("input")[4].value;
    
    if( !((""!=name_in)&&(""!=phone_in)) ){
        alert("Необходимо заполнить обязательные для отправки поля");
        return 0;
    }

    const formData = new FormData(this); /*formData - объект хранящий данные формы*/

    countCreditWrite();
    formData.append('Payment', JSON.stringify(payment_arr));

    //    console.log(this);

    let phpStatus = "";

    fetch('SendData.php', {

        method: 'post',
        body: formData

    }).then(function (response) {


        return response.text();

    }).then(function (text) {

        console.log(text);
        phpStatus = text;// в файле SendData.php генерируется состояние заявки 
        /*
        000 - отказ базы данных(невверные данные входа, не получается войти) , сообщение на почту не отправлено
        001 - отказ базы данных(невверные данные входа, не получается войти) , сообщение отправлено на почту
        010 - не бывает
        100 - есть доступ к базе, данные не вставились в таблицу, сообщение на почту не отправлено
        101 - есть доступ к базе, данные не вставились в таблицу,  сообщение отправлено на почту
        110 - есть доступ к базе, данные вставилиьс в таблицу, сообщение на почту не отправлено
        111 - есть доступ к базе, данные вставилиьс в таблицу,сообщение отправлено на почту        
        */

        if ((phpStatus == "111") || (phpStatus == "101")||(phpStatus == "001")) {

            alert("Ваша заявка успешно принята.");

        } else {
            alert("Ваша заявка не доставлена.");
        }

    }).catch(function (err) {
        console.error(err);
    });

});


function addRowToArr(_date, monthPay, lobeRePay, loanRePay, balance) {

    payment_arr.push([_date, monthPay, lobeRePay, loanRePay, balance]);

}


function fullTable() {

    let ins_str = "";

    for (let i = 1; i < payment_arr.length; i++) {
        ins_str += `<tr> <td class="td_centr">${ payment_arr[i][0] }</td> <td class="td_end">${payment_arr[i][1]}</td> <td class="td_end">${payment_arr[i][2]}</td> <td class="td_end">${payment_arr[i][3]}</td> <td class="td_end">${payment_arr[i][4]}</td</tr>`;
    }

    return ins_str;

    //    VyatkaWin.document.write('<tr> <td class="td_centr">' + _date + '</td> <td class="td_end">' + monthPay + '</td> <td class="td_end">' + lobeRePay + '</td> <td class="td_end">' + loanRePay + '</td> <td class="td_end">' + balance + '</td</tr>');

}

function div(val, by) {
    return (val - val % by) / by;
}

function countIfFill() {
    let sumStr = document.getElementsByTagName("input")[0].value;
    let periodStr = document.getElementsByTagName("input")[1].value;
    let percentStr = document.getElementsByTagName("input")[2].value;

    if (("" == sumStr) || ("" == periodStr) || ("" == percentStr)) {
        //        alert("Необходимо заполнить обязательные для построения графика поля");

        MonthPay.value = "";
        AllProcents.value = "";
        StartDate.value = "";

        FinishDate.value = "";

        return 0; // не считать если одни из полей не заполнено
    }

    sumStr = sumStr.replace(/[ ]/g, '');
    percentStr = percentStr.replace(/[,]/g, '.');

    const sum = Number.parseInt(sumStr);
    let period = Number.parseInt(periodStr);
    let percent = Number.parseFloat(percentStr);

    period *= 12;
    percent = percent / 1200;

    const monthPay = sum * (percent + percent / (Math.pow((percent + 1), period) - 1)); //Math.pow((percent + 1),period)

    let In, S, Sn1, Sn2;

    Sn2 = sum;
    //    Sn1 = sum ;

    Data = new Date();

    let Year = Data.getFullYear();
    const curMonth = Data.getMonth() + 1;
    const curDay = Data.getDate();
    //
    const startDate = formatDateTable(curDay, curMonth + 1, Year); // первый платёж

    let relMonth, absMonth, absMonthPrev, bestDate;
    //
    let allPercents = 0;
    //
    absMonth = curMonth + 1; // для года

    for (let i = 0; i < (period - 1); i++) {


        In = Sn2 * percent; // проценты
        Sn1 = Sn2;
        S = monthPay - In;
        Sn2 = Sn1 - S;

        allPercents += In;


        // дата

        relMonth = (i % 12) + 1;
        absMonthPrev = absMonth;
        absMonth = (curMonth + relMonth - 1) % 12 + 1;
        Year += div(absMonthPrev, 12);
    }

    let i = period - 1;

    In = Sn2 * percent;
    Sn1 = Sn2;
    S = monthPay - In;
    Sn2 = Math.abs(Sn1 - S); // убрать отрицательный нолик

    allPercents += In;

    relMonth = (i % 12) + 1;
    absMonthPrev = absMonth;
    absMonth = (curMonth + relMonth - 1) % 12 + 1;

    Year += div(absMonthPrev, 12);


    bestDate = formatDateTable(curDay, absMonth, Year);


    MonthPay.value = (monthPay.toFixed(2)).replace(/[.]/, ',');
    AllProcents.value = (allPercents.toFixed(2)).replace(/[.]/, ',');
    StartDate.value = startDate.toString();

    FinishDate.value = bestDate;

}


function formatDateTable(dd, mm, yyyy) {

    if (dd < 10) dd = '0' + dd;

    if (mm < 10) mm = '0' + mm;

    return dd + '.' + mm + '.' + yyyy;
}


function countCreditWrite() {

    reFreshPayment_arr();

    let sumStr = document.getElementsByTagName("input")[0].value;
    let periodStr = document.getElementsByTagName("input")[1].value;
    let percentStr = document.getElementsByTagName("input")[2].value;

    sumStr = sumStr.replace(/[ ]/g, '');
    percentStr = percentStr.replace(/[,]/g, '.');

    const sum = Number.parseInt(sumStr);
    let period = Number.parseInt(periodStr);
    let percent = Number.parseFloat(percentStr);

    period *= 12;
    percent = percent / 1200;

    const monthPay = sum * (percent + percent / (Math.pow((percent + 1), period) - 1)); //Math.pow((percent + 1),period)

    let In, S, Sn1, Sn2;

    Sn2 = sum;
    //    Sn1 = sum ;

    Data = new Date();

    let Year = Data.getFullYear();
    const curMonth = Data.getMonth() + 1;
    const curDay = Data.getDate();

    let relMonth, absMonth, absMonthPrev, diffYear, bestDate;

    let allPercents = 0;

    absMonth = curMonth + 1; // для года

    for (let i = 0; i < (period); i++) {


        In = Sn2 * percent; // проценты
        Sn1 = Sn2;
        S = monthPay - In;
        Sn2 = Math.abs(Sn1 - S);

        allPercents += In;


        // дата

        relMonth = (i % 12) + 1;
        absMonthPrev = absMonth;
        absMonth = (curMonth + relMonth - 1) % 12 + 1;
        //        diffYear = div((i + curMonth), 12);
        Year += div(absMonthPrev, 12);


        bestDate = formatDateTable(curDay, absMonth, Year);

        payment_arr.push([bestDate, (monthPay.toFixed(2)).replace(/[.]/, ','),
            (In.toFixed(2)).replace(/[.]/, ','), (S.toFixed(2)).replace(/[.]/, ','), (Sn2.toFixed(2)).replace(/[.]/, ',')]);

    }

    payment_arr.push(["Итого", ((period * monthPay).toFixed(2)).replace(/[.]/, ','),
        (allPercents.toFixed(2)).replace(/[.]/, ','), (sum.toFixed(2)).replace(/[.]/, ','), ""]);

}

function addTableToDoc() {

    //    payment_arr;

    if (null != document.getElementById("table_id")) {

        //    let parent = document.getElementById("main_id");
        //    let child = document.getElementById("table_id");
        //    parent.removeChild(child);

        document.getElementById("table_id").remove();
        document.getElementById("div_table_id").remove();
        reFreshPayment_arr()
    }

    countCreditWrite();

    let div = document.createElement('div');
    div.className = "table_cred";
    div.id = "div_table_id";

    let str_inner = '<table border="1" id = "table_id"> <tr> <th>Дата</th> <th>Ежемесячный платеж, руб.</th> <th>Погашение процентов, руб.</th> <th>Погашение кредита, руб.</th> <th>Остаток долга, руб.</th> </tr>';

    //    div.innerHTML = '<table border="1"> <tr> <th>Дата</th> <th>Ежемесячный платеж, руб.</th> <th>Погашение процентов, руб.</th> <th>Погашение кредита, руб.</th> <th>Остаток долга, руб.</th> </tr> <tr> <td class="td_centr">654654</td> <td class="td_end">165165</td> <td class="td_end">19191</td> <td class="td_end">615165</td> <td class="td_end"></td> </tr>';

    //    const fullTableRESULT = fullTable();
    str_inner += fullTable();

    str_inner += "</table>"

    div.innerHTML = "";
    div.innerHTML = str_inner;

    //    console.log(str_inner);
main_id = document.getElementById("main_id");
    main_id.append(div);
}

function tableCreate() {

    //    VyatkaWin.document.write('<table border="1">');
    //    VyatkaWin.document.write('<tr> <th>Дата</th> <th>Ежемесячный платеж, руб.</th> <th>Погашение процентов, руб.</th> <th>Погашение кредита, руб.</th> <th>Остаток долга, руб.</th</tr>');
    //    VyatkaWin.document.write('</table>');


    addTableToDoc();

}

function buildGraph() {

    let sumStr = document.getElementsByTagName("input")[0].value;
    let periodStr = document.getElementsByTagName("input")[1].value;
    let percentStr = document.getElementsByTagName("input")[2].value;

    if (("" == sumStr) || ("" == periodStr) || ("" == percentStr)) {
        alert("Необходимо заполнить обязательные для построения графика поля");

        return 0;
    }


    //    myWin = open("", "displayWindow",
    //        "width=1000,height=600,scrollbars=yes");
    //    myWin.document.open();
    //
    //    myWin.document.write('<!DOCTYPE html><html lang="ru"><head> <meta charset="UTF-8"> <title>График погашения кредита</title> <style> table { table-layout: fixed; width: 700px; word-wrap: break-word; margin: auto; font-size: 18px; border-collapse: collapse; } .td_end { text-align: end; min-width: 60px; } .td_centr { text-align: center; min-width: 60px; } .butt_pos{position: relative;left:50%; transform: translate(-50%, 0); margin: 50px 0 50px 0;}</style><script> function close_wind(){ close();}</script></head>');
    //    myWin.document.write("<body>");
    //    myWin.document.write('<div>');
    //	


    tableCreate();


    ////    myWin.document.write("<button class='butt_pos' onclick='close_wind()'> Обратно к заявке</button>");
    //    myWin.document.write('</div>');
    //    myWin.document.write("</body></html>");
    //    
    //    document.write(myWin.document);
    //
    //    myWin.document.close();



}

function clear_value(obj_id, event) {
    code = (event.charCode) ? event.charCode : event.keyCode;
    if (code != 9 && code != 16) {
        document.getElementById(obj_id).value = '';
    }
}


function format_price(e) {

    var target = e.target || e.srcElement;
    target.value = target.value.replace(/[^0-9]/g, '');

    var cursorPos = get_cursor_position(target);
    if (cursorPos == -1) {
        cursorPos = 0;
    }
    var deltaPos = 0;

    var lengthBefore = target.value.length;
    target.value = target.value.replace(/\s+/g, '').replace(/\s+$/, '');
    target.value = format_num(target.value);
    if (!deltaPos && (target.value.length - lengthBefore) > 0) {
        deltaPos = target.value.length - lengthBefore;
    }
    if (!deltaPos && target.value[cursorPos + deltaPos] == ' ' && target.value[cursorPos + deltaPos - 1] == ' ') {
        deltaPos += 2;
    }
    set_cursor_position(target, cursorPos + deltaPos);

    countIfFill();

    return true;
}

function maxYears(e) {
    var target = e.target || e.srcElement;

    target.value = target.value.replace(/[^0-9]/g, '');

    if (Number.parseInt(target.value) > 100) {
        target.value = "";
    }

    countIfFill();
}

function countSymbSting(Str, Sym) {

    let amo = (Str.split(Sym).length - 1);

    return amo;

}

function maxPercents(e) {
    var target = e.target || e.srcElement;


    target.value = target.value.replace(/^,/g, '');
    target.value = target.value.replace(/[^0-9,]/g, '');


    if (Number.parseInt(target.value) > 100) {
        target.value = "";
    }

    if (countSymbSting(target.value, ',') > 1) {
        target.value = "";
        //        var cursorPos = get_cursor_position(target);

        //        var str = "Hello World";
        //        target.value = target.value.slice(0, cursorPos) + str.slice(cursorPos+1);
    }

    countIfFill();

}

function fullName(e) {

    var target = e.target || e.srcElement;

    target.value = target.value.replace(/[^A-Za-zА-Яа-яЁё ]/g, '');

}

function telephone(e) {

    var target = e.target || e.srcElement;
    target.value = target.value.replace(/[^0-9+ ]/g, '');
}



function get_cursor_position(inputEl) {
    if (document.selection && document.selection.createRange) {
        var range = document.selection.createRange().duplicate();
        if (range.parentElement() == inputEl) {
            range.moveStart('textedit', -1);
            return range.text.length;
        }
    } else if (inputEl.selectionEnd) {
        return inputEl.selectionEnd;
    } else
        return -1;
}


function set_cursor_position(inputEl, position) {
    if (inputEl.setSelectionRange) {
        inputEl.focus();
        inputEl.setSelectionRange(position, position);
    } else if (inputEl.createTextRange) {
        var range = inputEl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', position);
        range.moveStart('character', position);
        range.select();
    }
}


function format_num(str) {
    var retstr = '';
    var now = 0;
    for (i = str.length - 1; i >= 0; i--) {
        if (now < 3) {
            now++;
            retstr = str.charAt(i) + retstr;
        } else {
            now = 1;
            retstr = str.charAt(i) + ' ' + retstr;
        }
    }
    return retstr;
}

function showApplyPage(){
    /*
    * делаем ленту заявок
    * */
    alert("Заглушка)))");
}

function uncheckAllRadio(name){
    let radioElem = document.getElementsByName(name);
    for (let i = 0; i<radioElem.length;i++){
        radioElem[i].checked=false;
    }
}
