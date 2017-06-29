




window.onload = function(){ 
	var map;
	var points = new YMaps.GeoObjectCollection();
	
	YMaps.jQuery(function () {
        // Создает экземпляр карты и привязывает его к созданному контейнеру
        map = new YMaps.Map(YMaps.jQuery("#YMapsID")[0]);
            
        // Устанавливает начальные параметры отображения карты: центр карты и коэффициент масштабирования
        map.setCenter(new YMaps.GeoPoint(37.64, 55.76), 10);
		map.enableScrollZoom();
    })
	
	var list = new adressList ();
	
	document.getElementById('findadress').onclick = function() { 
		var adress = document.getElementById("adress").value;
		document.getElementById("adress").value = "";
		var geocoder = new YMaps.Geocoder(adress);
		
		YMaps.Events.observe(geocoder, geocoder.Events.Load, function () {
			if (this.length()) {
				//alert("Найдено :" + this.length());
				var point = createPoint(this.get(0));
				var isNew = true;
				points.forEach(function (obj) {if (point.name == obj.name) isNew = false});
				if(isNew) {
					points.add(point);
					list.addPoint(point);
					map.addOverlay(points);
				} else {
					alert("Данный адрес уже в списке");
				}
			}else {
				alert("Ничего не найдено")
			}
		});
 
		YMaps.Events.observe(geocoder, geocoder.Events.Fault, function (error) {
			alert("Произошла ошибка: " + error.message)
		});		
	}
	
	document.getElementById("form").addEventListener('keydown', function(event) {
		if(event.keyCode == 13) {
		   event.preventDefault();
		   document.getElementById('findadress').onclick();
		}
	});
	
	
	function createPoint(obj)
	{
		var point = new YMaps.Placemark(obj.getGeoPoint());
		point.name = obj.text;
		return point
	}
		
	function adressList () {
		
		this.container = document.getElementById('list')
		
		// Формирование списка адресов
		this.generateList = function () {
			var _this = this;
			// Для каждого объекта вызываем функцию-обработчик
			points.forEach(function (obj) {
				_this.addPoint(obj);
				});
				
			
		};
		
		this.addPoint = function (obj) {
			var _this = this;
			
			var li = YMaps.jQuery("<li><a href=\"#\">" + obj.name + "</a></li>"),
					a = li.find("a"); 
				// Создание обработчика щелчка по ссылке
				li.bind("click", function () {
					points.remove(obj);
					_this.container.innerHTML = "<ul></ul>";
					_this.generateList();
					return false;
				});
				
				// Добавление ссылки на объект в общий список
				li.appendTo(_this.container);
		}
		
	}
	
};

 