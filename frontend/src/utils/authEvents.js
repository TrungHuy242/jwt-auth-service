export const AUTH_EVENTS = {
  SESSION_EXPIRED: "auth:session-expired",
};

export const dispatchSessionExpired = () => {
  window.dispatchEvent(new Event(AUTH_EVENTS.SESSION_EXPIRED));
};
