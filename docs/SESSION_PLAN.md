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
- e65065d **Фаза 3, Коммит 1**: `currentChannelStore` (zustand), barrel
  `entities/channel/model/index.ts`, payload-типы каналов, мутации
  `useCreateChannel`/`useRenameChannel`/`useRemoveChannel` (+ `setQueryData`),
  re-export хуков; тесты хуков и стора
- 559444e **Фаза 3, Коммит 2** `feat(widgets): add channel sidebar with CRUD
modal and integrate into chat`: `ChannelModal` (единый по `modalType` =
  createChannel/renameChannel/removeChannel, `channelId` пропом),
  `channelFormConfig` по типу (не массив), `ChannelItem` (клик →
  `setCurrentChannelId`, Menu rename/remove через `@tabler/icons-react`),
  `Sidebar` (список, кнопка add, стейт модалки, `channel-list-server-error`),
  интеграция в `ChatPage`, `ui.modals.*` → `ui.authModals.*` в локалях/коде,
  доки синхронизированы (ROADMAP каналы `[x]`, TESTING_PLAN Фаза 3)
- 5deb622 **Пункт G** `test: cover channel management UI (ChannelModal,
  ChannelItem, Sidebar)`: правки ChannelModal.tsx (aria-label, errorProps,
  data-testid), ChannelModal.test.tsx (8 тестов), ChannelItem.test.tsx (5),
  Sidebar.test.tsx (6); синхронизация доков

### Статусы проверок (актуально)

- Тесты: 71 passed (21 файлов); lint, format:check, build — чистые
- Покрытие: 95.23% lines, 93.73% statements
- Запушено в `main`: Фазы 1/2, рефакторинг, Фаза 3 (Коммиты 1, 2, Пункт G)

### Следующая задача: Фаза 4 — сообщения в реальном времени

Сообщения в реальном времени (MSW socket.io + socket.io-client),
leo-profanity, i18n. См. ROADMAP.md.

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
- [x] **Фаза 3** — каналы: создание/переименование/удаление (мутации + UI + тесты).
      3 коммита: мутации, UI, UI-тесты (Пункт G).
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

UI и интеграция (реализовано).

- `@tabler/icons-react` — установлен (иконки DotsVertical/Edit/Trash в Menu)
- `ui.modals.*` → `ui.authModals.*` — переименовано в локалях и auth-коде
- `src/locales/ru.json` + `en.json`: `validation.channelNameTooShort/TooLong`,
  `ui.channelModals.*` (menuLabel, createChannel, renameChannel, removeChannel,
  submitButton, cancelButton, deleteButton, removeChannelConfirm)
- `src/shared/validation/schemas.ts` — `channelNameSchema` (min 1 / max 20);
  `src/shared/validation/index.ts` — экспорт
- `src/features/channel-management/model/types.ts` — `ChannelModalType =
'createChannel' | 'renameChannel' | 'removeChannel'`
- `src/features/channel-management/model/channelFormConfig.ts` (new) — объект
  по `ChannelModalType`: submitTKey/cancelTkey
- `src/features/channel-management/ui/ChannelModal.tsx` (new):
  `{ modalType, isOpened, onClose, channelId }`; единый `useForm` (add/rename —
  валидация `channelNameSchema` через `createTranslatedResolver`; remove —
  подтверждение `removeChannelConfirm`); серверная ошибка `data-testid=
channel-modal-server-error`; закрыть по success
- `src/widgets/sidebar/ui/ChannelItem.tsx` (new): строка канала; клик →
  `setCurrentChannelId(channel.id)` (переключение канала); подсветка активного;
  Mantine `<Menu>` (ActionIcon-якорь) c пунктами rename/remove для `removable`
- `src/widgets/sidebar/ui/Sidebar.tsx` (new): `useChannels` +
  `useCurrentChannelStore`; кнопка «Добавить канал»; локальный стейт модалки
  (`modalType` + `channelId`); рендер `ChannelModal`
- `src/widgets/sidebar/index.ts` (new) — re-export `Sidebar`
- `src/pages/chat/ui/ChatPage.tsx` — `Flex`: `<Sidebar />` + правая область
  (заглушка; сообщения — Фаза 4); сохранён `<h1>Chat</h1>` + `LogoutButton`
- (FSD) widgets импортирует entity `useChannels`/`useCurrentChannelStore` и
  feature `ChannelModal`

