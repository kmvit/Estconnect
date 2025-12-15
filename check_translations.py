#!/usr/bin/env python
"""
Скрипт для проверки всех файлов переводов на наличие проблем с Plural-Forms
"""
import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
LOCALE_DIR = BASE_DIR / 'locale'

def check_po_file(po_file_path):
    """Проверяет .po файл на наличие проблем с Plural-Forms"""
    issues = []
    try:
        with open(po_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Ищем строку Plural-Forms
        plural_forms_match = re.search(r'"Plural-Forms:\s*([^"]+)"', content)
        if plural_forms_match:
            plural_forms = plural_forms_match.group(1)
            
            # Проверяем на наличие шаблонных значений
            if 'EXPRESSION' in plural_forms or 'INTEGER' in plural_forms:
                issues.append(f"Найдено шаблонное значение в Plural-Forms: {plural_forms}")
            
            # Проверяем формат
            if not plural_forms.endswith('\\n'):
                issues.append(f"Отсутствует \\n в конце Plural-Forms: {plural_forms}")
            
            # Проверяем синтаксис
            if not re.match(r'^nplurals=\d+;\s*plural=[^;]+;$', plural_forms):
                issues.append(f"Неправильный формат Plural-Forms: {plural_forms}")
        else:
            issues.append("Не найдена строка Plural-Forms")
            
    except Exception as e:
        issues.append(f"Ошибка при чтении файла: {e}")
    
    return issues

def main():
    print("Проверка файлов переводов...\n")
    
    all_issues = {}
    
    # Проверяем все .po файлы в locale
    for lang_dir in LOCALE_DIR.iterdir():
        if lang_dir.is_dir():
            po_file = lang_dir / 'LC_MESSAGES' / 'django.po'
            if po_file.exists():
                print(f"Проверка: {po_file}")
                issues = check_po_file(po_file)
                if issues:
                    all_issues[str(po_file)] = issues
                    print(f"  ❌ Проблемы найдены:")
                    for issue in issues:
                        print(f"     - {issue}")
                else:
                    print(f"  ✓ Файл в порядке")
                print()
    
    if all_issues:
        print("\n" + "="*60)
        print("НАЙДЕНЫ ПРОБЛЕМЫ В СЛЕДУЮЩИХ ФАЙЛАХ:")
        print("="*60)
        for file_path, issues in all_issues.items():
            print(f"\n{file_path}:")
            for issue in issues:
                print(f"  - {issue}")
        return 1
    else:
        print("\n✓ Все файлы переводов в порядке!")
        return 0

if __name__ == '__main__':
    exit(main())

