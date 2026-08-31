# План сессий — Whisper

> ⚠️ ЛОКАЛЬНЫЙ РАБОЧИЙ ДОКУМЕНТ. На сервер (git push) НЕ отправляется —
> не коммитить в `main`. Только локальный файл для межсессионного контекста.

Рабочий документ: фиксирует состояние проекта, все фазы и план реализации
текущей фазы. Обновляется в конце каждой сессии, чтобы следующая сессия могла
прочитать актуальное состояние и план.

## Что это за проект

Whisper — чат в реальном времени (улучшенный hexlet-chat), Slack-аналог.
React 19 + TypeScript (strict) + FSD (Feature-Sliced Design).

- Фронт: React 19, TS strict, TanStack Query (серверное состояние),
  Zustand (клиентское), React Router v7, socket.io-client, Mantine, @mantine/form,
  Zod, i18next, Vite, Vitest, Prettier, ESLint.
- Бэкенд: @hexlet/chat-server (REST + socket.io), порт 5001.
- Реалтайм сейчас — socket.io-client (бэкенд на socket.io); `ws` только для
  будущего собственного сервера (см. ROADMAP).
- Правила и конвенции: см. AGENTS.md (импорты FSD, strict TS, комментарии
  не добавлять, серверное состояние — только TanStack Query).

## Команды

- `npm run dev` — Vite dev server
- `npm run start-server` — бэкенд @hexlet/chat-server
- `npm run develop` — бэкенд + фронт (concurrently)
- `npm run build` — tsc -b && vite build
- `npm run lint` — eslint
- `npm run format` / `format:check` — Prettier
- `npm test` / `test:watch` / `test:coverage` — vitest

## Состояние проекта (на конец текущей сессии)

### Выполнено и закоммичено в `main`

- 3b7c565 База: роутинг, страницы (Login/Chat/404), FSD-каркас, strict TS, алиас `@/`
- fa89809 Установка зависимостей и провайдеры
- cc867b2 Замена react-hook-form на @mantine/form + prettier
- 5914ad3 / 5f5c827 / 772d93a / b3ee881: каркас auth: модал входа/регистрации,
  axios-слой, zustand authStore, защита роута, logout, docs sync
- 8e96871 / d04cc60 / 8e1eef8: **auth**: zod-валидация, chat-server, API/MSW,
  unit-тесты auth (tokenStorage, authStore, authApi, UI-компоненты)
- b55a9ce **Фаза 1**: `channelApi`/`messageApi` (CRUD REST) + MSW handlers
  (channels/messages), lib/authCheck, createErrorResponse; 42 теста
- 018b8bd **Фаза 2**: `useChannels`, `useMessages` query-хуки (+ keys),
  `renderHookWithProviders` в test-utils; тесты хуков; 44 теста
- fb6beb1 **Промежуточный рефакторинг**: вынос тестовых данных в фикстуры
  (`src/test/fixtures/channels.ts` → `testChannels`, `messages.ts` → `testMessages`),
  MSW-handler-ы импортируют фикстуры (rename/edit защищены `structuredClone`),
  `useMessages` фикс `toEqual([testMessages[0]])`; синхронизация доков
  (ROADMAP: auth [x], каналы-мутации [ ]; AGENTS: socket.io-client реалтайм)

### Статусы проверок (актуально)

- Тесты: 44 passed (14 файлов)
- Lint, format:check, build — чистые
- Фаза 1/2/рефакторинг запушены в `main`

### Открытые техдолги (подробно в docs/ROADMAP.md)

- Хуки auth живут в `features/auth/api/`, а не `model/` — осознанное отклонение
- `withCredentials` в api-instance (куки не нужны, Bearer)
- `RegisterCredentials` через z.infer
- MSW: нет factory `createResourceHandlers`; мутируемый state без сброса;
  фикстуры не аннотированы доменными типами; импорт `shared → test` —
  осознанное исключение. Решить ПОСЛЕ завершения всех фаз.
- `src/test/fixtures/` теперь закоммичено.

## Фазы проекта (общий план)

