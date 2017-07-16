
function getLanguage(lang) {
	$.getJSON('lang/' + lang + '.json', function (data) {

		$.each(data, function (key, val) {
			$('[name = ' + key + ']').html(val);
			//$('p:contains('+key+')').html(val);
		});
	});}


///переключатели
//$(function () {
//	new DG.OnOffSwitch({
//		el: '#on-off-switch-notext'
//	});
//	new DG.OnOffSwitch({
//		el: '#on-off-switch',
//		textOn: 'Ru',
//		textOff: 'En',
//		listener: function (name, checked) {
//			if (checked) {
//				getLanguage("ru");
//			} else {
//				getLanguage("en");
//			}
//		}
//	});
//});

$(function () {
    $(".russian").button('toggle');
    $(".russian").click(function () {
        getLanguage("ru");
    });
	$(".russian").click();
    $(".english").click(function () {
        getLanguage("en");
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
///вывод текущей даты
$(function () {
	function setDate() {
		var options = {
			hour: 'numeric',
			minute: 'numeric'
		};
		function getWeekDay(date) {
			var days = ['sunday', 'monday', 'tuesday', 'tednesday', 'thursday', 'friday', 'saturday'];
			return days[date.getDay()];
		}
		var date = new Date();
		//var time = date.toLocaleString('ru',options) +' '+getWeekDay(date).toUpperCase();
		//$("time.current-time").html(time);
		var time = date.toLocaleString('ru', options) + ' ';
		$("time.current-time").html(time);
		$(".day").attr('name', getWeekDay(date));

		
	}
	setDate();
	setInterval(setDate, 1000);
});
/// Отрисовка карты
$(function () {
	function init() {
		var places = {
			metro: [59.853876, 30.321102],
			technopolis: [59.818043, 30.327938],
            metro1: [59.850127, 30.321772],
            routeCenter: [59.835681, 30.322253]
		};
		var from = places.metro;
        var to = places.technopolis;
		var myMap = new ymaps.Map('map', {
				center: places.metro,
				zoom: 16
			}, {
				searchControlProvider: 'yandex#search'
			}),
			myPlacemark = new ymaps.Placemark(myMap.getCenter());

		myMap.geoObjects.add(myPlacemark);
        var myRoute; 

        function addRoute(from,to){
            ymaps.route([
            {
                point: from,
                type: 'viaPoint'
            },
            to,
            ]).then(function (route) {
                        myMap.geoObjects.add(myRoute = route);
                
        }, function (error) {
            alert('Возникла ошибка: ' + error.message);
            })
        };
        
        var routeButton = new ymaps.control.Button("Показать маршрут");
        
    
        routeButton.events
            .add('select', function () { 
            addRoute(from,to);
            myMap.setZoom(12);
            myMap.setCenter(places.routeCenter); 
            routeButton.data.set('content', "Скрыть маршрут");
            
        })
            .add('deselect', function () { 
            myRoute && myMap.geoObjects.remove(myRoute);
            routeButton.data.set('content', "Показать маршрут");
        });
        
        
        myMap.controls.add(routeButton, {float: 'left', maxWidth: 'auto'});
        
		myPlacemark.events
			.add('mouseenter', function (e) {
				// Ссылку на объект, вызвавший событие,
				// можно получить из поля 'target'.
				e.get('target').options.set('preset', 'islands#greenIcon');
			})
			.add('mouseleave', function (e) {
				e.get('target').options.unset('preset');
			})

       function changeRoute(){
            if (routeButton.isSelected()) {
                myRoute && myMap.geoObjects.remove(myRoute);
                addRoute(from,to);
            }
        };
        
		$("#from").click(function () {
			myMap.setCenter(places.technopolis);
            myPlacemark.geometry.setCoordinates(myMap.getCenter());
            from = places.technopolis;
            to= places.metro1;
            changeRoute(); 
            myMap.setZoom(16);
		});

		$("#to").click(function () {
			myMap.setCenter(places.metro);
			myPlacemark.geometry.setCoordinates(myMap.getCenter());
            from=places.metro;
            to=places.technopolis;
            changeRoute();
            myMap.setZoom(16);
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
	var url = "https://docs.google.com/spreadsheet/pub?key=1VwgzSFxVRu2Z-9tvF8wimO2m3BmuW4ngcST5uGSRYRg&output=html";
	var googleSpreadsheet = new GoogleSpreadsheet();

	googleSpreadsheet.url(url);

	googleSpreadsheet.load(function (result) {
		//$('#json').html(JSON.stringify(result));
		console.log(result);
		addTableList(result, ".timetable__row__all", 0);
	});
	var googleSpreadsheet = new GoogleSpreadsheet();
	googleSpreadsheet.url(url + "&gid=1453141125");
	googleSpreadsheet.load(function (result) {
		console.log(result);
		//$('#json').html(JSON.stringify(result));
		addTableList(result, ".timetable__row__all", 1);
	});
	setTimeout(initSlick, 1000);
	//setTimeout(tabSelect, 1000);
	/*
	Добавляет страницу таблицы
	*/
	function addTableList(timetableJSON, timetableRowClass, id) {
		var string = "";
		var mapMin = {
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
		string += '<div class="timetable__row__current" id="route' + id + '">';
		timetableJSON.items.forEach(function (item2, i, arr) {
			var minHtmlString = getMinHtmlString(item2);
			if (minHtmlString !== "") {
				string += '<div class="timetable__row">' +
					'<div class="timetable__hover " style="background: #FF9101">' +
					item2.id +
					'</div><hr class="line"/><div class="timetable__row--subrow">' +
					minHtmlString +
					'</div></div>';
                //console.log(item2.id,minHtmlString);
			}
		});
		string += '</div>';

		function getMinHtmlString(item2) {
			var string = "";
			for (var item3 in item2) {
				if (mapMin[item3] !== undefined) {
					string += '<div  class="timetable__min day' +
						item2[item3] + '">' + item2.id + ":" +
						mapMin[item3] + '</div>';
				}
			}
            console.log(string);
			return string;
            
		}
		$(timetableRowClass).append(string);
	}
	getLanguage("ru");
});

function initSlick() {
	$('.timetable__row--subrow').slick({
		arrows: false,
		dots: false,
		infinite: false,
		variableWidth: true,
		speed: 200,
		slidesToScroll: 7,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToScroll: 4
				}
				},
			{
				breakpoint: 600,
				settings: {
					slidesToScroll: 4
				}
				},
			{
				breakpoint: 480,
				settings: "unslick"
//				{
//					slidesToScroll: 2
//				}
				}
			 ]
	});
}
// Стили для переключения вкладок
//function tabSelect() {
//	$(".timetable__header").click(function () {
//		$(this).css('background', '#FEFCD7');
//		$(this).css('color', '#000');
//		if ($(this).attr('id') === 'to') {
//			$("#from").css('background', '#FEDEB7');
//			$("#from").css('color', '#D9A414');
//			$("#route0").css("visibility", "visible");
//			$("#route0").css("position", "initial");
//			$("#route1").css("visibility", "hidden");
//			$("#route1").css("position", "absolute");
//		} else {
//			$("#to").css('background', '#FEDEB7');
//			$("#to").css('color', '#D9A414');
//			//$("#route0").css('display', 'none');
//			//$("#route1").css('display', 'block');
//			$("#route0").css("visibility", "hidden");
//			$("#route0").css("position", "absolute");
//			$("#route1").css("visibility", "visible");
//			$("#route1").css("position", "initial");
//
//		}
//	});
//
//}

	//$(function() {  
	//    $(".timetable").niceScroll({cursorcolor:"#00F",horizrailenabled: false});
	//});