> Тесты UI-каналов (`ChannelModal.test.tsx`, `ChannelItem.test.tsx`,
> `Sidebar.test.tsx`) — **отложены в отдельный коммит** (в текущем — не входят).

Доки (в Коммите 2):

- `docs/TESTING_PLAN.md` — добавить Фазу 3
- `docs/ROADMAP.md` — отметить создание/переименование/удаление каналов
  (строка 7) `[x]` (сообщения в реалтайме — отдельной строкой)

### Проверки (для обоих коммитов)

`npm run format:check`, `npm test`, `npm run lint`, `npm run build`;
в конце Фазы 3 — `npm run test:coverage`.

## План Пункта G — тесты UI-каналов

### Правки кода (тестируемость + доступность)

- `src/features/channel-management/ui/ChannelModal.tsx`: в `TextInput` имени
  добавить `label`/`aria-label` (ключ локали `ui.channelModals.nameField`) и
  `errorProps={{ 'data-testid': 'name-error' }}` (паттерн `LoginForm`)
- `src/locales/ru.json` + `en.json`: добавить `ui.channelModals.nameField`
  («Название канала» / «Channel name»)

### Тест-файл 1: `src/features/channel-management/ui/ChannelModal.test.tsx`

- Сетап: `renderWithProviders`, `tokenStorage.setToken('test-token')`,
  `onClose = vi.fn()`, сброс стора в `afterEach`
- Заголовок по `modalType`: create/rename/remove («Добавить канал» /
  «Переименовать канал» / «Удалить канал»)
- remove: показывает `removeChannelConfirm`, поля ввода нет
- create: ввод имени + сабмит → `onClose` вызван, кэш `channelKeys.all` обновлён
- rename: `onClose` вызван, имя обновилось
- remove: `onClose` вызван, канал убран из кэша
- Валидация: пустой сабмит → виден `name-error`
- Ошибка create: `mockServerError('post','/channels')` → `channel-modal-server-error`
- (404 для rename/remove — расширить `mockServerError` или `server.use` со
  статусом напрямую; `mockServerError` захардкожен на 400)

### Тест-файл 2: `src/widgets/sidebar/ui/ChannelItem.test.tsx`

- `ChannelItem` принимает `channel` и `openModal` (mock `vi.fn()`), обёрнут
  `renderWithProviders` (для zustand-стора)
- Рендер имени канала
- Клик по каналу → `currentChannelId` в `useCurrentChannelStore` = `channel.id`
- Removable: клик по `ActionIcon` (aria-label `ui.channelModals.menuLabel`) →
  Menu; клик «Переименовать канал» → `openModal('renameChannel', id)`;
  «Удалить канал» → `openModal('removeChannel', id)`
- Не-removable: передать канал пропом `{ removable: false }` → Menu отсутствует
  (`queryByRole`)

### Тест-файл 3: `src/widgets/sidebar/ui/Sidebar.test.tsx`

- `useChannels()` через MSW (`/channels`) → нужен токен; `findByText` пока грузится
- Список каналов из `testChannels` + кнопка «Добавить канал»
- Клик по каналу → `currentChannelId` обновлён
- Кнопка «Добавить канал» → модалка «Добавить канал» открыта
- Дропдаун канала → rename/remove открывают соответствующую модалку
- (опц.) Ошибка списка: `mockServerError('get','/channels')` →
  `channel-list-server-error`

### Общий сетап тестов каналов

- `afterEach`: сброс `useCurrentChannelStore` (глобальный zustand-синглтон)
- Токен в `beforeAll`/`beforeEach`, очистка в `afterAll`/`afterEach`
  (паттерн `useChannels.test`)

### Проверки

`npm run format:check && npm test && npm run lint && npm run build && npm run test:coverage`

### Коммит (один тестовый, без push)

`test: cover channel management UI (ChannelModal, ChannelItem, Sidebar)`

## Заметки на будущее

- Отложенный TODO Фазы 3: UI-тесты каналов — `ChannelModal.test.tsx`,
  `ChannelItem.test.tsx`, `Sidebar.test.tsx` (одним коммитом после Commit 2).
  → Пункт G, план развёрнут выше; приступить к работе.
- После завершения ВСЕХ фаз — вернуться к техдолгу MSW (factory
  `createResourceHandlers`, мутируемый state, типизация фикстур, `shared → test`).
- В Фазе 4 сообщений: понадобится MSW socket.io-события + socket.io-client
  интеграция, обновление кэша сообщений через сокет.
- `leo-profanity` и Playwright ещё не установлены (планируются).
