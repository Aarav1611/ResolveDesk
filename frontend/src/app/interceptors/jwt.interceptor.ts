import { HttpInterceptorFn } from '@angular/common/http';

/**
 * JWT Interceptor (functional style for Angular 17+)
 *
 * Automatically attaches the JWT Bearer token to every outgoing HTTP request
 * if one exists in localStorage. This avoids manually setting headers
 * in every service method.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
