# Тесты — Whisper

Покрытие: **145 тестов / 41 файл**, 97.6% lines / 96.28% stmts / 100% funcs.
Порог ≥ 80% контролируется SonarCloud quality gate (в vite.config пороги не
фиксируются). Отчёт: `npm run test:coverage` → `coverage/lcov.info`.

## Решения

- Мокирование API — **MSW** (сервер подключён глобально в `src/test/setup.ts`);
  `vi.mock`/спаи — для изоляции сторов и утилит
- Реалтайм — MSW ws-мок Engine.IO/Socket.IO (`shared/api/msw/ws/socketMock.ts`),
  полифилл `ws` для `globalThis.WebSocket`; эмиттеры `emitNewMessage` /
  `emitNewChannel` / `emitRenameChannel` / `emitRemoveChannel` вызываются из
  REST-хэндлеров перед ответом
- Тонкие обёртки (`App.tsx`, провайдеры, конфиги форм) — только косвенное
  покрытие, отдельные тесты признаны низкоэффективными
- Стабилизация флаки-тестов портального `Menu`: `maxWorkers: 4` в
  `vite.config.ts` + таймаут `findByRole('menuitem', ...)`

## Соглашения

- Провайдеры стенда: Mantine + изолированный `QueryClient` + RouterProvider
  (`createMemoryRouter`) — `renderWithProviders` / `renderHookWithProviders` в
  `src/test/test-utils.tsx`
- Изоляция zustand: сброс сторов в `afterEach` (`channelListStore`,
  `channelModalStore`, `currentChannelStore`, `useModalStore` — в `setup.ts`
  и локально); мутируемый MSW-state между тестами не сбрасывается — учитывать
- Навигация: реальный редирект через `createMemoryRouter`, не мок `useNavigate`
- Формы: `data-testid` на полях ошибок и серверной ошибке
- Портал Mantine: `getEnv()` всегда 'development' → `autosize` активен и в
  тестах; `matchMedia`/`ResizeObserver`/`document.fonts` замоканы в `setup.ts`
- История моков не чистится автоматически (нет `clearMocks`/`restoreMocks`) —
  чистить вручную
- Viewport `ScrollArea` в jsdom имеет нулевые размеры — `scrollHeight`/
  `clientHeight` подменять через `Object.defineProperty`

## Не покрыто (намеренно)

- FOUC-скрипт в `index.html` (jsdom не грузит index.html) — вручную в браузере
- Хуки `useLogin`/`useRegister` отдельно — pending/error проверяются в
  UI-тестах форм
