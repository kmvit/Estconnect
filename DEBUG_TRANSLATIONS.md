# Инструкция по исправлению ошибки "invalid token in plural form: EXPRESSION"

## Проблема
Ошибка возникает при попытке переключить язык на сервере. Django пытается загрузить переводы из всех установленных приложений, и один из файлов содержит шаблонное значение "EXPRESSION" вместо реального выражения.

## Решение

### Шаг 1: Проверка всех файлов переводов на сервере

Выполните на сервере:

```bash
cd /home/estconnect/Estconnect
source venv/bin/activate

# Поиск всех .po файлов с проблемой
find locale -name "*.po" -exec grep -l "EXPRESSION\|INTEGER" {} \;

# Проверка всех Plural-Forms
find locale -name "*.po" -exec sh -c 'echo "=== $1 ==="; grep "Plural-Forms" "$1"' _ {} \;
```

### Шаг 2: Проверка системных переводов Django

Проблема может быть в системных переводах Django. Проверьте:

```bash
# Найти все .po файлы в системных директориях Python
python3 -c "import django; print(django.__path__[0])" | xargs find -name "*.po" 2>/dev/null | head -20

# Проверка конкретно файлов zh_Hans или zh-hans
python3 -c "import django; print(django.__path__[0])" | xargs find -name "*zh*" -name "*.po" 2>/dev/null
```

### Шаг 3: Исправление файлов проекта

```bash
cd /home/estconnect/Estconnect
source venv/bin/activate

# Удалить все .mo файлы
find locale -name "*.mo" -delete

# Убедиться, что все .po файлы имеют правильный формат
# Проверить каждый файл вручную и исправить если нужно

# Перекомпилировать
python manage.py compilemessages
```

### Шаг 4: Временное решение - отключить проблемный язык

Если проблема в конкретном языке, можно временно отключить его в `settings.py`:

```python
LANGUAGES = [
    ('ru', 'RU'),
    ('en', 'EN'),
    ('th', 'TH'),
    # ('zh-hans', 'CH'),  # Временно отключено
]
```

### Шаг 5: Проверка после исправления

```bash
python manage.py shell
```

В shell:

```python
from django.utils import translation
from django.conf import settings

for lang_code, lang_name in settings.LANGUAGES:
    try:
        translation.activate(lang_code)
        print(f"✓ {lang_code} - OK")
        translation.deactivate()
    except Exception as e:
        print(f"❌ {lang_code} - ОШИБКА: {e}")
```

## Возможные причины

1. **Системные переводы Django** - старые версии Django могут иметь проблемные файлы
2. **Несоответствие кода языка** - `zh-hans` в настройках vs `zh_Hans` в директории
3. **Старые .mo файлы** - скомпилированные файлы содержат старую версию
4. **Переводы из других пакетов** - установленные пакеты могут иметь проблемные файлы

## Проверка конкретного языка

Если проблема только с `zh-hans`, попробуйте:

1. Переименовать директорию `locale/zh_Hans` в `locale/zh-hans`
2. Или изменить код языка в настройках на `zh_Hans`