- [x] **База** — роутинг/страницы/каркас/алиас
- [x] **Auth** — регистрация/авторизация, валидация, защита роута, тесты
- [x] **Фаза 1** — API-слой каналов/сообщений (REST) + MSW
- [x] **Фаза 2** — query-хуки чтения `useChannels`/`useMessages` + тесты
- [x] **Промежуточный рефакторинг** — фикстуры + синхронизация доков
- [ ] **Фаза 3** — каналы: создание/переименование/удаление (мутации + UI). НА ТЕКУЩЕЙ СЕССИИ ПЛАНИРУЕТСЯ.
- [ ] **Фаза 4** — сообщения в реальном времени (MSW socket.io + socket.io-client), leo-profanity, i18n
- [ ] **Функциональные улучшения** (см. ROADMAP): онлайн-статусы, edit/delete сообщений soft-delete, реакции, пагинация, поиск, упоминания, непрочитанные, DM
- [ ] **UX/надёжность**: тёмная тема, reconnection, offline, горячие клавиши
- [ ] **Собственный бэкенд** (отдельно): общие типы, REST+ws, миграция с socket.io-client на ws

## Фаза 3 — КАНАЛЫ: создание/переименование/удаление (мутации + UI)

Цель: мутации каналов (useMutation) + UI (Sidebar-список, выбор канала,
модалка CRUD), интегрированные в ChatPage.

### Принятые решения

- Чтение (`useChannels`, `channelKeys`, `channelApi`) — остаётся в `entities/channel/api`
  (хуки чтения — часть API сущности; мутации-сценарии — в feature).
- Мутации каналов — в `features/channel-management/model`:
  `useCreateChannel`, `useRenameChannel`, `useRemoveChannel`.
- `currentChannelId` — Zustand-стор в `entities/channel/model`
  (`currentChannelStore.ts`) — задел под Фазу сообщений.
- Модалка — ОДНА `ChannelModal` с `mode: 'add' | 'rename' | 'remove'`
  (образец: AuthModal по modalType).
- Кэш после мутации — `queryClient.setQueryData(channelKeys.all, ...)` на месте
  (паттерн как useLogin→authKeys.session), НЕ invalidateQueries.
- Удаление — только для `removable === true`, с подтверждением;
  при удалении текущего канала — сброс `currentChannelId`.
- UI-выбор канала подсветкой активного — через `currentChannelStore`.
- Тесты — полное покрытие (хуки + стор + Sidebar + ChannelModal), успех и ошибки.
- Хуки чтения не выносим в features (оставляем в entities) — фичи одного слоя
  не импортируют друг друга; сущность самодостаточна.

### Структура Фазы 3 (в 2 коммита)

#### Коммит 1: `feat(channel): add current channel store and channel management mutations`

Слой данных и мутаций.

- `src/entities/channel/model/currentChannelStore.ts` (new) — zustand:
  `{ currentChannelId: string | null, setCurrentChannelId(id: string): void }`,
  инициализация `currentChannelId: '1'` — особенность текущего бэкенда
  `@hexlet/chat-server` (дефолтный канал по фиксированному `id: '1'`, без явного
  маркера `default`/`isDefault`); после удаления текущего канала возврат на `'1'` —
  в `useRemoveChannel` (см. техдолг в ROADMAP)
- `src/entities/channel/model/index.ts` (new) — barrel: re-export
  `useCurrentChannelStore` и типа `Channel`
- `src/features/channel-management/model/types.ts` (new) — payload-типы:
  `CreateChannelPayload { name }`, `RenameChannelPayload { id, name }`,
  `RemoveChannelPayload { id }`
- `src/features/channel-management/model/useCreateChannel.ts` (new):
  `useMutation(channelApi.createChannel)`; onSuccess appends в `channelKeys.all`
  через `setQueryData(channelKeys.all, (old: Channel[] | undefined) => old ? [...old, nc] : [nc])`
- `src/features/channel-management/model/useRenameChannel.ts` (new):
  onSuccess — map-замена канала по id в кэше
- `src/features/channel-management/model/useRemoveChannel.ts` (new):
  onSuccess — удалить канал по id из кэша; если `currentChannelId === id` →
  `setCurrentChannelId('1')` (возврат на дефолт — особенность текущего бэкенда,
  см. ROADMAP; в сторе отдельного `resetCurrentChannel()` нет)
- `src/features/channel-management/model/index.ts` (new) — re-export хуков

