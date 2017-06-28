




window.onload = function(){ 
	var map;
	var points = new YMaps.GeoObjectCollection();
	
	YMaps.jQuery(function () {
        // Создает экземпляр карты и привязывает его к созданному контейнеру
        map = new YMaps.Map(YMaps.jQuery("#YMapsID")[0]);
            
        // Устанавливает начальные параметры отображения карты: центр карты и коэффициент масштабирования
        map.setCenter(new YMaps.GeoPoint(37.64, 55.76), 10);
    })
	
	var list = new adressList ();
	map.addControl(list);
	
	document.getElementById('findadress').onclick = function() { 
		var adress = document.getElementById("adress").value;
		var geocoder = new YMaps.Geocoder(adress);
		
		YMaps.Events.observe(geocoder, geocoder.Events.Load, function () {
			if (this.length()) {
				//alert("Найдено :" + this.length());
				points.add(createPoint(this.get(0)));
				list.generateList();
				map.addOverlay(points);
				
				var test = "";
				points.forEach(function (obj) { test = test+obj.name;});
				alert(test);
			}else {
				alert("Ничего не найдено")
			}
		});
 
		YMaps.Events.observe(geocoder, geocoder.Events.Fault, function (error) {
			alert("Произошла ошибка: " + error.message)
		});		
	}
	
	function createPoint(obj)
	{
		var point = new YMaps.Placemark(obj.getGeoPoint());
		point.name = obj.text;
		return point
	}
		
	function adressList () {

		// Добавление на карту
		this.onAddToMap = function (map, position) {
			this.container = YMaps.jQuery("<ul></ul>")
			this.map = map;
			this.position = position || new YMaps.ControlPosition(YMaps.ControlPosition.TOP_RIGHT, new YMaps.Size(10, 10));

			// Выставление необходимых CSS-свойств
			this.container.css({
				position: "absolute",
				zIndex: YMaps.ZIndex.CONTROL,
				background: '#fff',
				listStyle: 'none',
				padding: '10px',
				margin: 0
			});
			
			// Формирование списка адресов
			this.generateList();
			
			// Применение позиции к управляющему элементу
			this.position.apply(this.container);
			
			// Добавление на карту
			this.container.appendTo(this.map.getContainer());
		}

		// Удаление с карты
		this.onRemoveFromMap = function () {
			this.container.remove();
			this.container = this.map = null;
		};
		
		// Формирование списка адресов
		this.generateList = function () {
			var _this = this;
			// Для каждого объекта вызываем функцию-обработчик
			points.forEach(function (obj) {
				// Создание ссылки на объект
				var li = YMaps.jQuery("<li><a href=\"#\">" + obj.name + "</a></li>"),
					a = li.find("a"); 
				// Создание обработчика щелчка по ссылке
				li.bind("click", function () {
					points.remove(obj);
					_this.generateList();
					return false;
				});
				
				// Добавление ссылки на объект в общий список
				li.appendTo(_this.container);
			});
		};
		
	}
	
};

 