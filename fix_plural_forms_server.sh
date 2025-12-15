#!/bin/bash
# Скрипт для исправления проблем с Plural-Forms на сервере
# Этот скрипт нужно запустить на сервере

cd /home/estconnect/Estconnect
source venv/bin/activate

echo "=== Шаг 1: Удаление всех старых .mo файлов ==="
find locale -name "*.mo" -type f -delete
echo "✓ Удалено"

echo ""
echo "=== Шаг 2: Проверка всех .po файлов на наличие EXPRESSION/INTEGER ==="
BAD_FILES=$(find locale -name "*.po" -exec grep -l "plural=EXPRESSION\|plural=INTEGER\|nplurals=INTEGER" {} \;)

if [ -n "$BAD_FILES" ]; then
    echo "❌ Найдены проблемные файлы:"
    echo "$BAD_FILES"
    echo ""
    echo "Исправление..."
    for file in $BAD_FILES; do
        echo "Исправление: $file"
        # Заменяем EXPRESSION на правильное выражение
        sed -i 's/plural=EXPRESSION/plural=0/g' "$file"
        sed -i 's/nplurals=INTEGER/nplurals=1/g' "$file"
    done
    echo "✓ Исправлено"
else
    echo "✓ Проблемных файлов не найдено"
fi

echo ""
echo "=== Шаг 3: Проверка формата Plural-Forms во всех файлах ==="
for po_file in $(find locale -name "*.po"); do
    plural_line=$(grep "Plural-Forms" "$po_file" | head -1)
    if [ -n "$plural_line" ]; then
        # Проверяем, что строка заканчивается на \n
        if ! echo "$plural_line" | grep -q '\\\\n"$'; then
            echo "⚠ Исправление формата в: $po_file"
            # Добавляем \n если его нет
            sed -i 's/"Plural-Forms:\([^"]*\)";$/"Plural-Forms:\1\\n"/' "$po_file"
        fi
    fi
done

echo ""
echo "=== Шаг 4: Перекомпиляция всех файлов переводов ==="
python manage.py compilemessages

if [ $? -eq 0 ]; then
    echo "✓ Переводы успешно перекомпилированы!"
    echo ""
    echo "=== Шаг 5: Тестирование загрузки языков ==="
    python manage.py shell << 'EOF'
from django.utils import translation
from django.conf import settings

for lang_code, lang_name in settings.LANGUAGES:
    try:
        translation.activate(lang_code)
        print(f"✓ {lang_code} ({lang_name}) - OK")
        translation.deactivate()
    except Exception as e:
        print(f"❌ {lang_code} ({lang_name}) - ОШИБКА: {e}")
EOF
    
    echo ""
    echo "=== Готово! ==="
    echo "Теперь нужно перезапустить веб-сервер:"
    echo "  sudo systemctl restart gunicorn"
else
    echo "❌ Ошибка при компиляции переводов!"
    exit 1
fi