> Валидация форм каналов (`channelNameSchema`, ключи `validation.channelNameTooShort` /
> `channelNameTooLong` в `shared/validation` и локалях) **перенесена в Коммит 2** — к
> модалкам и UI.

Тесты Коммита 1 (рядом, `features/channel-management/model/*.test.ts`,
`entities/channel/model/currentChannelStore.test.ts`):

- `useCreateChannel.test.ts` — успех (кэш = testChannels + новый), ошибка 400
- `useRenameChannel.test.ts` — успех (имя обновлено в кэше), 404
- `useRemoveChannel.test.ts` — успех (канал убран; currentChannelId сброшен при
  удалении текущего), 404
- `currentChannelStore.test.ts` — старт на `'1'`, set

#### Коммит 2: `feat(widgets): add channel sidebar with CRUD modal and integrate into chat`

UI и интеграция.

- `src/locales/ru.json` + `en.json`:
  `validation.channelNameTooShort`, `validation.channelNameTooLong`,
  `ui.sidebar.channels`, `ui.sidebar.addChannel`,
  `ui.channelModal.add/rename/remove`, `ui.channelModal.channelNameField`,
  `ui.channelModal.addButton/renameButton/removeButton`,
  `ui.channelModal.removeConfirmText`
- `src/shared/validation/schemas.ts` — добавить `channelNameSchema`
  (string min 1 `validation.channelNameTooShort` / max 50 `validation.channelNameTooLong`);
  `src/shared/validation/index.ts` — экспорт `channelNameSchema`
- `src/features/channel-management/model/channelFormConfig.ts` (new) — конфиг
  поля name (образец `features/auth/model/loginFormConfig.ts`)
- `src/features/channel-management/ui/ChannelModal.tsx` (new):
  `{ mode, isOpened, channel?, onClose }`:
  - mode add: TextInput name + кнопка → `useCreateChannel`, закрыть по success
  - mode rename: форма pre-filled `channel.name` → `useRenameChannel({id})`, закрыть по success
  - mode remove: подтверждение (имя канала) + кнопка → `useRemoveChannel({id})`, закрыть по success
  - валидация `createTranslatedResolver(schemaResolver(channelSchema, {sync:true}), t)`
  - `data-testid` для полей/ошибок (паттерн LoginForm)
- `src/features/channel-management/index.ts` (new) — re-export `ChannelModal`
- `src/widgets/sidebar/ui/Sidebar.tsx` (new): `useChannels()` список; клик →
  `setCurrentChannel()` (подсветка активного); «+ Добавить канал» → модал add;
  для removable → rename/remove; локальный `useState` активной модалки
  (mode + channel)
- `src/widgets/sidebar/index.ts` (new)
- `src/pages/chat/ui/ChatPage.tsx` — рендер `<Sidebar />` + правая область
  (заглушка; сообщения — Фаза 4); опционально заголовок с именем текущего канала
- (FSD) widgets может импортировать entity `useChannels` и feature `ChannelModal`

Тесты Коммита 2:

- `ChannelModal.test.tsx` — рендер по mode; сабмит add вызывает create + закрывает;
  rename pre-filled; remove подтверждение; серверная ошибка показывается
- `Sidebar.test.tsx` — список каналов из MSW; клик выбирает канал
  (currentChannelId обновился); кнопки Add/Rename/Remove открывают модалку

Доки (в Коммите 2):

- `docs/TESTING_PLAN.md` — добавить Фазу 3
- `docs/ROADMAP.md` — строка 7: отметить создание/переименование/удаление каналов
  `[x]` (сообщения в реалтайме — отдельной строкой)

### Проверки (для обоих коммитов)

`npm run format:check`, `npm test`, `npm run lint`, `npm run build`;
в конце Фазы 3 — `npm run test:coverage`.

## Заметки на будущее

- После завершения ВСЕХ фаз — вернуться к техдолгу MSW (factory
  `createResourceHandlers`, мутируемый state, типизация фикстур, `shared → test`).
- В Фазе 4 сообщений: понадобится MSW socket.io-события + socket.io-client
  интеграция, обновление кэша сообщений через сокет.
- `leo-profanity` и Playwright ещё не установлены (планируются).
