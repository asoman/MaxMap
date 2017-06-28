




window.onload = function(){ 
	var map;
	YMaps.jQuery(function () {
        // Создает экземпляр карты и привязывает его к созданному контейнеру
        map = new YMaps.Map(YMaps.jQuery("#YMapsID")[0]);
            
        // Устанавливает начальные параметры отображения карты: центр карты и коэффициент масштабирования
        map.setCenter(new YMaps.GeoPoint(37.64, 55.76), 10);
    })
	
	
	document.getElementById('findadress').onclick = function() { 
		var adress = document.getElementById("adress").value;
		var geocoder = new YMaps.Geocoder(adress);
		
		YMaps.Events.observe(geocoder, geocoder.Events.Load, function () {
			if (this.length()) {
				//alert("Найдено :" + this.length());
				map.addOverlay(this.get(0));
				map.panTo(this.get(0).getGeoPoint());
			}else {
				alert("Ничего не найдено")
			}
		});
 
		YMaps.Events.observe(geocoder, geocoder.Events.Fault, function (error) {
			alert("Произошла ошибка: " + error.message)
		});
		
	}
	
	
};
