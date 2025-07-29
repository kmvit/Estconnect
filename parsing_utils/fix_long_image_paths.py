#!/usr/bin/env python
"""
Скрипт для сокращения длинных путей к изображениям в fixture
"""
import json
import re
import os


def shorten_image_path(path):
    """
    Сокращает путь к изображению, оставляя только основную часть
    """
    # Убираем префикс construction_objects/
    if path.startswith('construction_objects/'):
        path = path[21:]  # Убираем 'construction_objects/'
    
    # Если путь все еще слишком длинный, сокращаем его
    if len(path) > 80:
        # Разбиваем путь на части
        parts = path.split('_')
        
        # Берем первые части (название объекта)
        if len(parts) > 3:
            # Оставляем первые 3 части + расширение
            extension = os.path.splitext(path)[1]
            shortened = '_'.join(parts[:3]) + extension
            return f"construction_objects/{shortened}"
    
    return f"construction_objects/{path}"


def fix_fixture_file(input_file, output_file):
    """
    Исправляет длинные пути к изображениям в fixture файле
    """
    print(f"Обрабатываем файл: {input_file}")
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        fixed_count = 0
        
        for item in data:
            if item.get('model') == 'developers.constructionobjectimage':
                image_path = item.get('fields', {}).get('image', '')
                if image_path and len(image_path) > 80:
                    original_path = image_path
                    new_path = shorten_image_path(image_path)
                    item['fields']['image'] = new_path
                    fixed_count += 1
                    print(f"  Сокращен путь: {original_path[:50]}... -> {new_path}")
        
        # Сохраняем исправленный файл
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        
        print(f"✓ Исправлено {fixed_count} путей к изображениям")
        print(f"✓ Сохранен в файл: {output_file}")
        
    except Exception as e:
        print(f"✗ Ошибка при обработке файла: {e}")


def main():
    """
    Основная функция
    """
    input_file = 'parsing_utils/construction_objects_fixture_updated.json'
    output_file = 'parsing_utils/construction_objects_fixture_fixed.json'
    
    if not os.path.exists(input_file):
        print(f"Файл {input_file} не найден")
        return
    
    fix_fixture_file(input_file, output_file)
    
    print("\n=== Готово! ===")
    print("Теперь можно использовать исправленный файл для загрузки в базу данных.")


if __name__ == "__main__":
    main() 