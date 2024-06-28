const Survey = require('../models/survey');
const { Parser } = require('json2csv');
const { formatDate } = require('../utils/commonFunctions');
const { generateSurveyId } = require('../utils/generateSurveyId');

exports.saveSurvey = async (req, res) => {
    try {
        const {
            user_id,
            coordinates,
            image_url,
            information
        } = req.body;

        const newSurvey = new Survey({
            survey_id: generateSurveyId(),
            user_id,
            coordinates,
            image_url,
            information
        });

        await newSurvey.save();

        return res.status(201).json({
            success: true,
            message: 'Survey Saved Successfully'
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.getSurvey = async (req, res) => {
    try {
        const {
            survey_id
        } = req.query;

        const survey = await Survey.findOne({ survey_id });

        if(!survey) {
            return res.status(401).json({
                success: false,
                message: 'Survey Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'Survey Found',
            survey: survey
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.getSurveyByStatus = async (req, res) => {
    try {
        const {
            user_id,
            all,
            survey_status,
            limit = 20,
            page = 1
        } = req.query;

        let survey;
        let totalCount;
        const offset = (page - 1) * limit;
        if(all === 'true') {
            if(survey_status === "all"){
                survey = await Survey.find({}).sort({ created_at: -1 })
                .skip(offset)
                .limit(parseInt(limit));
                totalCount = await Survey.countDocuments();
            } else {
            survey = await Survey.find({ survey_status }).sort({ created_at: -1 })
            .skip(offset)
            .limit(parseInt(limit));
            totalCount = await Survey.countDocuments({ survey_status });
            }
        }
        else{
        if(survey_status === "all"){
            survey = await Survey.find({user_id}).sort({ created_at: -1 }) // Sort by created_at descending
            .skip(offset)
            .limit(parseInt(limit));
            totalCount = await Survey.countDocuments({ user_id });
        } else {
        survey = await Survey.find({user_id, survey_status }).sort({ created_at: -1 }) // Sort by created_at descending
        .skip(offset)
        .limit(parseInt(limit));
        totalCount = await Survey.countDocuments({ user_id, survey_status });
        }
    }
        if(!survey) {
            return res.status(401).json({
                success: false,
                message: 'Survey Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'Survey Found',
            surveys: survey,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount: totalCount
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.getSurveyByStatusCsv = async (req, res) => {
    try {
        const {
            user_id,
            all,
            survey_status
        } = req.query;

        let survey;
        let totalCount;
        if(all === 'true') {
            if(survey_status === "all"){
                survey = await Survey.find({}).sort({ created_at: -1 });
            } else {
            survey = await Survey.find({ survey_status }).sort({ created_at: -1 })
            }
        }
        else{
        if(survey_status === "all"){
            survey = await Survey.find({user_id}).sort({ created_at: -1 }) // Sort by created_at descending
        } else {
        survey = await Survey.find({user_id, survey_status }).sort({ created_at: -1 }) // Sort by created_at descending
        }
    }
        if(!survey) {
            return res.status(401).json({
                success: false,
                message: 'Survey Not Found',
                error: ''
            });
        }

        const jsonSurveys = survey.map((sur) => {
            const jsonSurvey1 = {
                survey_id: sur.survey_id,
                latitude: sur.coordinates.latitude,
                longitude: sur.coordinates.longitude,
                user_id: sur.user_id,
                image_url: sur.image_url,
                created_at: formatDate(sur.created_at.toISOString())
            }
            const jsonSurvey2 = sur.information;
            return { ...jsonSurvey1, ...jsonSurvey2 };
        });
          const parser = new Parser();
          const csv = parser.parse(jsonSurveys);
    
          // Set headers for CSV download
          res.setHeader('Content-disposition', 'attachment; filename=surveys.csv');
          res.set('Content-Type', 'text/csv');
          res.status(200).send(csv);
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.getUserTodaysSurvey = async (req, res) => {
        try {
            const { page = 1, limit = 20, user_id } = req.query;
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
    
            const countPipeline = [
                {
                    $match: {
                        user_id,
                        created_at: {
                            $gte: todayStart,
                            $lte: todayEnd
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        countApproved: {
                            $sum: { $cond: [{ $eq: ['$survey_status', 'approved'] }, 1, 0] }
                        },
                        total: { $sum: 1 }
                    }
                }
            ];
    
            const countResult = await Survey.aggregate(countPipeline);
    
            if (!countResult.length) {
                return res.status(401).json({
                    success: false,
                    message: 'Survey Not Found',
                    error: ''
                });   
            }
    
            const { countApproved, total } = countResult[0];
    
            const offset = (page - 1) * limit;
    
            const todaySurveys = await Survey.find({
                user_id,
                created_at: {
                    $gte: todayStart,
                    $lte: todayEnd
                }
            })
            .sort({ created_at: -1 })
            .skip(offset)
            .limit(parseInt(limit));

            return res.status(201).json({
                success: true,
                message: 'Survey Found',
                surveys: todaySurveys,
                countApproved: countApproved,
                total: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalCount: total
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                error: error
            });        }
}

exports.getAllSurvey = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const skip = (page - 1) * limit;

        const surveys = await Survey.find()
            .skip(skip)
            .limit(limit)
            .exec();

        const totalCount = await Survey.countDocuments();
        if (surveys.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No surveys found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Surveys found',
            surveys: surveys,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount: totalCount
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.getUserSurvey = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const user_id = req.query.user_id;

        const skip = (page - 1) * limit;

        const surveys = await Survey.find({user_id})
            .skip(skip)
            .limit(limit)
            .exec();

        const totalCount = await Survey.countDocuments();
        if (surveys.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No surveys found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Surveys found',
            surveys: surveys,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalCount: totalCount
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.getUserSurveyMarks = async (req, res) => {
    try {

        const user_id = req.query.user_id;

        const surveys = await Survey.find({user_id});

        let allMarks = [];
        surveys.map((survey) => {
            allMarks.push({
                survey_id: survey.survey_id,
                coordinates: survey.coordinates,
                building_name: survey.information.building_name
            })
        })
        if (surveys.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No surveys found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Surveys found',
            surveys: allMarks,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.updateSurvey = async (req, res) => {
    try {
        const {
            survey_id,
            coordinates,
            image_url,
            information,
            survey_status
        } = req.body;

        const survey = await Survey.findOneAndUpdate({ survey_id },
            {coordinates, image_url, information,survey_status}
        );

        if(!survey) {
            return res.status(401).json({
                success: false,
                message: 'Survey Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'Survey Updated Successfully'
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.updateSurveyStatus = async (req, res) => {
    try {
        const {
            survey_id,
            survey_status,
            survey_remarks,
        } = req.body;

        let survey;

        if(survey_status === 'approved') {
            survey = await Survey.findOneAndUpdate({ survey_id },
                {survey_status: survey_status}
            );
        } else{
            survey = await Survey.findOneAndUpdate({ survey_id },
                {survey_status: survey_status, 
                $push: { survey_remarks: survey_remarks }
                }
            );
        }

        

        if(!survey) {
            return res.status(401).json({
                success: false,
                message: 'Survey Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'Survey Updated Successfully'
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.deleteSurvey = async (req, res) => {
    try {
        const {
            survey_id
        } = req.body;

        const survey = await Survey.findOneAndDelete({ survey_id });

        if(!survey) {
            return res.status(401).json({
                success: false,
                message: 'Survey Not Found',
                error: ''
            });        }

        return res.status(201).json({
            success: true,
            message: 'Survey Deleted Successfully'
        });
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error
        });
    }
}

exports.getSurveyCsv = async (req, res) => {
    try {
      const { survey_id } = req.query;
  
      const survey = await Survey.findOne({ survey_id });
  
      if (!survey) {
        return res.status(404).json({
          success: false,
          message: 'Survey Not Found',
        });
      }
  
    const jsonSurvey1 = {
        survey_id: survey.survey_id,
        latitude: survey.coordinates.latitude,
        longitude: survey.coordinates.longitude,
        user_id: survey.user_id,
        image_url: survey.image_url,
        created_at: formatDate(survey.created_at.toISOString())
    }
    const jsonSurvey2 = survey.information;
    const jsonSurvey = { ...jsonSurvey1, ...jsonSurvey2 };
      const parser = new Parser();
      const csv = parser.parse(jsonSurvey);
  
      res.setHeader('Content-disposition', `attachment; filename=${survey_id}.csv`);
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csv);
    } catch (error) {
      console.error('Error retrieving survey:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  exports.getAllSurveyCsv = async (req, res) => {
    try {
        
        const surveys = await Survey.find();
        
        if (surveys.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'No surveys found',
          });
        }
          const jsonSurveys = surveys.map((survey) => {
            const jsonSurvey1 = {
                survey_id: survey.survey_id,
                latitude: survey.coordinates.latitude,
                longitude: survey.coordinates.longitude,
                user_id: survey.user_id,
                image_url: survey.image_url,
                created_at: formatDate(survey.created_at.toISOString())
            }
            const jsonSurvey2 = survey.information;
            return { ...jsonSurvey1, ...jsonSurvey2 };
        });
          const parser = new Parser();
          const csv = parser.parse(jsonSurveys);
    
          // Set headers for CSV download
          res.setHeader('Content-disposition', 'attachment; filename=surveys.csv');
          res.set('Content-Type', 'text/csv');
          res.status(200).send(csv);
        
      } catch (error) {
        // Handle internal server error
        console.error('Error retrieving surveys:', error);
        res.status(500).json({
          success: false,
          message: 'Internal Server Error',
          error: error.message
        });
      }
    }