# AGENTS.md

## Проект
Whisper — чат в реальном времени, улучшенная версия hexlet-chat (Slack-аналог).
Фронтенд: React 19 + TypeScript (strict). Бэкенд сейчас — @hexlet/chat-server
(socket.io + REST); собственный сервер планируется отдельно.

## Команды
- `npm run dev` — Vite dev server (HMR)
- `npm run build` — tsc -b && vite build
- `npm run lint` — eslint
- `npm test` — vitest (npm run test:watch — watch)

## Стек
- React 19, TypeScript (strict: true)
- TanStack Query — серверное состояние (каналы, сообщения)
- Zustand — клиентское состояние (модалки, текущий канал, draft)
- React Router — маршрутизация
- Socket.io-client — реалтайм (типизированные события)
- Axios — HTTP
- Mantine — UI-кит; @mantine/form + Yup — формы и валидация
- i18next, leo-profanity
- Vite, Vitest, MSW, Playwright

## Структура (Feature-Sliced Design)
src/
├── app/        # провайдеры (Mantine, Query, Router, i18n), глобальные стили
├── pages/      # маршруты-страницы (LoginPage, ChatPage)
├── widgets/    # композиции UI из фич/сущностей (Sidebar, ChatHeader, MessageList)
├── features/   # auth/, channel-management/, message-sending/, profile/
├── entities/   # channel/, message/, user/
├── shared/     # ui/, api/, types/, utils/, validation/, hooks/
├── locales/
└── styles/

Каждый срез (feature/entity): ui/, model/ (сторы, TanStack Query), api/, lib/.
Алиас `@/` → `src/`.

## Правила импортов (FSD)
- Слои импортируются строго сверху вниз: pages → widgets → features → entities → shared
- Срезы одного слоя НЕ импортируют друг друга — общее выносится в shared
- shared не импортирует ничего из приложения
- Бизнес-логика (model/) отделена от UI (ui/)

## Конвенции
- strict TS; все API-ответы и события socket.io типизированы
- Доменные типы (Channel, Message, User) — в entities/<сущность>/model
- Socket-события — типизированный набор (событие → payload); обновление кэша
  TanStack Query через queryClient.setQueryData
- Server state — только TanStack Query; клиентское состояние — Zustand;
  данные из сокета не дублируются в сторе
- Компоненты списков мемоизированы; селекторы Zustand без лишних ре-рендеров
- Ошибки: Error Boundaries + уведомления Mantine; API-ошибки нормализуются
- Не добавлять комментарии в код без запроса

## Тесты
- Vitest + React Testing Library — сторы, формы, хуки
- MSW — мок REST + socket.io
- Playwright — e2e: регистрация → создание канала → обмен сообщениями
- Новые фичи требуют тестов

## Роадмап
см. docs/ROADMAP.md
