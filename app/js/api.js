/**
 * Модуль работы с гугл таблицами
 * @param   {[[Type]]} function ( [[Description]]
 * @returns {string}   [[Description]]
 */
$(function () {
	let url = "https://docs.google.com/spreadsheet/pub?key=1VwgzSFxVRu2Z-9tvF8wimO2m3BmuW4ngcST5uGSRYRg&output=html";
	/**
	 * Запрашивает с апи гугла таблицу по урлу
	 * @param {[[Type]]} url Адрес листа таблицы
	 * @param {[[Type]]} fun Что с ней делает
	 */
	function googleSpreadsheetLoad(url,fun){
		let googleSpreadsheet = new GoogleSpreadsheet();
		googleSpreadsheet.url(url);
		googleSpreadsheet.load(function (result) {
			console.log(`Загружен обьект:`,result);
			fun(result);
		});
	}
	googleSpreadsheetLoad(url,(result)=>addTableList(result, ".timetable__row__all", 0));
	googleSpreadsheetLoad(url + "&gid=1453141125",(result)=>addTableList(result, ".timetable__row__all", 1));
	googleSpreadsheetLoad(url + "&gid=135110459",(result)=>addInfoList(result,'.info-list'));
	/**
	 * Добавляет информанию из таблицы
	 * @param {object}   infoJSON  Обьект
	 * @param {[[Type]]} infoClass Класс в который добавляем
	 */
	function addInfoList(infoJSON, infoClass){
		let infoHtmlString = "";
		infoJSON.items.forEach(function (msg) {
			infoHtmlString+= `<p class="info-list--elem">
									<span class="info-list--elem__title">
										${msg.id}
									</span>
									${msg.info}
								</p>`;
		});
		$(infoClass).append(infoHtmlString);
	}
	/**
	 * Add table list in timetable
	 * @param   {object}   timetableJSON     Data
	 * @param   {string} timetableRowClass Table DOM class
	 * @param   {number} id                Table list number
	 * @returns {string}   [[Description]]
	 */
	function addTableList(timetableJSON, timetableRowClass, id) {
		console.log(`f: addTableList(id=${id}, timetableJSON=`,
					timetableJSON,
					`, timetableRowClass= ${timetableRowClass})`);
		const minMap = {
			"b": "00",
			"c": "05",
			"d": 10,
			"e": 15,
			"f": 20,
			"g": 25,
			"h": 30,
			"i": 35,
			"j": 40,
			"k": 45,
			"l": 50,
			"m": 55
		};
		let timetableRowHtmlString = `<div class="timetable__row__current" id="route${id}">`;
		timetableJSON.items.forEach(function (mins) {
			let minHtmlString = getMinHtmlString(mins);
			if (minHtmlString !== "") {
				timetableRowHtmlString += `<div class="timetable__row">
								<div class="timetable__hover">
									${mins.id}	
								</div>
								<hr class="line"/>
								<div class="timetable__row--subrow">
									${minHtmlString}
								</div>
							</div>`;
			}
		});
		timetableRowHtmlString += '</div>';
		
		/**
		 * Добавляет строку минут в таблицу
		 * @param   {object} mins Массив пар (Минуты:День,Id:Часы)
		 * @returns {string} Строковое представление в таблице
		 */
		function getMinHtmlString(mins) {
			let minsHtmlString = "";
			for (let min in mins) {
				if (minMap[min] == undefined) continue;
				minsHtmlString += `<div  class="timetable__min ${getDayClassName(mins[min])}">
								${mins.id}:${minMap[min]}
							</div>`;
			}
			return minsHtmlString;
			/**
			 * Добавляет класс дня недели
			 * @param   {string} tableDayName Название дня недели в таблице exel
			 * @returns {string}   Класс дня недели
			 */
			function getDayClassName(tableDayName){
				const daysInTable = ['Su', 'Mo', 'Tu', 'Te', 'Th', 'Fr', 'Sa','All'];
				let daysExtendtion = [...days,"All"];
				if(daysInTable.indexOf(tableDayName)===undefined){
					console.error(`tableDayName is undefined, 
									cur: ${tableDayName} 
									exp: ${daysExtendtion}
									`);
					return ' ';
				}
				return ' day-'+daysExtendtion[daysInTable.indexOf(tableDayName)];
			}
		}
		
		$(timetableRowClass).append(timetableRowHtmlString);
	}
	setLanguage("ru");
});