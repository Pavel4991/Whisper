# Whisper

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

| Технология | Назначение |
|---|---|
| React 19 + TypeScript (strict) | UI и типизация |
| TanStack Query | Серверное состояние (каналы, сообщения) |
| Zustand | Клиентское состояние (модалки, текущий канал, draft) |
| React Router | Маршрутизация |
| Socket.io-client | Реалтайм |
| Axios | HTTP |
| Mantine + @mantine/form + Yup | UI-кит, формы и валидация |
| i18next, leo-profanity | Локализация, цензура |
| Vite, Vitest, MSW, Playwright | Сборка и тесты |

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

| Команда | Описание |
|---|---|
| `npm run dev` | Dev-сервер (HMR) |
| `npm run build` | Production-сборка (tsc + vite) |
| `npm run lint` | Проверка линтером |
| `npm test` | Тесты (vitest) |

## Тесты и CI

- Vitest + React Testing Library, MSW, Playwright (e2e)
- GitHub Actions: lint + typecheck + test на каждый PR — [статус](https://github.com/Pavel4991/Whisper/actions)

## Роадмап

см. [docs/ROADMAP.md](docs/ROADMAP.md)
