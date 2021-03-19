<?php

/*
 * Коды ошибок базы данных
       000 - отказ базы данных(невверные данные входа, не получается войти) , сообщение на почту не отправлено
       001 - отказ базы данных(невверные данные входа, не получается войти) , сообщение отправлено на почту
       010 - не бывает
       100 - есть доступ к базе, данные не вставились в таблицу, сообщение на почту не отправлено
       101 - есть доступ к базе, данные не вставились в таблицу,  сообщение отправлено на почту
       110 - есть доступ к базе, данные вставилиьс в таблицу, сообщение на почту не отправлено
       111 - есть доступ к базе, данные вставилиьс в таблицу,сообщение отправлено на почту
       */

$TaskField = $_POST['solveField'];
$Task = $_POST['Task'];
$TaskCreator = $_POST['TaskCreator'];
$CreatorsAmount = $_POST['CreatorsAmount'];
$Material = $_POST['Material'];
$Education = $_POST['Education'];
$Finance = $_POST['Finance'];
$FormData = $_POST['FormDataJSON'];


$mysql = new mysqli(
    "localhost",
    "u104108_ivtstudent",
    "ivtstudent",
    "u104108_ivthack"
);
// обработка ошибки входа
//echo хакатоним;

$errMess = "000";
if ($mysql->connect_errno) {
    $mysql->close();
    echo (string)$mysql->connect_errno;
    exit();
}
//echo "FormData = ";
//echo $FormData;
//echo ";";
$RusMessage = "Мы устали на хакатоне...";

if (!empty($Material)){$TaskField = $Material;}
elseif(!empty($Education)){$TaskField = $Education;}
elseif (!empty($Finance)){$TaskField = $Finance;}
else{$TaskField = "";}

$mysql->query("INSERT INTO `Заявки`(
                     `Область задачи`,
                     `Описание задачи`,
                     `Создатель задачи`,
                     `Количество людей`)
VALUES('$TaskField','$Task' ,'$TaskCreator','$CreatorsAmount')");


// если вставка удалась, 

//echo "\r\n";
//echo $GraphJSON;


if(($mysql->affected_rows) == 1){
//    echo " строка добавлена ";
    $errMess = "111";
}


$mysql->close();

echo $errMess;// код состояния


?>