#!/usr/bin/env python
"""
Скрипт для тестирования загрузки переводов на сервере
Запустить на сервере: python test_server_translations.py
"""
import os
import sys
from pathlib import Path

# Добавляем путь к проекту
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Estconnect.settings')

import django
django.setup()

from django.utils import translation
from django.conf import settings
from django.utils.translation import gettext as _

def test_all_languages():
    """Тестирует загрузку каждого языка"""
    print("=" * 60)
    print("ТЕСТИРОВАНИЕ ЗАГРУЗКИ ЯЗЫКОВ")
    print("=" * 60)
    print()
    
    results = {}
    
    for lang_code, lang_name in settings.LANGUAGES:
        print(f"Тестирование: {lang_code} ({lang_name})")
        try:
            # Пытаемся активировать язык
            translation.activate(lang_code)
            
            # Пытаемся использовать перевод
            test_string = _("логотип")
            
            print(f"  ✓ Успешно загружен")
            print(f"    Тестовый перевод: '{test_string}'")
            
            translation.deactivate()
            results[lang_code] = "OK"
            
        except ValueError as e:
            if "EXPRESSION" in str(e) or "plural form" in str(e).lower():
                print(f"  ❌ ОШИБКА Plural-Forms: {e}")
                results[lang_code] = f"ERROR: {e}"
            else:
                print(f"  ❌ ОШИБКА: {e}")
                results[lang_code] = f"ERROR: {e}"
        except Exception as e:
            print(f"  ❌ НЕОЖИДАННАЯ ОШИБКА: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
            results[lang_code] = f"ERROR: {e}"
        
        print()
    
    print("=" * 60)
    print("РЕЗУЛЬТАТЫ:")
    print("=" * 60)
    for lang_code, result in results.items():
        status = "✓" if result == "OK" else "❌"
        print(f"{status} {lang_code}: {result}")
    
    return results

def check_locale_directories():
    """Проверяет наличие директорий локалей"""
    print()
    print("=" * 60)
    print("ПРОВЕРКА ДИРЕКТОРИЙ ЛОКАЛЕЙ")
    print("=" * 60)
    print()
    
    locale_dir = Path(settings.LOCALE_PATHS[0])
    print(f"Базовая директория: {locale_dir}")
    print()
    
    for lang_code, lang_name in settings.LANGUAGES:
        # Django нормализует zh-hans в zh_Hans
        normalized = lang_code.replace('-', '_')
        lang_dir = locale_dir / normalized / 'LC_MESSAGES'
        
        po_file = lang_dir / 'django.po'
        mo_file = lang_dir / 'django.mo'
        
        print(f"{lang_code} ({lang_name}):")
        print(f"  Ожидаемая директория: {normalized}")
        print(f"  PO файл: {'✓' if po_file.exists() else '✗'} {po_file}")
        print(f"  MO файл: {'✓' if mo_file.exists() else '✗'} {mo_file}")
        
        if po_file.exists():
            # Проверяем Plural-Forms
            try:
                with open(po_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if 'Plural-Forms' in content:
                        import re
                        match = re.search(r'"Plural-Forms:\s*([^"]+)"', content)
                        if match:
                            plural_forms = match.group(1)
                            if 'EXPRESSION' in plural_forms or 'INTEGER' in plural_forms:
                                print(f"  ⚠ ПРОБЛЕМА: Найдено шаблонное значение в Plural-Forms!")
                            else:
                                print(f"  Plural-Forms: {plural_forms[:50]}...")
            except Exception as e:
                print(f"  ⚠ Ошибка при чтении файла: {e}")
        
        print()

if __name__ == '__main__':
    check_locale_directories()
    print()
    test_all_languages()

