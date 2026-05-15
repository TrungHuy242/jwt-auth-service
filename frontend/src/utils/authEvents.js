export const AUTH_EVENTS = {
  SESSION_EXPIRED: "auth:session-expired",
};

let hasDispatchedSessionExpired = false;

export const dispatchSessionExpired = () => {
  if (hasDispatchedSessionExpired) {
    return;
  }
  hasDispatchedSessionExpired = true;
  window.dispatchEvent(new Event(AUTH_EVENTS.SESSION_EXPIRED));
};

export const resetSessionExpiredFlag = () => {
  hasDispatchedSessionExpired = false;
};
