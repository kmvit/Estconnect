import time
import requests
from django.core.management.base import BaseCommand
from django.db import transaction
from developers.models import ConstructionObject


class Command(BaseCommand):
    help = 'Геокодирует адреса объектов недвижимости и сохраняет координаты в базу данных'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=None,
            help='Ограничить количество объектов для обработки'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Показать что будет сделано без сохранения в базу'
        )

    def handle(self, *args, **options):
        limit = options['limit']
        dry_run = options['dry_run']

        # Получаем объекты без координат
        objects = ConstructionObject.objects.filter(
            address__isnull=False,
            address__gt='',
            latitude__isnull=True
        ).exclude(address='')

        if limit:
            objects = objects[:limit]

        total_objects = objects.count()
        self.stdout.write(f"Найдено {total_objects} объектов для геокодирования")

        if dry_run:
            self.stdout.write("Режим dry-run: изменения не будут сохранены")
            return

        success_count = 0
        error_count = 0

        for i, obj in enumerate(objects, 1):
            self.stdout.write(f"Обрабатываю объект {i}/{total_objects}: {obj.name}")

            try:
                coordinates = self.geocode_address(obj)
                
                if coordinates:
                    with transaction.atomic():
                        obj.latitude = coordinates['latitude']
                        obj.longitude = coordinates['longitude']
                        obj.save()
                    
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"✓ Координаты найдены: {coordinates['latitude']}, {coordinates['longitude']}"
                        )
                    )
                    success_count += 1
                else:
                    self.stdout.write(
                        self.style.WARNING("⚠ Координаты не найдены")
                    )
                    error_count += 1

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"✗ Ошибка: {str(e)}")
                )
                error_count += 1

            # Задержка между запросами
            time.sleep(1)

        self.stdout.write("\n" + "="*50)
        self.stdout.write(f"Геокодирование завершено!")
        self.stdout.write(f"Успешно: {success_count}")
        self.stdout.write(f"Ошибок: {error_count}")
        self.stdout.write(f"Всего: {total_objects}")

    def geocode_address(self, obj):
        """
        Геокодирует адрес объекта через OpenStreetMap Nominatim API
        """
        # Формируем полный адрес
        address_parts = []
        
        if obj.address:
            address_parts.append(obj.address.strip())
        
        if obj.city and obj.city.name:
            address_parts.append(obj.city.name)
        
        if obj.country and obj.country.name:
            address_parts.append(obj.country.name)

        if not address_parts:
            return None

        full_address = ', '.join(address_parts)

        try:
            # Запрос к Nominatim API
            response = requests.get(
                'https://nominatim.openstreetmap.org/search',
                params={
                    'q': full_address,
                    'format': 'json',
                    'limit': 1
                },
                headers={
                    'User-Agent': 'EstconnectApp/1.0'
                },
                timeout=10
            )

            if response.status_code == 200:
                data = response.json()
                
                if data and len(data) > 0:
                    result = data[0]
                    return {
                        'latitude': float(result['lat']),
                        'longitude': float(result['lon'])
                    }

        except requests.RequestException as e:
            self.stdout.write(f"Ошибка запроса: {e}")
        except (KeyError, ValueError) as e:
            self.stdout.write(f"Ошибка парсинга ответа: {e}")

        return None
