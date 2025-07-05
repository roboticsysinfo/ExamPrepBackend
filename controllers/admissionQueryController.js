const AdmissionQuery = require('../models/AdmissionQuery');


// @route POST /api/admission-queries
exports.sendAdmissionQuery = async (req, res) => {
  try {
    const newQuery = new AdmissionQuery(req.body);

    const savedQuery = await newQuery.save();
    res.status(201).json({
      success: true,
      message: 'Admission query submitted successfully',
      data: savedQuery
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to submit query',
      error: error.message
    });
  }
};


// @desc Get admission queries by institute ID
// @route GET /api/admission-queries/institute/:instituteId
exports.getAdmissionQueriesByInstituteId = async (req, res) => {
  try {
    const { instituteId } = req.params;

    const queries = await AdmissionQuery.find({ instituteId }).sort({ createdAt: -1 });

    

    res.status(200).json({
      success: true,
      count: queries.length,
      data: queries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch queries for the institute',
      error: error.message
    });
  }
};


// @desc Delete an admission query by ID
// @route DELETE /api/admission-queries/:id
exports.deleteAdmissionQuery = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await AdmissionQuery.findById(id);
    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Admission query not found',
      });
    }

    await AdmissionQuery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Admission query deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete admission query',
      error: error.message,
    });
  }
};
