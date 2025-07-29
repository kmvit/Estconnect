#!/usr/bin/env python
"""
Универсальный скрипт для очистки базы данных
Поддерживает выбор типа очистки через аргументы командной строки
"""
import os
import sys
import django
import argparse

# Добавляем путь к проекту в sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Estconnect.settings')
django.setup()

from developers.models import ConstructionObject, ConstructionObjectImage
from locations.models import City


def clear_objects():
    """
    Очищает только объекты недвижимости и их изображения
    """
    objects_count = ConstructionObject.objects.count()
    images_count = ConstructionObjectImage.objects.count()
    
    print(f"Найдено объектов недвижимости: {objects_count}")
    print(f"Найдено изображений: {images_count}")
    
    if objects_count == 0 and images_count == 0:
        print("Объекты недвижимости отсутствуют")
        return 0, 0
    
    # Удаляем все изображения объектов
    if images_count > 0:
        ConstructionObjectImage.objects.all().delete()
        print("✓ Удалены все изображения объектов")
    
    # Удаляем все объекты недвижимости
    if objects_count > 0:
        ConstructionObject.objects.all().delete()
        print("✓ Удалены все объекты недвижимости")
    
    return objects_count, images_count


def clear_cities():
    """
    Очищает только города
    """
    cities_count = City.objects.count()
    
    print(f"Найдено городов: {cities_count}")
    
    if cities_count == 0:
        print("Города отсутствуют")
        return 0
    
    # Удаляем все города
    City.objects.all().delete()
    print("✓ Удалены все города")
    
    return cities_count


def clear_all():
    """
    Очищает все: объекты недвижимости, изображения и города
    """
    print("=== Полная очистка базы данных ===")
    
    # Сначала очищаем объекты (они зависят от городов)
    objects_count, images_count = clear_objects()
    
    # Затем очищаем города
    cities_count = clear_cities()
    
    return objects_count, images_count, cities_count


def main():
    """
    Основная функция
    """
    parser = argparse.ArgumentParser(description='Очистка базы данных')
    parser.add_argument('--type', '-t', 
                        choices=['objects', 'cities', 'all'], 
                        default='objects',
                        help='Тип очистки: objects (объекты), cities (города), all (всё) (по умолчанию: objects)')
    parser.add_argument('--confirm', '-y', 
                        action='store_true',
                        help='Автоматическое подтверждение без запроса')
    
    args = parser.parse_args()
    
    clear_type = args.type
    auto_confirm = args.confirm
    
    # Определяем, что будем очищать
    type_descriptions = {
        'objects': 'объекты недвижимости и изображения',
        'cities': 'города',
        'all': 'ВСЕ данные (объекты недвижимости, изображения и города)'
    }
    
    description = type_descriptions[clear_type]
    
    print(f"=== Очистка базы данных ===")
    print(f"Тип очистки: {description}")
    
    # Запрашиваем подтверждение, если не установлен флаг --confirm
    if not auto_confirm:
        response = input(f"Вы уверены, что хотите удалить {description}? (да/нет): ")
        
        if response.lower() not in ['да', 'yes', 'y', 'д']:
            print("Операция отменена")
            return
    
    try:
        if clear_type == 'objects':
            objects_count, images_count = clear_objects()
            
            print(f"\n=== Результаты очистки объектов ===")
            print(f"Удалено объектов: {objects_count}")
            print(f"Удалено изображений: {images_count}")
            
            # Проверяем результат
            remaining_objects = ConstructionObject.objects.count()
            remaining_images = ConstructionObjectImage.objects.count()
            
            print(f"Осталось объектов: {remaining_objects}")
            print(f"Осталось изображений: {remaining_images}")
            
            if remaining_objects == 0 and remaining_images == 0:
                print("✅ Объекты недвижимости успешно очищены")
            else:
                print("⚠️ Не все объекты были удалены")
        
        elif clear_type == 'cities':
            cities_count = clear_cities()
            
            print(f"\n=== Результаты очистки городов ===")
            print(f"Удалено городов: {cities_count}")
            
            # Проверяем результат
            remaining_cities = City.objects.count()
            
            print(f"Осталось городов: {remaining_cities}")
            
            if remaining_cities == 0:
                print("✅ Города успешно очищены")
            else:
                print("⚠️ Не все города были удалены")
        
        elif clear_type == 'all':
            objects_count, images_count, cities_count = clear_all()
            
            print(f"\n=== Результаты полной очистки ===")
            print(f"Удалено объектов: {objects_count}")
            print(f"Удалено изображений: {images_count}")
            print(f"Удалено городов: {cities_count}")
            
            # Проверяем результат
            remaining_objects = ConstructionObject.objects.count()
            remaining_images = ConstructionObjectImage.objects.count()
            remaining_cities = City.objects.count()
            
            print(f"Осталось объектов: {remaining_objects}")
            print(f"Осталось изображений: {remaining_images}")
            print(f"Осталось городов: {remaining_cities}")
            
            if remaining_objects == 0 and remaining_images == 0 and remaining_cities == 0:
                print("✅ База данных полностью очищена")
            else:
                print("⚠️ Не все данные были удалены")
                
    except Exception as e:
        print(f"Ошибка при очистке базы данных: {e}")


if __name__ == '__main__':
    main() 