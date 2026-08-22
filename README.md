# Whisper

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Pavel4991_Whisper&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Pavel4991_Whisper)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Pavel4991_Whisper&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Pavel4991_Whisper)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Pavel4991_Whisper&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Pavel4991_Whisper)

Чат в реальном времени — улучшенная версия учебного проекта hexlet-chat (Slack-аналог).

> Проект в активной разработке: готов каркас (Vite + React 19 + TypeScript + CI),
> функциональность — по [роадмапу](docs/ROADMAP.md).

## Возможности (план)

- 🔐 Регистрация и авторизация
- 💬 Обмен сообщениями в реальном времени (WebSockets)
- 📁 Управление каналами — создание, переименование, удаление
- 🔄 Автоматическое обновление без перезагрузки страницы
- 🚫 Фильтр нецензурной лексики (leo-profanity)
- 🌐 Локализация (i18next)
- 🌙 Тёмная тема, 👥 онлайн-пользователи, 🔍 поиск и др. — см. [роадмап](docs/ROADMAP.md)

## Технологии

| Технология                     | Назначение                                           |
| ------------------------------ | ---------------------------------------------------- |
| React 19 + TypeScript (strict) | UI и типизация                                       |
| TanStack Query                 | Серверное состояние (каналы, сообщения)              |
| Zustand                        | Клиентское состояние (модалки, текущий канал, draft) |
| React Router                   | Маршрутизация                                        |
| Socket.io-client               | Реалтайм                                             |
| Mantine + @mantine/form        | UI-кит, формы и валидация                            |
| i18next                        | Локализация                                          |
| Vite, Vitest                   | Сборка и тесты                                       |

Планируется подключить: HTTP-клиент (axios), leo-profanity, MSW, Playwright — см. [роадмап](docs/ROADMAP.md).

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск бэкенда @hexlet/chat-server (порт 5001)
npx start-server

# Режим разработки (Vite с HMR)
npm run dev
```

## Команды

| Команда                | Описание                       |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Dev-сервер (HMR)               |
| `npm run build`        | Production-сборка (tsc + vite) |
| `npm run lint`         | Проверка линтером              |
| `npm run format`       | Форматирование кода (Prettier) |
| `npm run format:check` | Проверка форматирования        |
| `npm test`             | Тесты (vitest)                 |

## Тесты и CI

- Vitest + React Testing Library; MSW и Playwright (e2e) запланированы
- GitHub Actions: lint + format:check + build + coverage (включая тесты) + SonarQube scan на каждый PR — [статус](https://github.com/Pavel4991/Whisper/actions)
- SonarCloud: [анализ качества кода](https://sonarcloud.io/project/overview?id=Pavel4991_Whisper)

## Роадмап

см. [docs/ROADMAP.md](docs/ROADMAP.md)
