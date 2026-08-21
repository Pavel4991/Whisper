# AGENTS.md

## Проект
Whisper — чат в реальном времени, улучшенная версия hexlet-chat (Slack-аналог).
Фронтенд: React 19 + TypeScript (strict). Бэкенд сейчас — @hexlet/chat-server
(socket.io + REST); собственный сервер планируется отдельно.

## Команды
- `npm run dev` — Vite dev server (HMR)
- `npm run start-server` — бэкенд @hexlet/chat-server (порт 5001)
- `npm run develop` — бэкенд + фронтенд одновременно (concurrently)
- `npm run build` — tsc -b && vite build
- `npm run lint` — eslint
- `npm test` — vitest (npm run test:watch — watch)
- `npm run test:coverage` — vitest с покрытием (lcov → coverage/lcov.info)
- Makefile дублирует команды: make install/build/lint/test/coverage/develop

## Стек
- React 19, TypeScript (strict: true)
- TanStack Query — серверное состояние (каналы, сообщения)
- Zustand — клиентское состояние (модалки, текущий канал, draft)
- React Router — маршрутизация
- Socket.io-client — реалтайм (типизированные события)
- Axios — HTTP
- Mantine — UI-кит (core/hooks); react-hook-form — формы и валидация
- i18next, leo-profanity
- Vite, Vitest, MSW, Playwright

## Структура (Feature-Sliced Design)
src/
├── app/        # провайдеры (Mantine, Query, Router, i18n), глобальные стили
├── pages/      # маршруты-страницы (LoginPage, ChatPage, NotFoundPage)
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
- strict TS (+ noUncheckedIndexedAccess, exactOptionalPropertyTypes: доступ по индексу
  даёт T | undefined, optional-поля нельзя присваивать undefined); все API-ответы
  и события socket.io типизированы
- Доменные типы (Channel, Message, User) — в entities/<сущность>/model
- Socket-события — типизированный набор (событие → payload); обновление кэша
  TanStack Query через queryClient.setQueryData
- Server state — только TanStack Query; клиентское состояние — Zustand;
  данные из сокета не дублируются в сторе
- Компоненты списков мемоизированы; селекторы Zustand без лишних ре-рендеров
- Ошибки: Error Boundaries + уведомления Mantine; API-ошибки нормализуются
- React Router v7: Link/RouterProvider/createBrowserRouter/createMemoryRouter
  импортируются из корневого 'react-router'; НЕ из 'react-router/dom' (в vitest
  это даёт два экземпляра пакета и Link падает с NavigationContext: null).
  v8 требует Node >= 22.22 (в проекте 22.20), поэтому остаёмся на v7
- Не добавлять комментарии в код без запроса

## Тесты
- Vitest + React Testing Library — сторы, формы, хуки
- MSW — мок REST + socket.io
- Playwright — e2e: регистрация → создание канала → обмен сообщениями
- Новые фичи требуют тестов
- Покрытие: vitest v8 → coverage/lcov.info (SonarQube читает этот отчёт)

## CI
- GitHub Actions (.github/workflows/ci.yml): lint → build → test → coverage → SonarQube scan
- SonarCloud: org hexlet-project, projectKey Pavel4991_Whisper (sonar-project.properties)

## Роадмап
см. docs/ROADMAP.md
