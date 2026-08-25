# План покрытия тестами

Цель: **≥ 80%** покрытия (lines/statements). Стартовая точка: ~40–45% — покрыт только
роутинг (`App.test.tsx`), auth-слайс и API-слой без тестов.

## Принятые решения

- Мокирование зависимостей — `vi.mock` модулей, без новых пакетов (MSW остаётся в
  роадмапе для интеграционных тестов)
- Пороги `coverage.thresholds` в vite.config не фиксируем — контроль планки на стороне
  SonarCloud quality gate
- Тонкие обёртки (`App.tsx`, провайдеры, конфиги форм) — только косвенное покрытие,
  отдельные тесты признаны низкоэффективными

## Фаза 1 — слой данных

- [ ] `src/shared/api/token-storage.test.ts`
      roundtrip get/set/clear; SSR-ветка (`typeof window === 'undefined'`) через
      `vi.stubGlobal('window', undefined)`
- [ ] `src/features/auth/model/authStore.test.ts`
      старт из пустого localStorage; старт из заполненного (`isAuth: true`);
      `login()` пишет токен и ставит флаг; `logout()` чистит токен и флаг
- [ ] `src/features/auth/api/authApi.test.ts`
      мок `apiInstance.post`: эндпоинты `/login` и `/signup`, payload, возврат
      `response.data`
- [ ] `src/features/auth/api/useLogin.test.tsx`,
      `src/features/auth/api/useRegister.test.tsx`
      мок `authApi`: успех → `isAuth = true`, токен в хранилище, кэш
      `authKeys.session()` = username; ошибка → стор не изменён

## Фаза 2 — UI-компоненты

- [ ] `src/features/auth/ui/ProtectedRoute.test.tsx`
      авторизованный → рендер `<Outlet />`; неавторизованный → redirect на `/`
- [ ] `src/features/auth/ui/AuthModal.test.tsx`
      заголовок и форма соответствуют `modalType` ('login' | 'register')
- [ ] `src/features/auth/ui/LoginForm.test.tsx`,
      `src/features/auth/ui/RegisterForm.test.tsx`
      сабмит вызывает мутацию со значениями полей и выполняет
      `navigate('/chat', { replace: true })`; показ ошибки при reject;
      блокировка кнопки при pending
- [ ] `src/features/auth/ui/LogoutButton.test.tsx`
      клик: токен удалён из хранилища, кэш сессии очищен,
      `navigate('/', { replace: true })`
- [ ] `src/pages/home/ui/HomePage.test.tsx`
      кнопки Login/Register открывают модалку с соответствующим типом

## Соглашения для тестов

- Провайдеры стенда: Mantine + QueryClientProvider (изолированный
  `new QueryClient()`) + RouterProvider (`createMemoryRouter`) — по образцу
  `src/app/App.test.tsx`
- Изоляция zustand-стора: `useAuthStore.setState(...)` перед тестом,
  сброс в `afterEach` (стор живёт между тестами)
- Навигация мокируется через `vi.mock('react-router', ...)` или перехват
  `useNavigate`

## Критерий готовности

- `npm run test:coverage` ≥ 80% по lines и statements
- Коммит: `test: cover auth flow and api layer with unit tests`
