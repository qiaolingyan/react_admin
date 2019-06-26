
const USE_KEY = 'USE_KEY';
const USE_TIME = 'USE_TIME';
const EXPIRES_IN = 1000*3600*24*7;
export const getItem = () => {
  const startTime = localStorage.getItem(USE_TIME);
  if(Date.now() - startTime > EXPIRES_IN){
    removeItem();
    return {}
  }
  return JSON.parse(localStorage.getItem(USE_KEY))
};
export const setItem = (data) => {
  localStorage.setItem(USE_TIME,Date.now());
  localStorage.setItem(USE_KEY,JSON.stringify(data))
};
export const removeItem = () => {
  localStorage.removeItem(USE_TIME);
  localStorage.removeItem(USE_KEY);
};