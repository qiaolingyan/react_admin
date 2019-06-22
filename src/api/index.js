import ajax from './ajax';

export const reLogin = (username,password) => ajax('/login',{ username, password },'post');