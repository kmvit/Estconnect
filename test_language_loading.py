#!/usr/bin/env python
"""
Скрипт для тестирования загрузки языков Django
Имитирует то, что делает Django при загрузке переводов
"""
import os
import sys
import django
from pathlib import Path

# Настройка Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Estconnect.settings')
django.setup()

from django.utils import translation
from django.conf import settings

def test_language_loading():
    """Тестирует загрузку каждого языка"""
    print("Тестирование загрузки языков...\n")
    
    for lang_code, lang_name in settings.LANGUAGES:
        print(f"Тестирование языка: {lang_code} ({lang_name})")
        try:
            # Пытаемся активировать язык
            translation.activate(lang_code)
            print(f"  ✓ Язык {lang_code} успешно загружен")
            translation.deactivate()
        except Exception as e:
            print(f"  ❌ ОШИБКА при загрузке языка {lang_code}:")
            print(f"     {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
        print()

if __name__ == '__main__':
    test_language_loading()

