#!/usr/bin/env python
"""
Скрипт для загрузки данных о недвижимости из JSON файла в базу данных
Поддерживает выбор файла и типа недвижимости через аргументы командной строки
"""
import os
import sys
import django
import json
import argparse
from decimal import Decimal

# Добавляем путь к проекту в sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Estconnect.settings')
django.setup()

from locations.models import Country, City
from developers.models import ConstructionObject, ConstructionObjectImage
from users.models import CustomUser


def load_properties_from_json(json_file, property_type='house'):
    """
    Загружает данные о недвижимости из JSON файла в базу данных
    
    Args:
        json_file (str): Путь к JSON файлу
        property_type (str): Тип недвижимости ('house' для домов, 'apartment' для квартир)
    """
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Получаем страну с ID = 1
        try:
            country = Country.objects.get(id=1)
            print(f"Используем страну: {country.name}")
        except Country.DoesNotExist:
            print("Ошибка: Страна с ID = 1 не найдена")
            return
        
        # Получаем пользователя-застройщика (берем первого с ролью developer)
        try:
            developer = CustomUser.objects.filter(role='developer').first()
            if not developer:
                print("Ошибка: Не найден пользователь с ролью 'developer'")
                return
            print(f"Используем застройщика: {developer.get_full_name() or developer.username}")
        except Exception as e:
            print(f"Ошибка при получении застройщика: {e}")
            return
        
        created_objects = []
        skipped_objects = []
        errors = []
        total_processed = 0
        
        property_type_display = "домов" if property_type == 'house' else "квартир"
        print(f"Загружаем {property_type_display}...")
        
        for item in data:
            total_processed += 1
            try:
                construction_data = item.get('construction_object', {})
                
                # Получаем название города
                city_name = construction_data.get('city')
                if not city_name:
                    print(f"Пропускаем объект '{construction_data.get('name', 'Без названия')}': город не указан")
                    continue
                
                # Ищем или создаем город
                city, city_created = City.objects.get_or_create(
                    name=city_name,
                    country=country
                )
                
                if city_created:
                    print(f"Создан новый город: {city_name}")
                
                # Проверяем, существует ли уже объект с таким названием и городом
                existing_object = ConstructionObject.objects.filter(
                    name=construction_data.get('name'),
                    city=city
                ).first()
                
                if existing_object:
                    print(f"Объект '{construction_data.get('name')}' уже существует в городе {city_name}, пропускаем")
                    skipped_objects.append(f"{construction_data.get('name')} ({city_name})")
                    continue
                
                # Обрабатываем project_status
                project_status = construction_data.get('project_status')
                if project_status == 'null' or project_status is None:
                    project_status = 'in_progress'
                
                # Создаем объект недвижимости
                construction_object = ConstructionObject(
                    name=construction_data.get('name'),
                    developer=developer,
                    country=country,
                    city=city,
                    district=None,  # district не нужен
                    property_type=property_type,  # используем переданный тип
                    comfort_type=construction_data.get('comfort_type'),
                    amenities=construction_data.get('amenities'),
                    ownership_type=construction_data.get('ownership_type'),
                    area=construction_data.get('area', 0),
                    floors=construction_data.get('floors'),
                    project_status=project_status,  # обработанный статус
                    description=construction_data.get('description'),
                    price_per_sqm=construction_data.get('price_per_sqm'),
                    completion_date=construction_data.get('completion_date'),
                    address=construction_data.get('address'),
                    documentations_link=construction_data.get('documentations_link'),
                    is_published=True  # всегда True
                )
                
                construction_object.save()
                created_objects.append(construction_object.name)
                print(f"✓ Создан объект: {construction_object.name} в городе {city_name}")
                
                # Добавляем изображения (если есть)
                images = item.get('images', [])
                for image_url in images:
                    # Создаем запись об изображении (без самого файла)
                    ConstructionObjectImage.objects.create(
                        construction_object=construction_object,
                        image=image_url  # Это будет путь к файлу
                    )
                
                if images:
                    print(f"  Добавлено {len(images)} изображений")
                
            except Exception as e:
                error_msg = f"Ошибка при обработке объекта '{construction_data.get('name', 'Без названия')}': {e}"
                errors.append(error_msg)
                print(f"✗ {error_msg}")
        
        print(f"\n=== Результаты загрузки {property_type_display} ===")
        print(f"Всего обработано объектов: {total_processed}")
        print(f"Создано новых объектов: {len(created_objects)}")
        print(f"Пропущено существующих объектов: {len(skipped_objects)}")
        print(f"Ошибок: {len(errors)}")
        
        if created_objects:
            print(f"\nСозданные объекты:")
            for obj_name in created_objects:
                print(f"  - {obj_name}")
        
        if skipped_objects:
            print(f"\nПропущенные объекты (уже существуют):")
            for obj_name in skipped_objects:
                print(f"  - {obj_name}")
        
        if errors:
            print(f"\nОшибки:")
            for error in errors:
                print(f"  - {error}")
                
    except FileNotFoundError:
        print(f"Ошибка: Файл {json_file} не найден")
    except json.JSONDecodeError:
        print(f"Ошибка: Неверный формат JSON в файле {json_file}")
    except Exception as e:
        print(f"Ошибка при чтении файла: {e}")


def main():
    """
    Основная функция
    """
    parser = argparse.ArgumentParser(description='Загрузка объектов недвижимости из JSON файла в базу данных')
    parser.add_argument('--file', '-f', 
                        default='parsing_utils/parse_villas.json',
                        help='Путь к JSON файлу (по умолчанию: parsing_utils/parse_villas.json)')
    parser.add_argument('--type', '-t', 
                        choices=['house', 'apartment'], 
                        default='house',
                        help='Тип недвижимости: house (дом) или apartment (квартира) (по умолчанию: house)')
    
    args = parser.parse_args()
    
    json_file = args.file
    property_type = args.type
    
    property_type_display = "домов/вилл" if property_type == 'house' else "квартир"
    
    print(f"=== Загрузка {property_type_display} из JSON файла ===")
    print(f"Файл: {json_file}")
    print(f"Тип недвижимости: {property_type}")
    
    # Проверяем существование файла
    if not os.path.exists(json_file):
        print(f"Ошибка: Файл {json_file} не найден")
        return
    
    load_properties_from_json(json_file, property_type)


if __name__ == '__main__':
    main() 