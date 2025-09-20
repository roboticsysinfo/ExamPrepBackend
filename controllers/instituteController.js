const Institute = require('../models/Institute');


// Function to generate next unique registration number
const generateInstituteRegNumber = async () => {
  
  const lastInstitute = await Institute.findOne().sort({ createdAt: -1 });
  let nextNumber = 1;

  if (lastInstitute && lastInstitute.instituteRegNumber) {
    const lastNumber = parseInt(lastInstitute.instituteRegNumber.split('-')[1]);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  return `INS-${nextNumber.toString().padStart(6, '0')}`;
};

// Create new institute
exports.createInstitute = async (req, res) => {
  try {
    const instituteRegNumber = await generateInstituteRegNumber();

    const institute = new Institute({
      ...req.body,
      instituteRegNumber,
    });

    await institute.save();

    res.status(201).json({
      success: true,
      data: institute,
      message: 'Institute created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};



// Get all institutes
exports.getAllInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.status(200).json({
      success: true,
      data: institutes,
      message: 'All institutes fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};


// Get single institute by ID
exports.getInstituteById = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);
    if (!institute) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Institute not found',
      });
    }

    res.status(200).json({
      success: true,
      data: institute,
      message: 'Institute fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};


// Update institute
exports.updateInstitute = async (req, res) => {
  try {
    const institute = await Institute.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!institute) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Institute not found',
      });
    }

    res.status(200).json({
      success: true,
      data: institute,
      message: 'Institute updated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};

// Delete institute
exports.deleteInstitute = async (req, res) => {
  try {
    const institute = await Institute.findByIdAndDelete(req.params.id);
    if (!institute) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Institute not found',
      });
    }

    res.status(200).json({
      success: true,
      data: null,
      message: 'Institute deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: error.message,
    });
  }
};
