/**
 * Модуль работы с датой
 */
$(function () {
	/**
	 * Установка текущей даты, поиск следующей даты в таблице
	 */
	function setDate() {
		let options = {
			hour: 'numeric',
			minute: 'numeric'
		};
		function getWeekDay(date) {
			return fullDays[date.getDay()];
		}
		let date = new Date();
		$(".day").attr('name', getWeekDay(date));
		$("time.current-time").html(date.toLocaleString('ru', options) + ' ');
		
		Number.prototype.div = function(by){
			return (this - this % by) / by;
		}
		let minTmp = date.getMinutes();
		minTmp = (minTmp>=10)?(minTmp.div(10)+1)+"0":"10";
		$(`.timetable__min:contains(${date.getHours()}:${minTmp})`).css('border', '2px solid green');
	}
	setDate();
	setInterval(setDate, 9000);
});