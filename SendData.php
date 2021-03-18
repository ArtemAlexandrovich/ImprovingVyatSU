<?php

function PayGraph_Create($filename,$arr){

    $text = '<!DOCTYPE html><html lang="ru"><head> <meta charset="UTF-8"> <title>График погашения кредита</title> <style> table { table-layout: fixed; width: 700px; word-wrap: break-word; margin: auto; font-size: 18px; border-collapse: collapse; } .td_end { text-align: end; min-width: 60px; } .td_centr { text-align: center; min-width: 60px; } </style></head><body> <table border="1"> <tr> <th>Дата</th> <th>Ежемесячный платеж, руб.</th> <th>Погашение процентов, руб.</th> <th>Погашение кредита, руб.</th> <th>Остаток долга, руб.</th> </tr> ';

    for($i=1;$i<count($arr);$i++ ){
        
        $date = $arr[$i][0];
        $pay = $arr[$i][1];
        $perc = $arr[$i][2];
        $main = $arr[$i][3];
        $duty = $arr[$i][4];
        
        $str = '<tr> <td class="td_centr">'.$date.'</td> <td class="td_end">'.$pay.'</td> <td class="td_end">'.$perc.'</td> <td class="td_end">'.$main.'</td><td class="td_end">'.$duty.'</td</tr>';
        
        $text .= $str;
        
    }


    $text .= '</table></body></html>';
    
    
    $f_hdl = fopen($filename, 'w');
    fwrite($f_hdl, $text);
    fclose($f_hdl);
     
}

function SendMail($FullName,$Phone,$Sum,$Years,$Percents,$MonthPay,$AllPercents,$StartDate,$FinishDate,$filename){
 
    $fio = mb_convert_encoding("ФИО: ","CP1251");
    $tel = mb_convert_encoding("Телефон: ","CP1251");
    $sum = mb_convert_encoding("Сумма кредита: ","CP1251");
    $years = mb_convert_encoding("Срок в годах: ","CP1251");
    $percents= mb_convert_encoding("Процентная ставка: ","CP1251");
    $monthPay= mb_convert_encoding("Ежемесячный платёж: ","CP1251");
    $аllPercents= mb_convert_encoding("Сумма выплаченных процентов: ","CP1251");
    $startDate= mb_convert_encoding("Дата первого платежа: ","CP1251");
    $finishDate= mb_convert_encoding("Дата последнего платежа: ","CP1251");
    
    
    $message = 
        $fio.$FullName."\r\n".
        $tel.$Phone."\r\n".
        $sum.$Sum."\r\n".
        $years.$Years."\r\n".
        $percents.$Percents."\r\n".
        $monthPay.$MonthPay."\r\n".
        $аllPercents.$AllPercents."\r\n".
        $startDate.$StartDate."\r\n".
        $finishDate.$FinishDate."\r\n".
        "==========="."\r\n";

    $to = 'maa.ofp@yandex.ru';
    $subject = mb_convert_encoding("Заявки","CP1251");
    $headers = 'From: to_@_Vyatka.com' . "\r\n";
    
    return mail($to, $subject, $message, $headers);  
        
}

function SendFileToEmail($to,$FullName,$Phone,$Sum,$Years,$Percents,$MonthPay,$AllPercents,$StartDate,$FinishDate,$filename){
    
    $fio = mb_convert_encoding("ФИО: ","CP1251");
    $tel = mb_convert_encoding(" телефон: ","CP1251");
    $sum = mb_convert_encoding(" сумма кредита: ","CP1251");
    $years = mb_convert_encoding(" срок в годах: ","CP1251");
    $percents= mb_convert_encoding(" процентная ставка: ","CP1251");
    $monthPay= mb_convert_encoding(" ежемесячный платёж: ","CP1251");
    $аllPercents= mb_convert_encoding(" сумма выплаченных процентов: ","CP1251");
    $startDate= mb_convert_encoding(" дата первого платежа: ","CP1251");
    $finishDate= mb_convert_encoding(" дата последнего платежа: ","CP1251");
    
    
    $message = 
        $fio.$FullName.";".
        $tel.$Phone.";".
        $sum.$Sum.";".
        $years.$Years.";".
        $percents.$Percents.";".
        $monthPay.$MonthPay.";".
        $аllPercents.$AllPercents.";".
        $startDate.$StartDate.";".
        $finishDate.$FinishDate.".".
        "==========="."\r\n";
    
    if ($to==""){
        $to = "maa.ofp@yandex.ru";
    }
    
//    $filename = "form.txt"; //Имя файла для прикрепления
//    $to = "maa.ofp@yandex.ru"; //Кому
    $from = "to_@_Vyatka.com"; //От кого
    $subject = "Test"; //Тема
//    $message = "Текстовое сообщение"; //Текст письма
    $boundary = "---"; //Разделитель
    /* Заголовки */
    $headers = "From: $from\nReply-To: $from\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"";
    $body = "--$boundary\n";
    /* Присоединяем текстовое сообщение */
    $body .= "Content-type: text/html; charset='utf-8'\n";
    $body .= "Content-Transfer-Encoding: quoted-printablenn";
    $body .= "Content-Disposition: attachment; filename==?utf-8?B?".base64_encode($filename)."?=\n\n";
    $body .= $message."\n";
    $body .= "--$boundary\n";
    $file = fopen($filename, "r"); //Открываем файл
    $text = fread($file, filesize($filename)); //Считываем весь файл
    fclose($file); //Закрываем файл
    /* Добавляем тип содержимого, кодируем текст файла и добавляем в тело письма */
    $body .= "Content-Type: application/octet-stream; name==?utf-8?B?".base64_encode($filename)."?=\n";
    $body .= "Content-Transfer-Encoding: base64\n";
    $body .= "Content-Disposition: attachment; filename==?utf-8?B?".base64_encode($filename)."?=\n\n";
    $body .= chunk_split(base64_encode($text))."\n";
    $body .= "--".$boundary ."--\n";
    return mail($to, $subject, $body, $headers); //Отправляем письмо
    
    
}

