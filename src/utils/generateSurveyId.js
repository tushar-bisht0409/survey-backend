const Survey = require("../models/survey");

let currentId = 0;

exports.getSurveyCount = async () => {
  const survey = await Survey.find().sort({ survey_number: -1 }).limit(1);
  if(survey) {
    if(survey[0].survey_number){
      currentId = survey[0].survey_number
    }
  }
}


exports.generateSurveyId = ()=> {
  currentId++;
  const digit = currentId.toString().length;
  if(digit < 6){
    return {count: currentId, s_id: `TM-${currentId.toString().padStart(6-digit, '0')}`};
  }
  else {
    return {count: currentId, s_id: `TM-${currentId.toString()}`};
  }  
}