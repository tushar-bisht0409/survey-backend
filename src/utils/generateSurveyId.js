let currentId = 0;

exports.generateSurveyId = ()=> {
  if (currentId < 999999) {
    currentId++;
  } else {
    currentId = 1000000;
  }
  
  return `TM-${currentId.toString().padStart(6, '0')}`;
}