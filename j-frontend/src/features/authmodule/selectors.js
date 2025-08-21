export const selectAuthState = (state) => state.auth;

// Specific fields
export const selectAuthUser   = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError  = (state) => state.auth.error;

// Derived boolean
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);

// derived "display name" //
export const selectAuthDisplayName = (state) => {
  const user = state.auth.user;
  if (!user) return null;
  return user.first_name?.trim() ? user.first_name : user.username;
};