//$FullName = $_POST['FullName'];
//$Phone = $_POST['Phone'];


//$FullName = mb_convert_encoding($_POST['FullName'],"CP1251");
$FullName = $_POST['FullName'];
$Phone = $_POST['Phone'];
//$Phone = mb_convert_encoding($_POST['Phone'],"CP1251");

$Sum = $_POST['full_price'];
$Years = $_POST['Years'];
$Percents = $_POST['Percents'];
$MonthPay = $_POST['MonthPay'];
$AllPercents = $_POST['AllPercents'];
$StartDate = $_POST['StartDate'];
$FinishDate = $_POST['FinishDate'];
$GraphJSON = $_POST['Payment'];
$ToEmail = $_POST['ToEmail'];
 

$arr_graph = json_decode($GraphJSON);
//echo $GraphJSON;
//echo $arr_graph;

//echo "\r\n";
//echo "Проценты: ";
//echo $Percents;
//echo "\r\n";
//echo "Тип процентов: ".gettype($Percents);


//echo $GraphJSON;

//SendFileToEmail();



//foreach($arr_graph as $str_value){
//    foreach($str_value as $value){
//        echo $value;
//    }
//    echo "\r\n";
//}
//echo $_POST[0];
//echo $_POST[1];
//echo "Конец массива.";

$DB = "11";// 11 - подкл и добавл, 10 - подкл не добав, 00 - отказ БД. Данные для клиента

$mysql = new mysqli(
    "http://hermes.handyhost.ru:1500/ispmgr",
    "u104108_ivtstudent",
    "ivtstudent",
    "u104108_ivthack"
);
// обработка ошибки входа

if ($mysql->connect_errno) {
    $mysql->close();
    exit();
}



$mysql->query("INSERT INTO `Applications`(`name`,`phone`,`sum`,`years`,`percents`,`month_pay`,`all_percents`,`start_date`,`end_date`)
VALUES('$FullName','$Phone','$Sum','$Years','$Percents','$MonthPay','$AllPercents','$StartDate','$FinishDate' )");

// если вставка удалась, 

//echo "\r\n";
//echo $GraphJSON;


if(($mysql->affected_rows) == 1){
//    echo " строка добавлена ";
    $DB = "11";// строка добавлена
    
    // добавить график в бд
    $person_id = $mysql->insert_id;
//    echo $person_id."\r\n"; 
    
    $date =  mb_convert_encoding($arr_graph[0][0],"CP1251");
    $pay = mb_convert_encoding($arr_graph[0][1],"CP1251");
    $perc = mb_convert_encoding($arr_graph[0][2],"CP1251");
    $main = mb_convert_encoding($arr_graph[0][3],"CP1251");
    $duty = mb_convert_encoding($arr_graph[0][4],"CP1251");
    $mysql->query("INSERT INTO `Vyatka_persons_graphics`(`person_id`,`person_name`,`date`,`month_pay`,`month_percents`,`month_main`,`duty`)
    VALUES('$person_id','$FullName','$date','$pay','$perc','$main','$duty')"); 
    
    for($i=1;$i<(count($arr_graph)-1);$i++ ){
        
//        echo $arr_graph[$i][0];
        $date = $arr_graph[$i][0];
        $pay = $arr_graph[$i][1];
        $perc = $arr_graph[$i][2];
        $main = $arr_graph[$i][3];
        $duty = $arr_graph[$i][4];
        $mysql->query("INSERT INTO `Vyatka_persons_graphics`(`person_id`,`person_name`,`date`,`month_pay`,`month_percents`,`month_main`,`duty`)
        VALUES('$person_id','$FullName','$date','$pay','$perc','$main','$duty')"); 
        
    }
    
    $len = count($arr_graph)-1;
    $date =  mb_convert_encoding($arr_graph[$len][0],"CP1251");
    $pay = mb_convert_encoding($arr_graph[$len][1],"CP1251");
    $perc = mb_convert_encoding($arr_graph[$len][2],"CP1251");
    $main = mb_convert_encoding($arr_graph[$len][3],"CP1251");
    $duty = mb_convert_encoding($arr_graph[$len][4],"CP1251");
    $mysql->query("INSERT INTO `Vyatka_persons_graphics`(`person_id`,`person_name`,`date`,`month_pay`,`month_percents`,`month_main`,`duty`)
    VALUES('$person_id','$FullName','$date','$pay','$perc','$main','$duty')"); 
    
//    foreach($arr_graph as $row){
//        echo $row;
//        $mysql->query("INSERT INTO `Vyatka_persons_graphics`(`person_id`,`person_name`,`date`,`month_pay`,`month_percents`,`month_main`,`duty`)
//        VALUES('$person_id','$FullName','$row[0]','$row[1]','$row[2]','$row[3]','$row[4]')");
//        echo "Ошибка: ".$mysql->error."\r\n"; 
//    }
    
}
else{
    $DB = "10";// строка не добавилась
//    echo "Ошибка: ".$mysql->info."\r\n";
}

$mysql->close();


$stat_mes = "111";


$filename = "PayGraph.html";
PayGraph_Create($filename,$arr_graph);


if (SendFileToEmail($ToEmail,$FullName,$Phone,$Sum,$Years,$Percents,$MonthPay,$AllPercents,$StartDate,$FinishDate,$filename)){
    $stat_mes = $DB."1";// отправлено
}
else{
    $stat_mes = $DB."0"; // не отправлено
}

//var_dump($err_mes);

echo $stat_mes;// код состояния


?>