import {dashboardGrid} from '../constants/index';

export const getColumn = () => {
  const screenWidth = screen.width;
  let numColumn = Math.floor(screenWidth / dashboardGrid.maxColWidth);
  const r = screenWidth % dashboardGrid.maxColWidth;
  numColumn = numColumn > dashboardGrid.maxColumn ? dashboardGrid.maxColumn : numColumn;
  const colWidth = 100 / numColumn; // 100 is 100% of screen
  return {colWidth: `${colWidth}%`, numColumn};
};

export const validateEmail = (email) => {
  // eslint-disable-next-line max-len, no-useless-escape
  const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

export const lastTimeDate=(data)=>{
const date=new Date(data);
const year=date.getFullYear()
const month=date.getMonth()
const day=date.getDate()
return new Date(year,month,day,11,59,59)
}