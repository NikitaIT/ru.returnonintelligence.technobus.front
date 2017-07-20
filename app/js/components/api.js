/**
 * Модуль работы с гугл таблицами
 */
$(function googleApi() {
	
	class GoogleSpreadsheet{
		constructor(key, spreadsheetId){
			this.key = key;
			this.spreadsheetId = spreadsheetId;
		}
		load(sheet,range,fun){
			const googleUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheet}!${range}?key=${key}`;
			console.log("get:",googleUrl);
			$.getJSON( googleUrl, fun);
		}
	}
	class API {
		constructor(tableViewer,googleSpreadsheet) {
			this.tableViewer = tableViewer;
			this.googleSpreadsheet = googleSpreadsheet;
			if (localStorage.length == 0 || localStorage.getItem(0) == null || localStorage.getItem(1) == null) {
				this.saveToLocalStorage();
				console.log("first saveToLocalStorage()")
			} else {
				console.log("first showTimetable()")
				try{
					this.showTimetable();
				} catch (err) {
					console.error("showTimetable: ",err);
				}
				
				if (navigator.onLine) {
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
		googleSpreadsheetLoad(sheet,range, fun) {
			this.googleSpreadsheet.load(sheet,range,function (result) {
				console.log(`Загружен обьект:`, result);
				fun(result);
			});
		}
		/**
		 * Сохранение расписания в локальное хранилище
		 */
		saveToLocalStorage() {
			this.googleSpreadsheetLoad("To Technopolis","A1:H100", (result) => {
				console.log(result)
				localStorage.setItem(0, JSON.stringify(result));
				this.tableViewer.addTableList(result, 0);
			});
			this.googleSpreadsheetLoad("From Technopolis","A1:H100", (result) => {
				localStorage.setItem(1, JSON.stringify(result));
				this.tableViewer.addTableList(result, 1);
			});
			this.googleSpreadsheetLoad("Объявления","A1:B10", (result) => {
				this.tableViewer.addInfoList(result);
			});
			localStorage.setItem('DATE', Date());
		}
		/**
		 * Обновление
		 */
		updateStorage() {
			this.tableViewer.cleanTableList();
			this.saveToLocalStorage();
		}
		showTimetable() {
			this.tableViewer.addTableList(JSON.parse(localStorage.getItem(0)), 0);
			this.tableViewer.addTableList(JSON.parse(localStorage.getItem(1)), 1);
		}
	}
	class TableViewer {
		constructor(timetableRowClass, infoClass) {
			this.timetableRowClass = timetableRowClass;
			this.infoClass = infoClass;
		}
		/**
		 * Добавляет информанию из таблицы
		 * @param {object}   infoJSON  Обьект
		 * @param {string} infoClass Класс в который добавляем
		 */
		addInfoList(infoJSON) {
			console.log(`f: addTableList(infoJSON=`,
				infoJSON,
				`, infoClass= ${this.infoClass})`);
			let infoHtmlString = "";
			infoJSON.values.shift();
			infoJSON.values.forEach(function (msg) {
				infoHtmlString += `<p class="info-list--elem">
										<span class="info-list--elem__title">
											${msg[0]}
										</span>
										${msg[1]}
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
			let timetableRowHtmlString = `<div class="timetable__row__current" id="route${id}">`;
			//console.log(JSON.stringify(timetableJSON.values));
			let timetable = timetableJSON.values;
			let timeSort = {};
			timetable.shift();
			timetable.forEach(function (mins,i) {
				let [hour,min] = mins[0].split(':');
				mins.shift();
				if(timeSort[hour]==undefined) timeSort[hour] = [];
				timeSort[hour].push({min,mins});
			});
			function compareHour(a, b) {
			  if (a.hour > b.hour) return 1;
			  if (a.hour < b.hour) return -1;
			}
			function compareMin(a, b) {
			  if (a.min > b.min) return 1;
			  if (a.min < b.min) return -1;
			}
			//timeSort = timeSort.sort(compareHour);
			for(let i=0;i<timeSort.length;i++){
				timeSort[i] = timeSort[i].sort(compareMin);
			}
			//console.log(JSON.stringify(timeSort));
			for(hour in timeSort){
				let minsHtmlString = getMinsHtmlString(hour,timeSort[hour]);
				if (minsHtmlString !== "") {
					timetableRowHtmlString += `<div class="timetable__row">
									<div class="timetable__hover">
										${hour}	
									</div>
									<hr class="line"/>
									<div class="timetable__row--subrow">
										${minsHtmlString}
									</div>
								</div>`;
				}
			}
			timetableRowHtmlString += '</div>';

			/**
			 * Добавляет строку минут в таблицу
			 * @param   {object} mins Массив пар (Минуты:День,Id:Часы)
			 * @returns {string} Строковое представление в таблице
			 */
			function getMinsHtmlString(hour,mins) {
				let minsHtmlString = "";
				mins.forEach(function (min,i) {
						minsHtmlString += `<div  class="timetable__min ${getDayClassName(min.mins)}">
									${hour}:${min.min}
								</div>`;
				});
				return minsHtmlString;
				/**
				 * Добавляет класс дня недели
				 * @param   {string} tableDayName Название дня недели в таблице exel
				 * @returns {string}   Класс дня недели
				 */
				function getDayClassName(tableDayName) {
					//console.log(tableDayName);
					let minDaysClassNames = "";
					let daysExtendtion = [...days, "All"];
					for(let i=0;i<tableDayName.length;i++){
						if(tableDayName[i]=="")  continue;
						minDaysClassNames += ' day-' + daysExtendtion[i];
					}
					if(tableDayName.length==5)minDaysClassNames+= ' day-All';
					return minDaysClassNames;
				}
			}

			$(this.timetableRowClass).append(timetableRowHtmlString);
		}
		cleanTableList() {
			$(this.timetableRowClass).html("");
		}
		cleanInfoList() {
			$(this.infoClass).html("");
		}
	};
	let url = "https://docs.google.com/spreadsheet/pub?key=1VwgzSFxVRu2Z-9tvF8wimO2m3BmuW4ngcST5uGSRYRg&output=html";
	const key = "AIzaSyC6gFH_bbSeMSIzEexKIUQ3MGE1MK2mBdo";
	const spreadsheetId = "1Xdje643qsnGXaOjU70larjh-UFTh6Bt9ii83a7t68Oo";
	const googleSpreadsheet = new GoogleSpreadsheet(key,spreadsheetId)
	const tableViewer = new TableViewer(".timetable__row__all", ".info-list");
	const apiObj = new API(tableViewer,googleSpreadsheet);
	setLanguage("ru");
});