# Роадмап

База (аналог hexlet-chat) реализована полностью: роутинг, auth, каналы,
сообщения, реалтайм (socket.io + MSW ws-мок), тёмная тема, редизайн лендинга
и auth-модалки, адаптивный чат с тестами. Текущее покрытие: 145 тестов /
41 файл, 97.6% lines / 96.28% stmts / 100% funcs (контроль — SonarCloud
quality gate, см. [TESTING_PLAN.md](TESTING_PLAN.md)).

## Функциональные улучшения

- [ ] Уведомления (Mantine @mantine/notifications): единый показ серверных
      ошибок (форм, мутаций, сокета)
- [ ] Онлайн-пользователи и статусы (события joined/left)
- [ ] Редактирование и удаление сообщений (soft-delete)
- [ ] Реакции-эмодзи на сообщения
- [ ] Пагинация/виртуализация списка сообщений
- [ ] Поиск по сообщениям и каналам
- [ ] Упоминания @user с подсветкой
- [ ] Непрочитанные каналы + счётчики + звуковой сигнал
- [ ] DM (личные сообщения)

## UX и надёжность

- [ ] WebSocket reconnection (exponential backoff) + индикатор переподключения
      (частично закрывается в M3 собственного бэкенда — см. BACKEND_PLAN)
- [ ] Offline-детекция (navigator.onLine)
- [ ] Горячие клавиши (Ctrl+K, Ctrl+N, Esc)

## Технический долг и особенности

- [ ] Тема: хардкод цветов чата заменить на токены схемы — `Sidebar.tsx`
      (`#F7F8FA`), `ChannelItem.tsx` (`#d4e9f2`), `MessageItem.module.css`
      (`#388e92`), плюс `primaryShade: { light: 7, dark: 6 }` для brand.
      Лендинг в тёмной теме корректен, чат — нет
- [ ] Тема: FOUC-скрипт в `index.html` — тело дословно скопировано из
      `ColorSchemeScript` (`@mantine/core`); при обновлении Mantine сверить с
      исходником; при вводе CSP скрипт молча заблокируется — нужен nonce или
      sha256-хеш. Тестами не покрыт (jsdom не грузит `index.html`)
- [ ] Хуки TanStack Query (`useLogin`, `useRegister`, `auth.queries`) живут в
      `features/auth/api/`, а не `model/` — осознанное отклонение от конвенции;
      при рефакторинге решить: перенести или обновить AGENTS.md
- [ ] Auth: username + token персистятся в localStorage (`whisper_auth_session`,
      единый `sessionStorage` в `shared/api`) — временное решение: у
      @hexlet/chat-server нет `/users/me`. Идеал — httpOnly-cookie /
      refresh-токен (закрывается M4)
- [ ] Auth: `RegisterCredentials` тип — вывести через `z.infer` из схемы
      (опционально)
- [ ] Auth: тесты на хуки `useLogin`/`useRegister` и сценарии pending/error —
      сейчас проверяются в составе UI-тестов форм
- [ ] MSW: factory `createResourceHandlers`; мутируемый state без сброса между
      тестами. Импорт фикстур из хэндлеров MSW (`shared → test`) —
      осознанное исключение. Решить после завершения остальных фаз
- [ ] Каналы: «канал по умолчанию» захардкожен как `id: '1'` под
      @hexlet/chat-server (два системных канала `removable: false`, дефолтный
      не определяется ни флагом, ни именем). На собственном сервере — ввести
      явный маркер `default`/`isDefault`
- [ ] Сообщения: `useMessages`/`messageApi` не переведены на паттерн
      `queryOptions()` (сделано только для каналов) — привести для
      единообразия при следующей правке
- [ ] Публичные API: убрать живые сегментные баррели —
      `entities/message/ui/index.ts`, `features/channel-management/model/index.ts`
      → завести root-barrel (≈46 строк импортов в 19 файлах). Отдельным
      рефакторинг-коммитом
- [ ] Барьер против возврата глубоких импортов: правило
      `no-restricted-imports` в ESLint либо Steiger. Сейчас структура держится
      только на дисциплине
- [ ] Слои: `shared/api/msw/ws/socketMock.ts` импортирует типы из `entities`
      (type-only) — нарушение «shared не зависит от приложения»; вынести типы
      сокетов в `shared` либо задокументировать исключение рядом с `shared → test`
- [ ] UI: ellipsis для длинных имён каналов в `ChatHeader` — длинное имя
      ломает раскладку шапки на мобильном

## Тесты и инфраструктура

- [ ] Playwright e2e (регистрация → создание канала → обмен сообщениями)

## Собственный бэкенд (см. BACKEND_PLAN.md)

Стек утверждён (2026-09-25): Node 22 + Fastify + нативный ws + PostgreSQL
(Drizzle) в npm-workspaces монорепо `packages/{client,server,shared}`.

- [ ] M0 Монорепо — следующий шаг
- [ ] M1 Контракты (типы/DTO/zod/`WsEventMap` в shared)
- [ ] M2 Сервер REST (+ `/users/me`, bcrypt, JWT)
- [ ] M3 WS (auth-first-frame, reconnect, миграция клиента с socket.io на ws)
- [ ] M4 Сессия (гидрация через `/users/me` вместо localStorage)
- [ ] M5 Деплой (Render + Neon)
