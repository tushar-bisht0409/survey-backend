const { uuid } = require('uuidv4');
const uploadFileServices = require('../services/uploadFileService')

exports.uploadFile = async (req, res) => {
    if (!req.file) {
            return res.status(401).json({
                success: false,
                message: 'File not uploaded',
                error: ''
            });
        }

      const oKey = uuid();
      const uploadResult = await uploadFileServices.uploadFile(req.file, oKey);
      if(uploadResult.success){
        return res.status(201).json({
            success: true,
            message: 'File Uploaded Successfully',
            url: uploadResult.url
        });
      } else {
        return res.status(401).json({
            success: false,
            message: 'An Error Occurred',
            error: uploadResult.error
        });
      }
}