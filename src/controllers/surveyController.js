const Survey = require('../models/survey');
const { uuid } = require('uuidv4');
const { Parser } = require('json2csv');
const { formatDate } = require('../utils/commonFunctions');

exports.saveSurvey = async (req, res) => {
    try {
        const {
            user_id,
            coordinates,
            image_url,
            information
        } = req.body;

        const newSurvey = new Survey({
            survey_id: uuid(),
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

exports.getAllSurvey = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

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
        const limit = parseInt(req.query.limit) || 10;
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
            information
        } = req.body;

        const survey = await Survey.findOneAndUpdate({ survey_id },
            {coordinates, image_url, information}
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