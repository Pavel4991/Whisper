# Роадмап

## База (аналог hexlet-chat)

- [x] Базовый роутинг и страницы (Login / Chat / 404), FSD-каркас, strict TS, алиас `@/`
- [x] Регистрация/авторизация (формы + валидация zod, защита роута, API/MSW)
- [x] Каналы: создание/переименование/удаление (мутации + UI-модалки)
      (UI-тесты каналов — отложены отдельным коммитом)
- [x] Landing-страница: header с логотипом и кнопками авторизации (widgets/header,
      shared/ui/Logo), шрифты Geist (`@fontsource/geist` + `@fontsource/geist-mono`)
- [x] Редизайн лендинга: `HeroSection` + `HeroVisual` (декор-мокап PR-диалога) в
      `pages/home/ui/`, `widgets/footer` (таглайн «Разговоры, которые хочется
      сохранить.»), CTA → AuthModal register/login, копирайт на i18n,
      цвета на токенах темы (brand/body/default-border), hover-анимация CTA
- [x] UI сообщений (Фаза 4.2): `widgets/chat` (`ChatWindow`, `ChatHeader`,
      `MessageList`) + `entities/message/ui/MessageItem` (dumb, username у чужих),
      заголовок канала через `useCurrentChannel` (кэш + `select`)
- [x] UI отправки (Фаза 4.3): `MessageInput` в `features/message-sending/ui`
      (Textarea autosize, Enter=send, `canSend`/disabled, trim через
      `transformValues`, reset на success; данные пропсами от `ChatWindow`)
- [x] Сообщения в реальном времени (Фазы 4.4/4.5): MSW ws-мок Engine.IO/Socket.IO,
      синглтон `getSocket`/`disconnectSocket`, подписка `newMessage` →
      `appendMessageToCache` (дедуп с `useAddMessage.onSuccess`), эмиссия кадра
      `42["newMessage",...]` из `socketMock.ts`
- [x] Каналы в реальном времени (Фаза 5): подписка `newChannel`/`renameChannel`/
      `removeChannel` в `features/channel-management/model/socket.subscription.ts`
      (`upsertChannelToCache`/`removeChannelFromCache`, сброс `currentChannelId`
      на `'1'`, чистка сообщений канала из `messageKeys.all`); эмиссия кадров из
      MSW (`emitNewChannel`/`emitRenameChannel`/`emitRemoveChannel`)

## Функциональные улучшения

- [ ] Уведомления (Mantine @mantine/notifications): единый показ серверных
      ошибок (форм, мутаций, сокета). Инлайн-блоки ошибок в `MessageInput`
      сознательно НЕ вводятся — после финала все серверные ошибки всплывают
      уведомлениями
- [ ] Онлайн-пользователи и статусы (события joined/left)
- [ ] Редактирование и удаление сообщений (soft-delete)
- [ ] Реакции-эмодзи на сообщения
- [ ] Пагинация/виртуализация списка сообщений
- [ ] Поиск по сообщениям и каналам
- [ ] Упоминания @user с подсветкой
- [ ] Непрочитанные каналы + счётчики + звуковой сигнал
- [ ] DM (личные сообщения)

## UX и надёжность

- [x] Тёмная тема (prefers-color-scheme + переключатель) — кнопка в `Header`
      и `ChatHeader` (`features/theme-switcher`), схема по умолчанию `auto`,
      выбор персистится в `localStorage` (`mantine-color-scheme-value`),
      FOUC закрыт инлайн-скриптом в `index.html`. Не сделано: хардкод цветов
      чата — см. «Технический долг»
- [ ] WebSocket reconnection (exponential backoff) + индикатор переподключения
- [ ] Offline-детекция (navigator.onLine)
- [ ] Горячие клавиши (Ctrl+K, Ctrl+N, Esc)

## Технический долг и особенности

- [ ] Тема: хардкод цветов чата заменить на токены схемы — `Sidebar.tsx`
      (`#F7F8FA`), `ChannelItem.tsx` (`#d4e9f2`), `MessageItem.module.css`
      (`#388e92`), плюс `primaryShade: { light: 7, dark: 6 }` для brand.
      Сейчас лендинг в тёмной теме корректен, а чат — нет
- [ ] Тема: FOUC-скрипт в `index.html` — инлайн в `<head>`, тело дословно
      скопировано из `ColorSchemeScript` (`@mantine/core`), `defaultColorScheme`
      обязан совпадать с `MantineProvider`, иначе Mantine предупредит о
      flicker. При обновлении Mantine сверить тело скрипта с исходником;
      при вводе CSP скрипт молча заблокируется и тема станет всегда светлой —
      нужен nonce или sha256-хеш, не `'unsafe-inline'`. Тестами не покрыт:
      jsdom не грузит `index.html`, проверка только в браузере
- [ ] Хуки TanStack Query (`useLogin`, `useRegister`, `auth.queries`) живут в
      `features/auth/api/`, а не в `model/` — осознанное отклонение от конвенции
      в AGENTS.md. При рефакторинге решить: перенести в `model/` или обновить
      формулировку конвенции
- [x] Auth: валидация формы регистрации (совпадение паролей), не отправлять
      `passwordConfirm` на `/signup` — решено через zod-схемы + transformValues
- [x] Auth: убрать `withCredentials` из `api-instance.ts` — сервер работает по
      Bearer-токену, куки не нужны
- [ ] Auth: username + token персистятся в localStorage (`whisper_auth_session`,
      единый `sessionStorage` в `shared/api`) — временное решение для бутстрапа
      сессии на релоаде: @hexlet/chat-server отдаёт bearer-токен без `/users/me`,
      кэш TanStack Query только в памяти. Идеал: не хранить серверные данные на
      клиенте — httpOnly-cookie / refresh-токен (см. «Собственный бэкенд»)
