const days = ['monday', 'tuesday', 'tednesday', 'thursday', 'friday', 'saturday','sunday'];
const fullDays = ['fullMonday', 'fullTuesday', 'fullTednesday', 'fullThursday', 'fullFriday', 'fullSaturday','fullSunday'];

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

UpUp.start({
  'content-url': 'index.html',
  'assets': ['/img/technopolis.jpg', '/css/main.min.css', '/lang/en.json', '/lang/ru.json','/js/scripts.min.js'],
  'service-worker-url': '/upup.sw.min.js'
});


    