import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth';
import {BehaviorSubject, catchError, filter, switchMap, tap, throwError} from 'rxjs';

// Флаг процесса обновления токена, общий для всех запросов.
// true — обновление идёт; false — можно выполнять запросы с актуальным токеном.
let isRefreshing$ = new BehaviorSubject<boolean>(false);

// Интерсептор: добавляет токен в заголовок и обрабатывает 403 с авто-обновлением токена.
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token

  // Если токена нет — пропускаем запрос без модификаций (например, публичные эндпоинты)
  if (!token) return next(req)

  // Если обновление уже начато другим запросом — переходим в ветку ожидания/повтора
  if (isRefreshing$.value) {
    return refreshAndProceed(authService, req, next)
  }

  // Обычный путь: добавляем токен и отправляем. Если прилетит 403 — попробуем обновиться и повторить.
  return next(addToken(req, token))
    .pipe(
      catchError(error => {
        // При 403 пытаемся обновить токен и повторить исходный запрос
        if (error.status === 403) {
          return refreshAndProceed(authService, req, next)
        }

        // Иные ошибки пробрасываем дальше
        return throwError(error)
      })
    )
}

// Обновляет токен при необходимости и повторяет исходный запрос с актуальными заголовками.
const refreshAndProceed = (
  authService:AuthService,
  req:HttpRequest<any>,
  next:HttpHandlerFn
) => {
  // Первый запрос, который заметил 403, инициирует обновление
  if (!isRefreshing$.value) {        // условие выполнится ТОЛЬКО для первого
    isRefreshing$.next(true)
    // Запрашиваем новый токен
    return authService.refreshAuthToken()
      .pipe(
        switchMap(res => {
          // Повторяем исходный запрос уже с новым access_token
          return next(addToken(req, res.access_token))
            .pipe(
              // После успешного повтора: считаем обновление завершённым
              tap(() => isRefreshing$.next(false))
            );
        })
      );
  }

  // Спец-случай: сам запрос обновления пропускаем сразу, чтобы не зациклиться
  if (req.url.includes('refresh')) return next(addToken(req,authService.token!))

  // Все остальные «ожидающие» запросы ждут завершения обновления.
  // ВАЖНО: BehaviorSubject сразу эмитит текущее значение; filter здесь играет роль «шлюза»:
  // пока isRefreshing === true — события не проходят; как только станет false — пропускаем и продолжаем.
  // При желании можно ограничить срабатывание одним событием завершения через take(1) (оставлено как подсказка ниже).
  return isRefreshing$.pipe(
    filter(isRefreshing => !isRefreshing),
    switchMap(res => {
      // После завершения обновления повторяем исходный запрос с актуальным токеном из AuthService
      return next(addToken(req,authService.token!))
  })
  )

  // Подсказка (необязательно): чтобы срабатывать один раз на завершение обновления
  // return isRefreshing$.pipe(
  //   filter(v => !v),
  //   take(1),
  //   switchMap(() => next(addToken(req, authService.token!)))
  // )



}

// Клонирует запрос и добавляет заголовок Authorization с переданным токеном.
// ВАЖНО: HttpRequest в Angular неизменяемый, поэтому используем clone(),
// это не мутирует исходный запрос. Если заголовок Authorization уже был — он будет перезаписан.
const addToken = (req:HttpRequest<any>, token: string) => {
  return  req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  })
}
