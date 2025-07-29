#!/usr/bin/env python
"""
Скрипт для извлечения городов из fixture и создания их в базе данных
"""
import os
import sys
import django
import json
from collections import defaultdict

# Добавляем путь к проекту в sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Estconnect.settings')
django.setup()

from locations.models import Country, City
from developers.models import ConstructionObject


def extract_cities_from_fixture(fixture_file):
    """
    Извлекает все уникальные города из fixture файла
    """
    cities_by_country = defaultdict(set)
    
    try:
        with open(fixture_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for item in data:
            if item.get('model') == 'developers.constructionobject':
                fields = item.get('fields', {})
                city_name = fields.get('city')
                country_id = fields.get('country')
                
                if city_name and country_id:
                    cities_by_country[country_id].add(city_name)
        
        return cities_by_country
    
    except FileNotFoundError:
        print(f"Ошибка: Файл {fixture_file} не найден")
        return {}
    except json.JSONDecodeError:
        print(f"Ошибка: Неверный формат JSON в файле {fixture_file}")
        return {}
    except Exception as e:
        print(f"Ошибка при чтении файла: {e}")
        return {}


def create_missing_cities(cities_by_country):
    """
    Создает недостающие города в базе данных
    """
    created_cities = []
    existing_cities = []
    
    for country_id, city_names in cities_by_country.items():
        try:
            country = Country.objects.get(id=country_id)
            print(f"\nОбрабатываем страну: {country.name}")
            
            for city_name in city_names:
                # Проверяем, существует ли город
                city, created = City.objects.get_or_create(
                    name=city_name,
                    country=country
                )
                
                if created:
                    created_cities.append(f"{city_name} ({country.name})")
                    print(f"  ✓ Создан город: {city_name}")
                else:
                    existing_cities.append(f"{city_name} ({country.name})")
                    print(f"  - Город уже существует: {city_name}")
        
        except Country.DoesNotExist:
            print(f"  ⚠ Страна с ID {country_id} не найдена в базе данных")
        except Exception as e:
            print(f"  ✗ Ошибка при создании города {city_name}: {e}")
    
    return created_cities, existing_cities


def main():
    """
    Основная функция
    """
    fixture_file = 'parsing_utils/construction_objects_fixture_new.json'
    
    print("=== Извлечение городов из fixture ===")
    cities_by_country = extract_cities_from_fixture(fixture_file)
    
    if not cities_by_country:
        print("Не удалось извлечь данные о городах")
        return
    
    print(f"Найдено {sum(len(cities) for cities in cities_by_country.values())} уникальных городов")
    
    print("\n=== Создание городов в базе данных ===")
    created_cities, existing_cities = create_missing_cities(cities_by_country)
    
    print("\n=== Результаты ===")
    print(f"Создано новых городов: {len(created_cities)}")
    print(f"Уже существовало городов: {len(existing_cities)}")
    
    if created_cities:
        print("\nСозданные города:")
        for city in created_cities:
            print(f"  - {city}")
    
    if existing_cities:
        print("\nУже существующие города:")
        for city in existing_cities:
            print(f"  - {city}")


if __name__ == '__main__':
    main() 