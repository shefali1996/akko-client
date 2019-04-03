import moment from 'moment';
import {constants,GoalConstants} from './goalConstant';

export const getSmallCardData = (goal,metrics)=> {
  let subheading = '';
  if (goal.context && goal.contextValue) {
    const filterCount = goal.contextValue.length;
    const filterTag = filterCount > 1 ? `${filterCount} filters` : `1 filter`;
    let contextTag = '';
    if (goal.context === GoalConstants.CATEGORY__CONTEXT) {
      contextTag = 'categories';
    } else if (goal.context === GoalConstants.CUSTOMER__CONTEXT) {
      contextTag = 'customers';
    } else if (goal.context === GoalConstants.VARIANT__CONTEXT) {
      contextTag = 'variants';
    } else if (goal.context === GoalConstants.VENDOR__CONTEXT) {
      contextTag = 'vendors';
    } else if (goal.context === GoalConstants.PRODUCT__CONTEXT) {
      contextTag = 'products';
    }
    subheading = `${filterTag} applied on ${contextTag}`;
  }

  let cardType = 'ACTIVE';
  if (goal.status === GoalConstants.GOAL_STATUS.SUCCESS) {
    cardType = 'SUCCESS';
  } else if (goal.status === GoalConstants.GOAL_STATUS.FAILED) {
    cardType = 'FAILED';
  }


  const today = moment();
  const startDate = moment(goal.startDate);
  const endDate = moment(goal.endDate);
  const daysLeftText = getDaysLeftText(goal);
  const  deadline = endDate.utc().format('DD MMM, YYYY');
  const percentage = getCompletedPercentage(goal);
  const timePercentage = getCompletedTimePercentage(goal);

  const suffix = goal.suffix;
  const prefix = goal.prefix;
  const target = goal.target;
  let current = goal.currentTargetValue;
  if(!current || current === null || current === ''){
    current = 0;
  }
  
  const {title:metricTitle=""} = metrics[goal.metric] || {};
 
  let successText = '';
  if (cardType === 'SUCCESS') {
    const date = moment(goal.actualEndDate).utc().format('DD MMM, YYYY').toUpperCase();
    successText = `ON ${date}, YOUR ${metricTitle.toUpperCase()} WAS ${prefix}${current}${suffix} WHICH EXCEEDED YOUR GOAL OF ${prefix}${target}${suffix}`;
  }

  let failedText = '';
  if (cardType === 'FAILED') {
    const date = moment(goal.endDate).utc().format('DD MMM, YYYY').toUpperCase();
    failedText = `AS OF ${date}, YOUR ${metricTitle.toUpperCase()} WAS ${prefix}${current}${suffix} WHICH DID NOT MEET YOUR GOAL OF ${prefix}${target}${suffix}`;
  }
  

  return {
    heading: goal.name,
    subheading,
    goal: `${prefix}${target}${suffix}`,
    current: `${prefix}${current}${suffix}`,
    daysLeftText,
    deadline,
    cardType,
    successText,
    failedText,
    percentage,
    timePercentage
  };
}

