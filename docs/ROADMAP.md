# Роадмап

## База (аналог hexlet-chat)

- [x] Базовый роутинг и страницы (Login / Chat / 404), FSD-каркас, strict TS, алиас `@/`
- [x] Регистрация/авторизация (формы + валидация zod, защита роута, API/MSW)
- [ ] Каналы: создание/переименование/удаление (мутации + UI-модалки)
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
      `messages.ts`), но ещё нет factory `createResourceHandlers`; мутируемый
      state без сброса между тестами не решён (handler-ы защищены
      `structuredClone` в rename/edit, но фикстуры не аннотированы
      доменными типами `Channel[]`/`Message[]`). Также — импорт фикстур из
      хэндлеров MSW (`shared → test`) — осознанное исключение: MSW
      используется только из тестов
- [x] Auth: unit-тесты на `tokenStorage`, `authStore`, `authApi` и UI-компоненты
      (Login/Register/ProtectedRoute/Logout), включая флоу через MSW
- [ ] Auth: тесты на хуки `useLogin`/`useRegister` и сценарии pending/error — покрыть
      отдельно (сейчас проверяются в составе UI-тестов форм)

## Тесты и инфраструктура

- [x] Vitest + React Testing Library (каркас, smoke-тест)
- [x] MSW — мок REST (auth: /login, /signup; /channels, /messages); сервер подключён глобально в `src/test/setup.ts`
- [ ] Покрытие тестами ≥ 80% — по плану [TESTING_PLAN.md](TESTING_PLAN.md)
- [ ] Playwright e2e
- [x] CI: lint + typecheck + test + coverage + SonarQube (GitHub Actions)

## Собственный бэкенд (отдельно)

- [ ] Общие типы фронта/бэка в shared/
- [ ] REST + ws сервер (позже)
- [ ] Миграция фронтового реалтайма с socket.io-client на ws (при написании собственного сервера)
