/**
 * Модуль отрисовка боковой панели 
 */
$(function(){
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