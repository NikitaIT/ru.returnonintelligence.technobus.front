const days = ['sunday', 'monday', 'tuesday', 'tednesday', 'thursday', 'friday', 'saturday'];
/**
 * Установка языка сайта
 * @param {string} lang Пользовательская локаль
 */
function setLanguage(lang) {
	$.getJSON(`lang/${lang}.json`, function (data) {
		$.each(data, function (key, val) {
			$(`[name = ${key}]`).html(val);
		});
});}
$(function(){
	// Установка времени показа заставки
	$(".preloader").delay(1000).fadeOut("slow");
	
	// Отрисовка боковой панели 
	(function(){
		let strDOM = "";
		days.forEach(function (day, i) {
			strDOM+= `<div class="panel--button panel--button-${i} day-${day}">
						<span name="${day}"></span>
					</div>`;
		});
		$(".panel").append(strDOM);
	})();
});
/**
 * Модуль установки событий работы с свичём
 * @param {[[Type]]} function ( [[Description]]
 */
$(function () {
    $(".russian").button('toggle');
    $(".russian").click(function () {
        setLanguage("ru");
        $('#map').attr('lang','ru');
    });
	$(".russian").click();
    $(".english").click(function () {
        setLanguage("en");
        $('#map').attr('lang','en');
    });
	$(".lang").addClass("btn-group-vertical");
	$(".lang").removeClass("btn-group");
    $(".to_technopolis").button('toggle');
	$(".to_technopolis").click(function () {
			$("#route0").css("visibility", "visible");
			$("#route0").css("position", "initial");
			$("#route1").css("visibility", "hidden");
			$("#route1").css("position", "absolute");
    });
	$(".from_technopolis").click(function () {
        $("#route0").css("visibility", "hidden");
			$("#route0").css("position", "absolute");
			$("#route1").css("visibility", "visible");
			$("#route1").css("position", "initial");
    });

});
/**
 * Модуль работы с датой
 * @param   {[[Type]]} function ( [[Description]]
 * @returns {[[Type]]} [[Description]]
 */
$(function () {
	/**
	 * Установка текущей даты, поиск следующей даты в таблице
	 * @returns {[[Type]]} [[Description]]
	 */
	function setDate() {
		let options = {
			hour: 'numeric',
			minute: 'numeric'
		};
		function getWeekDay(date) {
			return days[date.getDay()];
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