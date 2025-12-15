#!/bin/bash
# Скрипт для исправления проблемы с директорией zh_Hans
# Нужно запустить на сервере

cd /home/estconnect/Estconnect
source venv/bin/activate

echo "=== Исправление директории для zh-hans ==="
echo ""

# Проверяем текущее состояние
echo "Текущие директории:"
ls -la locale/ | grep zh
echo ""

# Переименовываем zh_Hans в zh_hans (все маленькие)
if [ -d "locale/zh_Hans" ]; then
    echo "Переименование zh_Hans -> zh_hans..."
    mv locale/zh_Hans locale/zh_hans
    echo "✓ Переименовано"
elif [ -d "locale/zh_hans" ]; then
    echo "✓ Директория zh_hans уже существует"
else
    echo "⚠ Директория zh_Hans не найдена!"
    exit 1
fi

echo ""
echo "=== Обновление Language в .po файле ==="
if [ -f "locale/zh_hans/LC_MESSAGES/django.po" ]; then
    sed -i 's/"Language: zh_Hans/"Language: zh_hans/' locale/zh_hans/LC_MESSAGES/django.po
    echo "✓ Обновлено"
else
    echo "⚠ Файл django.po не найден!"
fi

echo ""
echo "=== Удаление старых .mo файлов ==="
find locale/zh_hans -name "*.mo" -delete 2>/dev/null
echo "✓ Удалено"

echo ""
echo "=== Перекомпиляция переводов ==="
python manage.py compilemessages -l zh_hans

if [ $? -eq 0 ]; then
    echo "✓ Переводы успешно перекомпилированы!"
    echo ""
    echo "=== Тестирование ==="
    python test_server_translations.py 2>&1 | tail -15
    echo ""
    echo "=== Готово! ==="
    echo "Если все языки показывают ✓, перезапустите веб-сервер:"
    echo "  sudo systemctl restart gunicorn"
else
    echo "❌ Ошибка при компиляции!"
    exit 1
fi

