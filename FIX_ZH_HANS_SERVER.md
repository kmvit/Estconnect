# Исправление проблемы с zh-hans на сервере

## Проблема
Django нормализует код языка `zh-hans` в `zh_hans` (все маленькие буквы), но директория называлась `zh_Hans` (с заглавной H). Django не находил файлы проекта и пытался загрузить системные переводы, где был файл с "EXPRESSION".

## Решение

Выполните на сервере следующие команды:

```bash
cd /home/estconnect/Estconnect
source venv/bin/activate

# 1. Переименовать директорию
if [ -d "locale/zh_Hans" ]; then
    mv locale/zh_Hans locale/zh_hans
    echo "✓ Директория переименована"
fi

# 2. Обновить Language в .po файле
sed -i 's/"Language: zh_Hans/"Language: zh_hans/' locale/zh_hans/LC_MESSAGES/django.po

# 3. Удалить старые .mo файлы
find locale/zh_hans -name "*.mo" -delete

# 4. Перекомпилировать переводы
python manage.py compilemessages -l zh_hans

# 5. Проверить
python test_server_translations.py
```

После этого все языки должны работать корректно.

## Альтернативный вариант (если скрипт не работает)

```bash
cd /home/estconnect/Estconnect
source venv/bin/activate

# Переименовать директорию
mv locale/zh_Hans locale/zh_hans

# Отредактировать файл вручную
nano locale/zh_hans/LC_MESSAGES/django.po
# Найти строку: "Language: zh_Hans\n"
# Заменить на: "Language: zh_hans\n"
# Сохранить (Ctrl+O, Enter, Ctrl+X)

# Удалить .mo файлы и перекомпилировать
rm -f locale/zh_hans/LC_MESSAGES/django.mo
python manage.py compilemessages

# Перезапустить сервер
sudo systemctl restart gunicorn
```

