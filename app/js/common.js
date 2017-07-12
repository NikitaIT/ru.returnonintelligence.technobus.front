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
    var options ={ 
        hour: 'numeric', 
        minute: 'numeric'
    };
			var date = new Date();
			var time = date.toLocaleString('ru',options) +' '+getWeekDay(date).toUpperCase();
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
$(function() {
	function init() {
        var places = {
            metro: [59.853876, 30.321102],
            technopolis: [59.818043, 30.327938]
        };
        var currentTab=places.metro;

		var myMap = new ymaps.Map('map', {
				center: currentTab,
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
      "ThenGo": "K Technopolis",
	  "tr": [                             
		{
          "hover": 7,
		  "td": [{"min":45,"dayOfWeek":"ПТ"}]
		},
		{
          "hover": 8,
		  "td": [{"min":0,"dayOfWeek":"ПТ"},
                {"min":10,"dayOfWeek":"ПТ"}]
		}
      ]
     },
      {
      "ThenGo": "От Technopolis",
	  "tr": [                             
		{
          "hover": 7,
		  "td": [{"min":45,"dayOfWeek":"ПТ"}
                ]
		},
		{
          "hover": 8,
		  "td": [{"min":0,"dayOfWeek":"ПТ"},
                {"min":10,"dayOfWeek":"ПТ"}]
		}
      ]}
     ]};
	for(var i=9;i<23;i++){
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
	


    string += '<div class="timetable__row"><div class="timetable__header__row"><div class="timetable__header" id="to">';
    string += timetableJSON.Расписание[0].ThenGo + '</div><div class="timetable__header" id="from">'+timetableJSON.Расписание[1].ThenGo+'</div></div></div><div class="timetable__row__all">';
    timetableJSON.Расписание.forEach(function (item, i, arr) {
        string += '<div class="timetable__row__current" id="route'+i+'">';
		item.tr.forEach(function (item2, i, arr) {
            string += '<div class="timetable__row">' +
				'<div class="timetable__hover " style="background: #FF9101">' +
				item2.hover +
				'</div><hr/><div class="timetable__row--subrow">';
			item2.td.forEach(function (item3, i, arr) {
				string += '<div  class="timetable__min ' +
					item3.dayOfWeek + '">' +item2.hover+":"+
                    String("0"+item3.min).substr(-2) + '</div>';
			});
			string += '</div></div>';
		});
        string += '</div>';
    });
    string += '</div>';
	timetable.append(string);

});

$(function() {
		$('.timetable__row--subrow').slick({
			arrows: false,
			dots: false,
			infinite: true,
			variableWidth: true,
			speed: 200,
			slidesToScroll: 7,
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
					slidesToScroll: 4
				  }
				},
				{
				  breakpoint: 480,
				  settings: {
					variableWidth: false,
					slidesToShow: 4,
					slidesToScroll: 4
				  }
				}
			 ]
	});
});

 // Стили для переключения вкладок
$(document).ready(function(){
        $(".timetable__header").click(function(){ 
            $(this).css('background', '#FEFCD7');
            $(this).css('color', '#B23302');
            if ($(this).attr('id')==='to')
                {
                    $("#from").css('background', '#FEDEB7');
                    $("#from").css('color', '#D9A414');
					$("#route0").css("visibility", "visible");
    				$("#route0").css("position", "initial");
                    $("#route1").css("visibility", "hidden");
    				$("#route1").css("position", "absolute");
                }
            else
                {
                    $("#to").css('background', '#FEDEB7');
                    $("#to").css('color', '#D9A414');
                    //$("#route0").css('display', 'none');
                    //$("#route1").css('display', 'block');
					$("#route0").css("visibility", "hidden");
    				$("#route0").css("position", "absolute");
                    $("#route1").css("visibility", "visible");
    				$("#route1").css("position", "initial");

                }
    }); 
    
}) 


  

//$(function() {  
//    $(".timetable").niceScroll({cursorcolor:"#00F",horizrailenabled: false});
//});