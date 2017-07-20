/**
 * Модуль работы с гугл таблицами
 */
$(function googleApi() {
	class API{
		constructor(tableViewer,url) {
			this.url = url;
			this.tableViewer = tableViewer;
			this.googleSpreadsheet = new GoogleSpreadsheet();
			if (localStorage.length==0 || localStorage.getItem(0)==null || localStorage.getItem(1)==null){
				this.saveToLocalStorage();
				console.log("first saveToLocalStorage()")
			} else {
				console.log("first showTimetable()")
				this.showTimetable();
				if(navigator.onLine) {
					console.log("onLine updateStorage()")
					this.updateStorage();
				};
			}
		}
		/**
		 * Запрашивает с апи гугла таблицу по урлу
		 * @param {string} url Адрес листа таблицы
		 * @param {function} fun Что с ней делает
		 */
		googleSpreadsheetLoad(url,fun){
			this.googleSpreadsheet.url(url);
			this.googleSpreadsheet.load(function (result) {
				console.log(`Загружен обьект:`,result);
				fun(result);
			});
		}
		/**
		 * Сохранение расписания в локальное хранилище
		 */
		saveToLocalStorage(){
			this.googleSpreadsheetLoad(url,(result)=>{
				console.log(result)
				localStorage.setItem(0,JSON.stringify(result));
				this.tableViewer.addTableList(result, 0);
			});
			this.googleSpreadsheetLoad(url + "&gid=1453141125",(result)=>{
				localStorage.setItem(1,JSON.stringify(result));
				this.tableViewer.addTableList(result, 1);
			});
			this.googleSpreadsheetLoad(url + "&gid=135110459",(result)=>{
				this.tableViewer.addInfoList(result);
			});
			localStorage.setItem('DATE',Date());
		}
		/**
		 * Обновление
		 */
		updateStorage(){
			this.tableViewer.cleanTableList();
			this.saveToLocalStorage();
		}
		showTimetable(){
			this.tableViewer.addTableList(JSON.parse(localStorage.getItem(0)), 0);
			this.tableViewer.addTableList(JSON.parse(localStorage.getItem(1)), 1);
		}
	}
	class TableViewer {
		constructor(timetableRowClass,infoClass) {
			this.timetableRowClass=timetableRowClass;
			this.infoClass = infoClass;
		}
		/**
	 * Добавляет информанию из таблицы
	 * @param {object}   infoJSON  Обьект
	 * @param {string} infoClass Класс в который добавляем
	 */
		addInfoList(infoJSON){
		console.log(`f: addTableList(infoJSON=`,
					infoJSON,
					`, infoClass= ${this.infoClass})`);
		let infoHtmlString = "";
		infoJSON.items.forEach(function (msg) {
			infoHtmlString+= `<p class="info-list--elem">
									<span class="info-list--elem__title">
										${msg.id}
									</span>
									${msg.info}
								</p>`;
		});
		$(this.infoClass).append(infoHtmlString);
	}
		/**
	 * Add table list in timetable
	 * @param   {object} timetableJSON     Data
	 * @param   {string} timetableRowClass Table DOM class
	 * @param   {number} id                Table list number
	 */
		addTableList(timetableJSON, id) {
		console.log(`f: addTableList(id=${id}, timetableJSON=`,
					timetableJSON,
					`, timetableRowClass= ${this.timetableRowClass})`);
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
		
		$(this.timetableRowClass).append(timetableRowHtmlString);
	}
		cleanTableList(){
			$(this.timetableRowClass).html("");
		}
		cleanInfoList(){
			$(this.infoClass).html("");
		}
	};
	let url = "https://docs.google.com/spreadsheet/pub?key=1VwgzSFxVRu2Z-9tvF8wimO2m3BmuW4ngcST5uGSRYRg&output=html";
	const tableViewer = new TableViewer(".timetable__row__all",".info-list");
	const apiObj = new API(tableViewer,url);
	setLanguage("ru");
});