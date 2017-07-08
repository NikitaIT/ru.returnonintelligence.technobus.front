///переключатели
$(function () {
	new DG.OnOffSwitch({
		el: '#on-off-switch-notext'
	});
	new DG.OnOffSwitch({
		el: '#on-off-switch',
		textOn: 'Ru',
		textOff: 'En',
		listener: function (name, checked) {
			$("#listener-text").html("Listener called for " + name + ", checked: " + checked);
		}
	});
});
///вывод текущей даты
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
/// Отрисовка карты
$(function () {
	function init() {
		var myMap = new ymaps.Map('map', {
				center: [59.853876, 30.321102],
				zoom: 16
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
//заполнение таблицы
$(function () {
//	$.ajax({
//	  dataType: 'json',
//	  url: 'response.php?action=sample5',
//	  success: function(jsondata){
//		$('.results').html('Name = ' + jsondata.name + ', Nickname = ' + jsondata.nickname);
//	  }
//	});
 
 var jsonString =                      
    {"Расписание":
     [{
      "ThenGo": "Oт метро",
	  "tr": [                             
		{
          "hover": 8,
		  "td": [{"min":10,"dayOfWeek":"ПТ"},
                {"min":10,"dayOfWeek":"ПТ"}]
		},
		{
          "hover": 9,
		  "td": [{"min":10,"dayOfWeek":"ПТ"},
                {"min":10,"dayOfWeek":"ПТ"}]
		}
      ]
     },
      {
      "ThenGo": "К метро",
	  "tr": [                             
		{
          "hover": 8,
		  "td": [{"min":10,"dayOfWeek":"ПТ"},
                {"min":10,"dayOfWeek":"ПТ"}]
		},
		{
          "hover": 9,
		  "td": [{"min":10,"dayOfWeek":"ПТ"},
                {"min":10,"dayOfWeek":"ПТ"}]
		}
      ]}
     ]};
	for(var i=8;i<21;i++){
		var j = 10;
		jsonString.Расписание[0].tr.push({
          "hover": i,
		  "td": [{"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"},
                {"min":j++,"dayOfWeek":"ПТ"}]
		});
	}

	
	//	var cart = JSON.parse(jsonString );
//	commit 
	var timetableJSON =  jsonString;
	var timetable = $(".timetable")
	var string = "";
	function compareNumeric(a, b) {
		  return a - b;
		}
//	timetableJSON.Расписание.forEach(function (item, i, arr) {
//		string += '<tr><th class="timetable__header">' + item.ThenGo + '</th></tr>';
//		item.tr.forEach(function (item2, i, arr) {
//			string += '<tr style="background-color:silver" class="timetable__row">' +
//				'<td class="timetable__hover">' +
//				item2.hover +
//				'</td>';
//			item2.td.forEach(function (item3, i, arr) {
//				string += '<td style="background-color:orange" class="timetable__min ' +
//					item3.dayOfWeek + '">' +
//					item3.min + '</td>';
//			});
//			string += '</tr>';
//		});
//	});
	timetableJSON.Расписание.forEach(function (item, i, arr) {
		string += '<div class="timetable__row"><div class="timetable__header">' + item.ThenGo + '</div></div>';
		item.tr.forEach(function (item2, i, arr) {
			string += '<div class="timetable__row">' +
				'<div class="timetable__hover">' +
				item2.hover +
				'</div><div class="timetable__row--subrow">';
			item2.td.forEach(function (item3, i, arr) {
				string += '<div style="background-color:orange" class="timetable__min ' +
					item3.dayOfWeek + '">' +
					item3.min + '</div>';
			});
			string += '</div></div>';
		});
	});
	timetable.append(string);
});

$(function() {
		$('.timetable__row--subrow').slick({
			arrows: false,
			dots: false,
			infinite: false,
			variableWidth: true,
			speed: 200,
			slidesToScroll: 5,
			responsive: [
				{
				  breakpoint: 1024,
				  settings: {
					variableWidth: false,
					slidesToShow: 6,
					slidesToScroll: 4
				  }
				},
				{
				  breakpoint: 600,
				  settings: {
					variableWidth: false,
					slidesToShow: 5,
					slidesToScroll: 3
				  }
				},
				{
				  breakpoint: 480,
				  settings: {
					variableWidth: false,
					slidesToShow: 4,
					slidesToScroll: 3
				  }
				}
			 ]
	});
});

$(function() {  
    $(".timetable").niceScroll({cursorcolor:"#00F",horizrailenabled: false});
});