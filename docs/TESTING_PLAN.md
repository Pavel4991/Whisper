# План покрытия тестами

Цель: **≥ 80%** покрытия (lines/statements). Стартовая точка: ~40–45% — покрыт только
роутинг (`App.test.tsx`), auth-слайс и API-слой без тестов.

## Принятые решения

- Мокирование зависимостей — **MSW** для API-слоя (сервер подключён глобально в
  `src/test/setup.ts`); `vi.mock`/спаи — для изоляции стора и утилит
- Пороги `coverage.thresholds` в vite.config не фиксируем — контроль планки на стороне
  SonarCloud quality gate
- Тонкие обёртки (`App.tsx`, провайдеры, конфиги форм) — только косвенное покрытие,
  отдельные тесты признаны низкоэффективными

## Фаза 1 — слой данных ✅

- [x] `src/shared/api/token-storage.test.ts`
      roundtrip get/set/clear; SSR-ветка (`typeof window === 'undefined'`) через
      `vi.stubGlobal('window', undefined)`
- [x] `src/features/auth/model/authStore.test.ts`
      старт из пустого localStorage; `login()` пишет токен и ставит флаг;
      `logout()` чистит токен и флаг
- [x] `src/features/auth/api/authApi.test.ts`
      через MSW: эндпоинты `/login` и `/signup`, возврат `response.data`
- [ ] `src/features/auth/api/useLogin.test.tsx`,
      `src/features/auth/api/useRegister.test.tsx` — пока не выделены отдельно;
      флоу успеха/ошибки покрыт в UI-тестах форм (см. Фаза 2)

## Фаза 2 — UI-компоненты ✅- [x] `src/features/auth/ui/ProtectedRoute.test.tsx`

      авторизованный → рендер `<Outlet />`; неавторизованный → redirect на `/`

- [x] `src/features/auth/ui/AuthModal.test.tsx`
      заголовок и форма соответствуют `modalType` ('login' | 'register')
- [x] `src/features/auth/ui/LoginForm.test.tsx`,
      `src/features/auth/ui/RegisterForm.test.tsx`
      сабмит вызывает мутацию и выполняет `navigate('/chat', { replace: true })`;
      показ ошибки при 401
      (TODO: блокировка кнопки при `isPending` ещё не покрыта)
- [x] `src/features/auth/ui/LogoutButton.test.tsx`
      клик: токен удалён из хранилища, `navigate('/', { replace: true })`
      (кэш сессии `authKeys.session()` — проверить явно)
- [x] `src/pages/home/ui/HomePage.test.tsx`
      кнопки Login/Register открывают модалку с соответствующим типом
- [x] `src/widgets/header/ui/Header.test.tsx`
      рендер логотипа (`Whisper`); клики «Sign in»/«Get started» вызывают
      `openModal('login')` / `openModal('register')`

## Фаза 3 — каналы (мутации + UI)

- [x] `src/entities/channel/model/currentChannelStore.test.ts`
      старт на `'1'`, set (реализовано в Коммите 1)
- [x] `src/features/channel-management/model/useCreateChannel.test.ts`,
      `useRenameChannel.test.ts`, `useRemoveChannel.test.ts`
      успех (обновление кэша через `setQueryData`) и ошибка (кэш без изменений) —
      реализовано в Коммите 1
- [x] `src/features/channel-management/ui/ChannelModal.test.tsx`
      рендер по `modalType`; сабмит add/rename + проверка кэша; remove-подтверждение;
      валидация; серверная ошибка — реализовано в Пункте G
- [x] `src/widgets/sidebar/ui/ChannelItem.test.tsx`
      рендер; клик вызывает `setCurrentChannelId`; Menu rename/remove вызывает
      `openModal` с правильными аргументами; не-removable: меню нет — реализовано в Пункте G
- [x] `src/widgets/sidebar/ui/Sidebar.test.tsx`
      список каналов из `setQueryData`; клик выбирает канал;
      кнопки Add/Dropdown открывают модалку; серверная ошибка GET — реализовано в Пункте G

## Рефакторинг тест-инфраструктуры ✅

- [x] `src/app/App.test.tsx` — добавлен смоук-тест рендера `<App />`
      (провайдеры + реальный `createBrowserRouter` на `/`) — закрыто покрытие `App.tsx`
- [x] Фикстуры типизированы доменными типами:
      `testChannels: Channel[]` (`@/test/fixtures/channels.ts`),
      `testMessages: Message[]` (`@/test/fixtures/messages.ts`)
- [x] Глобальный тестовый токен: `tokenStorage.setToken('test-token')` в `beforeAll`
      и `clearToken` в `afterAll` `src/test/setup.ts` — убраны дублирующие сетапы
      из `useChannels`/`useMessages`/мутаций/`ChannelModal`/`authStore`
- [x] `mockServerError(method, path, status = 400)` — добавлен параметр статуса
      (закрыт TODO из `src/test/test-utils.tsx`)
- [x] `useCurrentChannelStore` сбрасывается в `afterEach` глобального `setup.ts`
- [x] Стабилизация флаки: `maxWorkers: 4` в `vite.config.ts` + таймаут
      `findByRole('menuitem', ..., { timeout: 3000 })` в `ChannelItem.test.tsx`
- [x] Нейминг тестов унифицирован (ед. стиль: глагол в настоящем времени,
      грамматически корректно) — `ChannelItem`/`Sidebar`/`ChannelModal`/`currentChannelStore`

## Соглашения для тестов

- Провайдеры стенда: Mantine + QueryClientProvider (изолированный
  `new QueryClient()`) + RouterProvider (`createMemoryRouter`) — хелпер
  `renderWithProviders` в `src/test/test-utils.tsx`
- Изоляция zustand-стора: `useAuthStore.setState(...)` перед тестом,
  сброс в `afterEach` (стор живёт между тестами)
- Навигация: проверяем реальный редирект через маршруты `createMemoryRouter`
  (например, `initialEntries: ['/chat']`), а не мок `useNavigate`
- Формы: `data-testid` на полях ошибок (`${name}-error`) и серверной ошибке —
  чтобы надёжно находить текст ошибки Mantine

## Критерий готовности

- [x] `npm run test:coverage` ≥ 80% по lines и statements — достигнуто
      (96.96% lines / 95.34% stmts / 100% funcs)
- Коммит: `test: cover auth flow and api layer with unit tests`
