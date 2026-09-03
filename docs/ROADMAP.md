# Роадмап

## База (аналог hexlet-chat)

- [x] Базовый роутинг и страницы (Login / Chat / 404), FSD-каркас, strict TS, алиас `@/`
- [x] Регистрация/авторизация (формы + валидация zod, защита роута, API/MSW)
- [x] Каналы: создание/переименование/удаление (мутации + UI-модалки)
      (UI-тесты каналов — отложены отдельным коммитом)
- [x] Landing-страница: header с логотипом и кнопками авторизации (widgets/header,
      shared/ui/Logo), шрифты Geist via @fontsource-variable
- [ ] Сообщения в реальном времени; фильтр leo-profanity; i18n

## Функциональные улучшения

- [ ] Онлайн-пользователи и статусы (события joined/left)
- [ ] Редактирование и удаление сообщений (soft-delete)
- [ ] Реакции-эмодзи на сообщения
- [ ] Пагинация/виртуализация списка сообщений
- [ ] Поиск по сообщениям и каналам
- [ ] Упоминания @user с подсветкой
- [ ] Непрочитанные каналы + счётчики + звуковой сигнал
- [ ] DM (личные сообщения)

## UX и надёжность

- [ ] Тёмная тема (prefers-color-scheme + переключатель)
- [ ] WebSocket reconnection (exponential backoff) + индикатор переподключения
- [ ] Offline-детекция (navigator.onLine)
- [ ] Горячие клавиши (Ctrl+K, Ctrl+N, Esc)

## Технический долг и особенности

- [ ] Хуки TanStack Query (`useLogin`, `useRegister`, `auth.queries`) живут в
      `features/auth/api/`, а не в `model/` — осознанное отклонение от конвенции
      в AGENTS.md. При рефакторинге решить: перенести в `model/` или обновить
      формулировку конвенции
- [x] Auth: валидация формы регистрации (совпадение паролей), не отправлять
      `passwordConfirm` на `/signup` — решено через zod-схемы + transformValues
- [ ] Auth: убрать `withCredentials` из `api-instance.ts` — сервер работает по
      Bearer-токену, куки не нужны
- [ ] Auth: `RegisterCredentials` тип — вывести через `z.infer` из схемы
      вместо ручного определения в `model/types.ts` (опционально)
- [ ] MSW: тестовые данные вынесены в фикстуры (`src/test/fixtures/channels.ts`,
      `messages.ts`) и аннотированы доменными типами (`Channel[]`/`Message[]`).
      Остаётся решить: factory `createResourceHandlers`; мутируемый state без
      сброса между тестами (handler-ы защищены `structuredClone` в rename/edit).
      Также — импорт фикстур из хэндлеров MSW (`shared → test`) — осознанное
      исключение: MSW используется только из тестов
- [x] Auth: unit-тесты на `tokenStorage`, `authStore`, `authApi` и UI-компоненты
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

## Собственный бэкенд (отдельно)

- [ ] Общие типы фронта/бэка в shared/
- [ ] Ввести явный маркер «канала по умолчанию» (поле `default`/`isDefault`
      в `Channel`) вместо хардкода `id: '1'` на фронте (см. раздел «Технический
      долг и особенности»)
- [ ] REST + ws сервер (позже)
- [ ] Миграция фронтового реалтайма с socket.io-client на ws (при написании собственного сервера)
