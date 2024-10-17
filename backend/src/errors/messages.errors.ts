import codes from '../utils/codes';

export const getErrorMessage = (code: number): string => {
  switch (code) {
    case codes.USER_NOT_FOUND:
      return 'User not found';
    case codes.WRONG_PASSWORD:
      return 'Wrong password';
    case codes.USER_EXISTS:
      return 'User already exists';
    case codes.BAD_REQUEST:
      return 'Bad request';
    case codes.UNAUTHORIZED:
      return 'Unauthorized';
    default:
      return '';
  }
};
