#!/usr/bin/env python
"""
Проверка, откуда Django загружает переводы для zh-hans
"""
import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Estconnect.settings')

import django
django.setup()

from django.conf import settings
import django.utils.translation.trans_real as trans_real

print("=" * 60)
print("ОТКУДА DJANGO ЗАГРУЖАЕТ ПЕРЕВОДЫ")
print("=" * 60)
print()

lang_code = 'zh-hans'
normalized = lang_code.replace('-', '_')  # zh-hans -> zh_hans

print(f"Язык: {lang_code} (нормализованный: {normalized})")
print()

# 1. Проверяем LOCALE_PATHS
print("1. LOCALE_PATHS (наш проект):")
for locale_path in settings.LOCALE_PATHS:
    print(f"   {locale_path}")
    lang_dir = Path(locale_path) / normalized / 'LC_MESSAGES'
    po_file = lang_dir / 'django.po'
    mo_file = lang_dir / 'django.mo'
    print(f"      Ожидаемая директория: {lang_dir}")
    print(f"      PO файл: {'✓' if po_file.exists() else '✗'} {po_file}")
    print(f"      MO файл: {'✓' if mo_file.exists() else '✗'} {mo_file}")
print()

# 2. Проверяем системные переводы Django
print("2. Системные переводы Django (из установленных пакетов):")
django_path = Path(django.__file__).parent
django_locale = django_path / 'conf' / 'locale'
print(f"   Путь: {django_locale}")

for variant in [normalized, 'zh_Hans', 'zh-hans']:
    sys_lang_dir = django_locale / variant
    if sys_lang_dir.exists():
        print(f"   Найдена директория: {sys_lang_dir}")
        for po_file in sys_lang_dir.rglob('*.po'):
            print(f"      Файл: {po_file.name}")
            try:
                with open(po_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if 'Plural-Forms' in content:
                        import re
                        match = re.search(r'"Plural-Forms:\s*([^"]+)"', content)
                        if match:
                            plural = match.group(1)
                            if 'EXPRESSION' in plural or 'INTEGER' in plural:
                                print(f"         ❌ ПРОБЛЕМА: {plural[:50]}...")
                            else:
                                print(f"         Plural-Forms: {plural[:50]}...")
            except Exception as e:
                print(f"         ⚠ Ошибка: {e}")
print()

# 3. Проверяем порядок загрузки
print("3. Порядок загрузки переводов Django:")
print("   Django загружает переводы в следующем порядке:")
print("   1. Сначала из LOCALE_PATHS (наш проект)")
print("   2. Потом из всех INSTALLED_APPS (включая django.contrib.*)")
print("   3. Если в LOCALE_PATHS нет файлов, Django использует системные")
print()

# 4. Показываем, какие приложения могут иметь переводы
print("4. Приложения, которые могут иметь переводы:")
for app in settings.INSTALLED_APPS:
    if app.startswith('django.contrib'):
        try:
            app_module = __import__(app, fromlist=[''])
            app_path = Path(app_module.__file__).parent
            locale_dir = app_path / 'locale'
            if locale_dir.exists():
                if (locale_dir / normalized).exists() or (locale_dir / 'zh_Hans').exists():
                    print(f"   {app}: {locale_dir}")
        except:
            pass

print()
print("=" * 60)
print("РЕШЕНИЕ:")
print("=" * 60)
print("Если Django загружает переводы из системных директорий вместо проекта,")
print("убедитесь, что:")
print("1. Директория в проекте называется zh_hans (все маленькие)")
print("2. Файлы .po и .mo существуют в locale/zh_hans/LC_MESSAGES/")
print("3. LOCALE_PATHS правильно настроен (уже настроен)")

