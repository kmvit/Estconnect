#!/usr/bin/env python
"""
Скрипт для замены названий городов на их ID в fixture файле
"""
import os
import sys
import django
import json
from collections import defaultdict

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Estconnect.settings')
django.setup()

from locations.models import Country, City


def get_city_mapping():
    """
    Создает словарь для сопоставления названий городов с их ID
    """
    city_mapping = {}
    
    for city in City.objects.select_related('country').all():
        # Создаем ключ в формате "Название города"
        city_mapping[city.name] = city.id
        print(f"  {city.name} -> ID {city.id}")
    
    return city_mapping


def update_fixture_city_references(input_file, output_file, city_mapping):
    """
    Обновляет fixture файл, заменяя названия городов на их ID и исправляя null значения
    """
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        updated_count = 0
        not_found_cities = set()
        null_fixes = 0
        
        for item in data:
            if item.get('model') == 'developers.constructionobject':
                fields = item.get('fields', {})
                city_name = fields.get('city')
                
                # Исправляем null значения для обязательных полей
                if fields.get('project_status') is None:
                    fields['project_status'] = 'in_progress'
                    null_fixes += 1
                    print(f"  ✓ Исправлен null project_status -> 'in_progress'")
                
                # Исправляем строки "None" для числовых полей
                if fields.get('price_per_sqm') == 'None':
                    fields['price_per_sqm'] = None
                    null_fixes += 1
                    print(f"  ✓ Исправлен 'None' price_per_sqm -> null")
                elif isinstance(fields.get('price_per_sqm'), str) and fields.get('price_per_sqm') != 'None':
                    # Конвертируем строку с десятичным числом в целое число
                    try:
                        decimal_value = float(fields['price_per_sqm'])
                        fields['price_per_sqm'] = int(decimal_value)
                        null_fixes += 1
                        print(f"  ✓ Конвертирован price_per_sqm: {fields['price_per_sqm']} -> {int(decimal_value)}")
                    except (ValueError, TypeError):
                        print(f"  ⚠ Не удалось конвертировать price_per_sqm: {fields['price_per_sqm']}")
                
                if fields.get('area') == 'None':
                    fields['area'] = None
                    null_fixes += 1
                    print(f"  ✓ Исправлен 'None' area -> null")
                elif isinstance(fields.get('area'), str) and fields.get('area') != 'None':
                    # Конвертируем строку с десятичным числом в целое число
                    try:
                        decimal_value = float(fields['area'])
                        fields['area'] = int(decimal_value)
                        null_fixes += 1
                        print(f"  ✓ Конвертирован area: {fields['area']} -> {int(decimal_value)}")
                    except (ValueError, TypeError):
                        print(f"  ⚠ Не удалось конвертировать area: {fields['area']}")
                
                if city_name:
                    if city_name in city_mapping:
                        # Заменяем название города на ID
                        fields['city'] = city_mapping[city_name]
                        updated_count += 1
                        print(f"  ✓ Заменен: {city_name} -> ID {city_mapping[city_name]}")
                    else:
                        not_found_cities.add(city_name)
                        print(f"  ✗ Город не найден в базе: {city_name}")
        
        # Сохраняем обновленный файл
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        
        return updated_count, not_found_cities, null_fixes
    
    except FileNotFoundError:
        print(f"Ошибка: Файл {input_file} не найден")
        return 0, set(), 0
    except json.JSONDecodeError:
        print(f"Ошибка: Неверный формат JSON в файле {input_file}")
        return 0, set(), 0
    except Exception as e:
        print(f"Ошибка при обработке файла: {e}")
        return 0, set(), 0


def main():
    """
    Основная функция
    """
    input_file = 'parsing_utils/construction_objects_fixture_new.json'
    output_file = 'parsing_utils/construction_objects_fixture_updated.json'
    
    print("=== Получение сопоставления городов ===")
    city_mapping = get_city_mapping()
    
    if not city_mapping:
        print("Не найдено городов в базе данных")
        return
    
    print(f"\nНайдено {len(city_mapping)} городов в базе данных")
    
    print(f"\n=== Обновление fixture файла ===")
    print(f"Входной файл: {input_file}")
    print(f"Выходной файл: {output_file}")
    
    updated_count, not_found_cities, null_fixes = update_fixture_city_references(
        input_file, output_file, city_mapping
    )
    
    print(f"\n=== Результаты ===")
    print(f"Обновлено записей: {updated_count}")
    print(f"Исправлено null значений: {null_fixes}")
    
    if not_found_cities:
        print(f"Города не найдены в базе данных ({len(not_found_cities)}):")
        for city in sorted(not_found_cities):
            print(f"  - {city}")
    
    if updated_count > 0 or null_fixes > 0:
        print(f"\nФайл успешно обновлен: {output_file}")
        print("Теперь можно загрузить данные командой:")
        print(f"python manage.py loaddata {output_file}")


if __name__ == '__main__':
    main() 