
const USE_KEY = 'USE_KEY';
const USE_TIME = 'USE_TIME';
const EXPIRES = 1000*3600*24*7;

export const setItem = (value) => {
  localStorage.setItem(USE_TIME,Date.now());
  localStorage.setItem(USE_KEY,JSON.stringify(value))
};

export const getItem = () => {
  const startTime = localStorage.getItem(USE_TIME);
  if(Date.now - startTime > EXPIRES){
    removeItem();
    return;
  }
  return JSON.parse(localStorage.getItem(USE_KEY))
};

export const removeItem = () => {
  localStorage.removeItem(USE_TIME);
  localStorage.removeItem(USE_KEY);
};