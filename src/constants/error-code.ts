export enum ErrorCode {
  // User 1000 ~ 1999
  UserNotFound = 1000,
  UserAlreadyExist = 1001,
  UserPasswordError = 1002,
  UserEmailError = 1003,
  UserNicknameError = 1004,
  UserCreateError = 1005,
  UserUpdateError = 1006,
  UserDeleteError = 1007,
  UserAuthError = 1008,

  // Contact 2000~2999
  ContactNotFound = 2000,
  RequestIllegal = 2001,
}
