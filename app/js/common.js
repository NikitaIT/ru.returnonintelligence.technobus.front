$(function () {
	new DG.OnOffSwitch({
		el: '#on-off-switch-notext'
	});
	new DG.OnOffSwitch({
		el: '#on-off-switch',
		textOn: 'Sync On',
		textOff: 'Off',
		listener: function (name, checked) {
			$("#listener-text").html("Listener called for " + name + ", checked: " + checked);
		}
	});
});
$(function () {
	function setDate() {
			var date = new Date();
			var time = date.getHours() + ':' + date.getMinutes() + ' ' + getWeekDay(date).toUpperCase();
			$("time.current-time").html(time);

			function getWeekDay(date) {
				var days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
				return days[date.getDay()];
			}
		}
	setDate();
	setInterval(setDate,1000);
});
$(function () {
	function init() {
		var myMap = new ymaps.Map('map', {
				center: [55.755773, 37.617761],
				zoom: 9
			}, {
				searchControlProvider: 'yandex#search'
			}),
			myPlacemark = new ymaps.Placemark(myMap.getCenter());

		myMap.geoObjects.add(myPlacemark);

		myPlacemark.events
			.add('mouseenter', function (e) {
				// Ссылку на объект, вызвавший событие,
				// можно получить из поля 'target'.
				e.get('target').options.set('preset', 'islands#greenIcon');
			})
			.add('mouseleave', function (e) {
				e.get('target').options.unset('preset');
			});
	}
	ymaps.ready(init);
});