- [ ] Auth: `RegisterCredentials` тип — вывести через `z.infer` из схемы
      вместо ручного определения в `model/types.ts` (опционально)
- [ ] MSW: тестовые данные вынесены в фикстуры (`src/test/fixtures/channels.ts`,
      `messages.ts`) и аннотированы доменными типами (`Channel[]`/`Message[]`).
      Остаётся решить: factory `createResourceHandlers`; мутируемый state без
      сброса между тестами (handler-ы защищены `structuredClone` в rename/edit).
      Также — импорт фикстур из хэндлеров MSW (`shared → test`) — осознанное
      исключение: MSW используется только из тестов
- [x] Auth: unit-тесты на `sessionStorage`, `authStore`, `authApi` и UI-компоненты
      (Login/Register/ProtectedRoute/Logout), включая флоу через MSW
- [ ] Auth: тесты на хуки `useLogin`/`useRegister` и сценарии pending/error — покрыть
      отдельно (сейчас проверяются в составе UI-тестов форм)
- [ ] Каналы: «канал по умолчанию» захардкожен как `id: '1'` (general) под
      `@hexlet/chat-server` — на текущем сервере два системных канала
      `removable: false` (general/random), поэтому дефолтный не определяется ни
      флагом `removable`, ни именем, а берётся по фиксированному id. Клиентский
      стор `currentChannelStore` инициализируется `currentChannelId: '1'`;
      после удаления текущего канала возврат на `'1'` в `useRemoveChannel`.
      Позже, на собственном сервере — ввести явный маркер дефолтного канала
      (поле `default`/`isDefault` в `Channel`)
- [ ] Сообщения: `useMessages`/`messageApi` пока не переведены на паттерн
      `queryOptions()` (сделан только для каналов — `channelQueryOptions`);
      привести для единообразия при следующей правке message-хуков
- [ ] Структура: выделить `widgets/chat/ui/ChatLayout.tsx` с собственным
      CSS-модулем; `ChatPage` тогда сводится к `useChannelSubscription()` +
      `<ChatLayout />`. Осознанно не сделано в коммите `feat(chat)`: размен
      не давал выигрыша, а лишняя абстракция мешала. Вернуться, если
      `ChatPage` снова начнёт расти
- [ ] Публичные API: убрать живые сегментные баррели — удалить
      `entities/message/ui/index.ts`, `features/channel-management/model/index.ts`
      и завести root-barrel для `entities/message` и `features/channel-management`
      (≈46 строк импортов в 19 файлах). Решить в одном отдельном
      рефакторинг-коммите: смешивать с feature-коммитом не стоит
- [ ] Барьер против возврата глубоких импортов: правило
      `no-restricted-imports` в ESLint (paths/patterns по слоям) либо Steiger.
      Сейчас структура держится только на дисциплине, поэтому баррели и
      импорты вида `@/entities/channel/api/useChannels` снова размножаются
- [ ] Слои: `shared/api/msw/ws/socketMock.ts` импортирует типы из `entities`
      (`Channel`, `MessageSocketEvents`) — нарушение правила «shared не
      зависит от приложения». Импорты type-only, в проде не тянет, но правило
      нарушено; вынести типы сокетов в `shared` либо задокументировать
      исключение рядом с уже существующим исключением `shared → test`
- [ ] UI: ellipsis для длинных имён каналов в `ChatHeader` — `Title` без
      ограничения ширины, длинное имя ломает раскладку шапки на мобильном
- [ ] `MessageList` принимает `channelId: string | null`, хотя `null`
      недостижим: `currentChannelStore` инициализируется `currentChannelId: '1'`,
      а `general`/`random` неудаляемы — дефолтный канал всегда существует.
      Из-за этого в хуке остаётся `channelId || ''`. Решено оставить как есть;
      при сужении до `string` править стор и фикстуры тестов

## Тесты и инфраструктура

- [x] Vitest + React Testing Library (каркас, smoke-тест)
- [x] Стабилизация флаки-теста портального `Menu`: `maxWorkers: 4` в
      `vite.config.ts` (пиковая CPU-нагрузка при максимальном параллелизме) +
      увеличенный таймаут `findByRole('menuitem')` в `ChannelItem.test.tsx`
- [x] MSW — мок REST (auth: /login, /signup; /channels, /messages); сервер подключён глобально в `src/test/setup.ts`
- [x] Покрытие тестами ≥ 80% — достигнуто (96.96% lines / 95.34% stmts);
      контроль планки на стороне SonarCloud quality gate — по [TESTING_PLAN.md](TESTING_PLAN.md)
- [ ] Playwright e2e
- [x] CI: lint + format:check + build + coverage + SonarQube (GitHub Actions)
- [ ] Покрытие адаптивного чата (`feat(chat)`): сторы `channelListStore` /
      `channelModalStore`, состояния `ChannelList` (pending/error/empty) и
      закрытие списка при выборе канала, мобильная кнопка в `ChatHeader`,
      мобильная ветка `ChatPage` с `Drawer`, поведение `MessageList` —
      три Skeleton и прилипание к низу в обе стороны (прилипает / не
      прилипает после прокрутки вверх). Отложено на отдельный тестовый коммит

## Собственный бэкенд (отдельно)

- [ ] Общие типы фронта/бэка в shared/
- [ ] Ввести явный маркер «канала по умолчанию» (поле `default`/`isDefault`
      в `Channel`) вместо хардкода `id: '1'` на фронте (см. раздел «Технический
      долг и особенности»)
- [ ] REST + ws сервер (позже)
- [ ] Миграция фронтового реалтайма с socket.io-client на ws (при написании собственного сервера)
