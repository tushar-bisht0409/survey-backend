const Survey = require("../models/survey");

let currentId = 0;

exports.getSurveyCount = async () => {
  const survey = await Survey.find().sort({ survey_number: -1 }).limit(1);
  if(survey) {
    if(survey.survey_number){
      currentId = survey.survey_number
    }
  }
}


exports.generateSurveyId = ()=> {
  const digit = currentId.toString().length;
  currentId++;
  if(digit < 6){
    return {count: currentId, s_id: `TM-${currentId.toString().padStart(6-digit, '0')}`};
  }
  else {
    return {count: currentId, s_id: `TM-${currentId.toString()}`};
  }  
}