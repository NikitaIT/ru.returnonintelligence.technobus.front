$(window).load(function(){
	$(".preloader").delay(1000).fadeOut("slow");
});

function getLanguage(lang) {
	$.getJSON('lang/' + lang + '.json', function (data) {

		$.each(data, function (key, val) {
			$('[name = ' + key + ']').html(val);
			//$('p:contains('+key+')').html(val);
		});
});}
var days = ['sunday', 'monday', 'tuesday', 'tednesday', 'thursday', 'friday', 'saturday'];


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
        $('#map').attr('lang','ru');
    });
	$(".russian").click();
    $(".english").click(function () {
        getLanguage("en");
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
///вывод текущей даты
$(function () {
	(function(){
		var strDOM = "";
		days.forEach(function (day, i, arr) {
			strDOM+= '<div class="panel--button panel--button-'+i+' day-'+day+' ">'
					+'<span name="'+day+'"></span></div>';
		});
		$(".panel").append(strDOM);
	})();
	function setDate() {
		var options = {
			hour: 'numeric',
			minute: 'numeric'
		};
		function getWeekDay(date) {
			return days[date.getDay()];
		}
		var date = new Date();
		//var time = date.toLocaleString('ru',options) +' '+getWeekDay(date).toUpperCase();
		//$("time.current-time").html(time);
		var time = date.toLocaleString('ru', options) + ' ';
		var dayOfWeek = getWeekDay(date);
		$(".day").attr('name', dayOfWeek);
		$("time.current-time").html(time);
		var minTmp = date.getMinutes();
		Number.prototype.div = function(by){
			return (this - this % by) / by;
		}
		var tmp = (minTmp>=10)?(minTmp.div(10)+1)+"0":"10";
		console.log(tmp);
		$('.timetable__min:contains('+ date.getHours() + ':'+ tmp +')').css('border', '2px solid green');
	}
	setDate();
	setInterval(setDate, 9000);
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
        
        var routeButton = new ymaps.control.Button('<i class="fa fa-bus" style="color: dimgray"></i>');
        
    
        routeButton.events
            .add('select', function () { 
            addRoute(from,to);
            myMap.setZoom(12);
            myMap.setCenter(places.routeCenter);     
        })
            .add('deselect', function () { 
            myRoute && myMap.geoObjects.remove(myRoute);
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
        
		$(".from_technopolis").click(function () {
			myMap.setCenter(places.technopolis);
            myPlacemark.geometry.setCoordinates(myMap.getCenter());
            from = places.technopolis;
            to= places.metro1;
            changeRoute(); 
            myMap.setZoom(16);
		});

		$(".to_technopolis").click(function () {
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
	//setTimeout(initSlick, 1000);
	//setTimeout(tabSelect, 1000);
	/*
	Добавляет страницу таблицы
	*/
	function addTableList(timetableJSON, timetableRowClass, id) {
		console.log("f: addTableList(id="+id+")");
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
					'<div class="timetable__hover ">' +
					item2.id +
					'</div><hr class="line"/><div class="timetable__row--subrow">' +
					minHtmlString +
					'</div></div>';
                //console.log(item2.id,minHtmlString);
			}
		});
		string += '</div>';

		function getMinHtmlString(item2) {
			function getDayClassName(tableDayName){
				var daysInTable = ['Su', 'Mo', 'Tu', 'Te', 'Th', 'Fr', 'Sa','All'];
				if(tableDayName==='All'){
					var tmpStr = '';
					days.forEach(function (day, i, arr) {
						tmpStr +=' day-'+day;
					});
					return tmpStr + ' day-All';
				}
				
				if(daysInTable.indexOf(tableDayName)===undefined){
					console.error("tableDayName is undefined");
					return ' ';
				}
				return ' day-'+days[daysInTable.indexOf(tableDayName)];
			}
			var string = "";
			//console.log(item2)
			for (var item3 in item2) {
				if (mapMin[item3] !== undefined) {
					string += '<div  class="timetable__min ' +
						getDayClassName(item2[item3]) + '">' + item2.id + ":" +
						mapMin[item3] + '</div>';
				}
			}
			return string;
		}
		console.log($(timetableRowClass));
		$(timetableRowClass).append(string);
	}
	getLanguage("ru");
});

//function initSlick() {
//	$('.timetable__row--subrow').slick({
//		arrows: false,
//		dots: false,
//		infinite: false,
//		variableWidth: true,
//		speed: 200,
//		slidesToScroll: 7,
//		responsive: [
//			{
//				breakpoint: 1024,
//				settings: {
//					slidesToScroll: 4
//				}
//				},
//			{
//				breakpoint: 600,
//				settings: {
//					slidesToScroll: 4
//				}
//				},
//			{
//				breakpoint: 480,
//				settings: "unslick"
////				{
////					slidesToScroll: 2
////				}
//				}
//			 ]
//	});
//}
	//$(function() {  
	//    $(".timetable").niceScroll({cursorcolor:"#00F",horizrailenabled: false});
	//});