export const getLongCardData = (goal,metrics) => {

  const {title:metricTag=""} = metrics[goal.metric];

  let subheading = '';
  if (goal.context && goal.contextValue && goal.context != null && goal.contextValue != null) {
    const filterCount = goal.contextValue.length;
    let contextTag = '';
    if (goal.context === GoalConstants.CATEGORY__CONTEXT) {
      contextTag = 'categories';
    } else if (goal.context === GoalConstants.CUSTOMER__CONTEXT) {
      contextTag = 'customers';
    } else if (goal.context === GoalConstants.VARIANT__CONTEXT) {
      contextTag = 'variants';
    } else if (goal.context === GoalConstants.VENDOR__CONTEXT) {
      contextTag = 'vendors';
    } else if (goal.context === GoalConstants.PRODUCT__CONTEXT) {
      contextTag = 'products';
    }
    subheading = `Filters: ${filterCount} ${contextTag}`;
  } else {
    subheading = 'No filters applied';
  }

  let cardType = 'ACTIVE';
  if (goal.status === GoalConstants.GOAL_STATUS.SUCCESS) {
    cardType = 'SUCCESS';
  } else if (goal.status === GoalConstants.GOAL_STATUS.FAILED) {
    cardType = 'FAILED';
  }


  const daysLeftText = getDaysLeftText(goal);
  const percentage = getCompletedPercentage(goal);
  const timePercentage = getCompletedTimePercentage(goal);

  let goalCompleteDate = '';
  if (cardType === 'SUCCESS') {
    goalCompleteDate = moment(goal.actualEndDate).utc().format('DD MMM, YYYY').toUpperCase();
  }

  let goalStatusText = getGoalStatusText(goal);

  const suffix = goal.suffix;
  const prefix = goal.prefix;
  const target = goal.target;
  let current = goal.currentTargetValue;
  if(!current || current === null || current === ''){
      current = 0;
  }
  

  return {
    metricTag:metricTag.toUpperCase(),
    heading: goal.name,
    subheading,
    goal: `${prefix}${target}${suffix}`,
    current: `${prefix}${current}${suffix}`,
    startedOn: moment(goal.startDate).utc().format('DD MMM, YYYY'),
    deadline: moment(goal.endDate).utc().format('DD MMM, YYYY'),
    daysLeftText,
    goalCompleteDate,
    goalStatusText,
    cardType,
    percentage,
    timePercentage
  };
}


function getDaysLeftText(goal){
  const today = moment();
  const startDate = moment(goal.startDate);
  const endDate = moment(goal.endDate);

  let daysLeftText = '';
  if (goalIsActive(goal) && today < endDate) {
    const totalTimePeriod = endDate.diff(startDate,'days');
    const timeCompleted = startDate > today ? 0 : today.diff(startDate,'days');
    const numberOfDaysLeft = totalTimePeriod - timeCompleted;
    if (numberOfDaysLeft > 0) {
      daysLeftText = numberOfDaysLeft > 1 ? `${numberOfDaysLeft} DAYS LEFT` : `1 DAY LEFT`;
    }
  }else{
    daysLeftText = "0 DAYS LEFT";
  }
  return daysLeftText;
}

function getCompletedPercentage(goal){
  let percentage = 0;
  percentage = ((goal.currentTargetValue / goal.target) * 100).toFixed(0);
  return percentage;

}

function getCompletedTimePercentage(goal){
  const today = moment();
  const startDate = moment(goal.startDate);
  const endDate = moment(goal.endDate);
  const completedOn = moment(goal.actualEndDate);
  const totalDays = endDate.diff(startDate,'days');

  let percentage = 0;
  if(goal.status === GoalConstants.GOAL_STATUS.SUCCESS){
    percentage = 100;//(completedOn.diff(startDate,'days')/totalDays)*100;
  }else if(goal.status === GoalConstants.GOAL_STATUS.FAILED){
    percentage = 100;
  }
  else{
    const competedDate = today.diff(startDate,'days');
    percentage = (competedDate/totalDays)*100 ;
  }

  return percentage;

}

function goalIsActive(goal){
  let status = true;
  switch(goal.status){
    case GoalConstants.GOAL_STATUS.SUCCESS:
    case GoalConstants.GOAL_STATUS.FAILED:
      status = false;
      break;
    default:
    status = true;
  }
  return status;
}

function getGoalStatusText(goal){
  let goalStatusText = '';
  switch(goal.status){
    case GoalConstants.GOAL_STATUS.SUCCESS:
    case GoalConstants.GOAL_STATUS.FAILED:
      goalStatusText = "ARCHIVED";
      break;
    case GoalConstants.GOAL_STATUS.ONGOING:
      goalStatusText = "ACTIVE";
      break;
    case GoalConstants.GOAL_STATUS.ACTIVE:
      goalStatusText = 'SCHEDULED';
      break;
      default:
      goalStatusText = "INVALID";
  }
  return goalStatusText;
}