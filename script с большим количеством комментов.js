




window.onload = function(){		//функция, которая вызывается когда страница полностью загружена
	var map;
	var points = new YMaps.GeoObjectCollection();	//Создаём голобальные переменные для карты и коллекции точек. Сразу инициализируем коллекцию.
	
	YMaps.jQuery(function () {		//Такой конструкцией из API открывается блок, позволяющий использовать Jquerry(удобный фреймворк для JS. Можешь погуглить.)
        // Создает экземпляр карты и привязывает его к созданному контейнеру
        map = new YMaps.Map(YMaps.jQuery("#YMapsID")[0]);
            
        // Устанавливает начальные параметры отображения карты: центр карты и коэффициент масштабирования
        map.setCenter(new YMaps.GeoPoint(37.64, 55.76), 10);
		map.enableScrollZoom();
    })
	
	var list = new adressList (); //создаём и инициализируем глобальную переменную для листа (объект, которые отвечает за вывод списка и его модификацию)
	
	document.getElementById('findadress').onclick = function() { 	//Находим элемент по айди и вешаем на него событие onclick
		var adress = document.getElementById("adress").value;	//достаём значение, которое ввели в поле
		var geocoder = new YMaps.Geocoder(adress);				//отправляем запрос геокодирования
		
		YMaps.Events.observe(geocoder, geocoder.Events.Load, function () {		//Вешаем обработчик на событие "ответа" от сервера. В данном случае ответа без ошибок. 
			if (this.length()) {		//Проверяем нашли ли что нибудь по адресу
				//alert("Найдено :" + this.length());
				var point = createPoint(this.get(0));	//первая строка результата поиска отправляется параметром в функцию
				points.add(point);		//добавляем адрес в контейнер
				list.addPoint(point);	//добавляем адрес в список
				map.addOverlay(points);	//отображаем все адреса на карте
			}else {
				alert("Ничего не найдено")
			}
		});
 
		YMaps.Events.observe(geocoder, geocoder.Events.Fault, function (error) {	//А это обработчик ответа от сервера с ошибкой
			alert("Произошла ошибка: " + error.message)
		});		
	}
	
	function createPoint(obj)		//функция, которая возвращает объект типа placemark
	{
		var point = new YMaps.Placemark(obj.getGeoPoint());
		point.name = obj.text;
		return point
	}
		
	function adressList () {		//а тут мы описываем класс листа
		
		this.container = document.getElementById('list')	//ссылка на элемент странице с id лист
		
		// Формирование списка адресов
		this.generateList = function () {	//функция заполнения листа данными из контейнера
			var _this = this;	//создаём ссылку на adressList
			// Для каждого объекта вызываем функцию-обработчик
			points.forEach(function (obj) {	//для каждого объекта из контейнера...	
				_this.addPoint(obj);	//...и ддля каждого вызываем функцию...
				});
				
			
		};
		
		this.addPoint = function (obj) {	//...которая добавляет объект с лист 
			var _this = this;
			
			var li = YMaps.jQuery("<li><a href=\"#\">" + obj.name + "</a></li>"),	//описываем тег <li>. В качестве текста вставляется имя объекта (сам адрес точки)
					a = li.find("a"); //Эм... ну это если честн сам не ебу зачем
				// Создание обработчика щелчка по ссылке
				li.bind("click", function () {	//вешаем обработчик на событие onclick по нашей строчке в листе
					points.remove(obj);		//удаляем объект из контейнера
					_this.container.innerHTML = "<ul></ul>";	//очищаем весь лист
					_this.generateList();		//заново его заполняем
					return false;
				});
				
				// Добавление ссылки на объект в общий список
				li.appendTo(_this.container);	//Добавляем тег в лист
		}
		
	}
	
};

 