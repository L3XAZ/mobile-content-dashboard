export type PinScreenParams = {
  mode?: 'create' | 'enter';
  from?: 'login' | 'sign-up' | 'restart';
};

export type PinScreenSearchParams = {
  mode?: 'create' | 'enter' | ('create' | 'enter')[];
  from?: 'login' | 'sign-up' | 'restart' | ('login' | 'sign-up' | 'restart')[];
};
