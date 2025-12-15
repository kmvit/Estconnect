#!/bin/bash
# Скрипт для поиска всех .po и .mo файлов с проблемными Plural-Forms
# Использование на сервере: ./find_bad_plural_forms.sh

echo "Поиск файлов с 'EXPRESSION' или 'INTEGER' в Plural-Forms..."
echo ""

# Поиск в .po файлах
echo "=== Поиск в .po файлах ==="
find /home/estconnect/Estconnect/locale -name "*.po" -exec grep -l "plural=EXPRESSION\|plural=INTEGER\|nplurals=INTEGER" {} \;

# Поиск в .mo файлах (скомпилированных) - это сложнее, но можно попробовать
echo ""
echo "=== Поиск в .mo файлах (скомпилированных) ==="
echo "Внимание: .mo файлы бинарные, но можно попробовать найти строки:"
find /home/estconnect/Estconnect/locale -name "*.mo" -exec strings {} \; | grep -i "EXPRESSION\|INTEGER" | head -20

# Также проверим системные директории Python
echo ""
echo "=== Проверка системных директорий Python ==="
PYTHON_LIB=$(python3 -c "import sys; print(sys.path)" | grep -o '/[^"]*site-packages[^"]*' | head -1)
if [ -n "$PYTHON_LIB" ]; then
    echo "Поиск в: $PYTHON_LIB"
    find "$PYTHON_LIB" -name "*.po" -exec grep -l "plural=EXPRESSION\|plural=INTEGER\|nplurals=INTEGER" {} \; 2>/dev/null | head -10
fi

echo ""
echo "=== Проверка всех Plural-Forms в проекте ==="
find /home/estconnect/Estconnect/locale -name "*.po" -exec sh -c 'echo "=== $1 ==="; grep "Plural-Forms" "$1"' _ {} \;

