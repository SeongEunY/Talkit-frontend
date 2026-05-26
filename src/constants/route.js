export const ERROR_ROUTES = Object.freeze({
  UNAUTHENTICATED: '/unauthenticated',
  LOGIN_EXPIRED: '/login/expired',
  ERROR: '/error',
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup'
});

export const redirectToLoginExpired = () => {
  const errorPaths = Object.values(ERROR_ROUTES);
  if (!errorPaths.includes(window.location.pathname)) {
    window.location.href = ERROR_ROUTES.LOGIN_EXPIRED;
  }
};

export const AUTH_ROUTES = Object.freeze({
  LOGIN: '/login',
  LOGOUT: '/logout',
});
