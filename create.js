// Таблица должна содержать колонки (русскими буквами!)
// ФИО
// класс
// школа



var fs = require('fs');

var fragment = fs.readFileSync('fragment.fodt', 'utf-8');

var ryba     = fs.readFileSync(    'ryba.fodt', 'utf-8');


var femaleNames = require('./femalenames.js');
var   maleNames = require('./malenames.js');




//Тут обрабатываем таблицу


var csv = require('csv-array');
csv.parseCSV("participants.csv", function(data){
	console.log(data);
	writeResult(data);
});

function writeResult(participants){
	var array = '';

	for(var i = 0; i < participants.length; i++) {
		var person = participants[i];
		
		var name = person['ФИО'].trim();
		var names = name.split(/\s+/g);
		names[0] = (names[0] || '');
		names[1] = (names[1] || '');
		names[2] = (names[2] || '') + (names[3] || '');
		var FirstName = names[0];
		var SecondName = names[2];
		if (names[1].length + names[2].length >= 19) {
			// Имя и отчество не влезут на одну строку
			// NB: константу можно подпиливать
			FirstName = FirstName + ' ' + names[1];
		} else {
			SecondName = names[1] + ' ' + SecondName;
		}
		
		
		var gender; 
		if(/вич$/.test(names[2])){
			gender = 1;
		} else if(/вна$/.test(names[2])){
			gender = 0;
		} else if(femaleNames.indexOf(names[1]) !== -1){
			gender = 0;
		} else if(  maleNames.indexOf(names[1]) !== -1){
			gender = 1;
		} else {
			console.log('Не удалось определить пол: ');
			console.log(name);
			gender = 1;
		}
		
		
		var newfragment = fragment
			.replace('<template:FirstName/>' , FirstName )
			.replace('<template:SecondName/>', SecondName)
			.replace('<template:Gender/>', ['ца','к'][gender])
			.replace('<template:Class/>', person['класс'] || '___')
			.replace('<template:School/>', person['школа'] || '')
			.replace('<template:GenderPostfix/>', ['а',''][gender])
		;
		
		array+='\n'+newfragment;
	}

	var result = ryba.replace(
		'<template:page/>',
		array
	);




	fs.writeFileSync('result' + Date.now() + '.fodt', result);
}
