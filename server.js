const app = require('./app');
const connectDatabase = require('./src/config/database');
const { getSurveyCount } = require('./src/utils/generateSurveyId');

const PORT = process.env.PORT || 8080;

connectDatabase();
getSurveyCount();

app.get('/', (req,res)=> {
    res.json({message: "Working!!!"});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});