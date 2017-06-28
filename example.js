// Создание обработчика для события window.onLoad
        YMaps.jQuery(function () {
            // Создание экземпляра карты и его привязка к созданному контейнеру
            var map = new YMaps.Map(YMaps.jQuery("#YMapsID")[0]);

            // Установка для карты ее центра и масштаба
            map.setCenter(new YMaps.GeoPoint(37.64, 55.76), 10);

            // Создание группы объектов и добавление ее на карту
            var group = new YMaps.GeoObjectCollection();
            group.add(createPlacemark(new YMaps.GeoPoint(37.678514, 55.758255), 'Москва (Самокатная)', 'Москва, ул. Самокатная, дом 1, строение 21'));
            group.add(createPlacemark(new YMaps.GeoPoint(37.587398, 55.734172), 'Москва (Парк культуры)', 'Москва, ул. Тимура Фрунзе, 11 и ул. Льва Толстого, 16'));
            group.add(createPlacemark(new YMaps.GeoPoint(60.644555, 56.845209), 'Екатеринбург', 'Екатеринбург, ул. Гагарина, 8, офис 602'));
            group.add(createPlacemark(new YMaps.GeoPoint(30.406127143, 59.9590655815), 'Санкт-Петербург', 'Санкт-Петербург, Cвердловская набережная, дом 44, бизнес-центр «Бенуа» (4-6 эт.)'));
            group.add(createPlacemark(new YMaps.GeoPoint(30.749512, 46.459542), 'Одесса', 'Одесса, пр. Шевченко, дом 4-Д, офис 61'));
            group.add(createPlacemark(new YMaps.GeoPoint(30.598379, 50.45332), 'Киев', 'Киев, ул. Луначарского, 4'));
            group.add(createPlacemark(new YMaps.GeoPoint(34.095482, 44.949507), 'Симферополь', 'Симферополь, ул. Героев Аджимушкая, 6/13, второй этаж'));
            group.add(createPlacemark(new YMaps.GeoPoint(-122.348557, 37.578894), 'Burlingame', '3d floor, Suite 306, 330 Primrose Road Burlingame, CA 94010'));
            map.addOverlay(group);

            // Создание управляющего элемента "Путеводитель по офисам"
            map.addControl(new OfficeNavigator(group));
        });

        // Функия создания метки
        function createPlacemark (geoPoint, name, description) {
            var placemark = new YMaps.Placemark(geoPoint);
            placemark.name = name;
            placemark.description = description;

            return placemark;
        }

        // Управляющий элемент "Путеводитель по офисам", реализиует интерфейс YMaps.IControl
        function OfficeNavigator (offices) {

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
                    
                    // Формирование списка офисов
                    this._generateList();
                    
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

            // Пока "летим" игнорируем клики по ссылкам
            this.isFlying = 0;

            // Формирование списка офисов
            this._generateList = function () {
                var _this = this;
                
                // Для каждого объекта вызываем функцию-обработчик
                offices.forEach(function (obj) {
                    // Создание ссылки на объект
                    var li = YMaps.jQuery("<li><a href=\"#\">" + obj.name + "</a></li>"),
                        a = li.find("a"); 
                    
                    // Создание обработчика щелчка по ссылке
                    li.bind("click", function () {
                        if (!_this.isFlying) {
                            _this.isFlying = 1;
                            _this.map.panTo(obj.getGeoPoint(), {
                                flying: 1,
                                callback: function () {
                                    obj.openBalloon();
                                    _this.isFlying = 0;
                                }
                            });
                        }
                        return false;
                    });
                    
                    // Слушатели событий на открытие и закрытие балуна у объекта
                    YMaps.Events.observe(obj, obj.Events.BalloonOpen, function () {
                        a.css("text-decoration", "none");
                    });
                    
                    YMaps.Events.observe(obj, obj.Events.BalloonClose, function () {
                        a.css("text-decoration", "");
                    });
                    
                    // Добавление ссылки на объект в общий список
                    li.appendTo(_this.container);
                });
            };
        }