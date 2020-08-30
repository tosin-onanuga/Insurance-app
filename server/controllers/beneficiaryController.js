const models = require("../models/index");
const cloudinary = require("../config/cloudinary");
const { successResponse, errorResponse } = require("../utilis/response");

const addBeneficiary = async (req, res) => {
  // get policy id
  const policy_id = req.params.policyId;
  // get beneficiary details
  const {
    firstName,
    lastName,
    middleName,
    dateOfBirth,
    gender,
    phoneNumber,
    email,
    bvn,
    bank,
    accountNumber,
    streetName,
    city,
    state,
  } = req.body;
  // get beneficiary passport
  const passport = req.file;

  try {
    if (passport.size > 1000000)
      errorResponse(400, "Your passport must be less than 1mb", res);
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.indexOf(passport.mimetype) === -1)
      errorResponse(400, "Invalid passport type", res);

    if (isNaN(policy_id))
      errorResponse(400, "Are you sure you know what you are doing???", res);
    const policy = await models.Policy.findOne({
      where: {
        id: policy_id,
      },
    });
    if (!policy) errorResponse(404, "Policy does not exist", res);
    // get policy number
    const policy_number = policy.policy_number;
    //check if beneficiary already exist
    const beneficiaryExist = await models.Beneficiary.findAll({
      where: {
        bvn: bvn,
        policyPlan: policy_id,
      },
    });

    if (beneficiaryExist.length > 0)
      errorResponse(400, "Beneficiary already added to this plan", res);

    //upload passport to cloudinary and get url to be stored in db
    const result = await cloudinary.uploader.upload(passport.path);
    // create beneficiary
    const newBeneficiary = await models.Beneficiary.create({
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      phoneNumber,
      email,
      bvn,
      bank,
      accountNumber,
      streetName,
      city,
      state,
      policyPlan: policy_id,
      policyNumber: policy_number,
      passport: result.url,
    });
    if (newBeneficiary)
      successResponse(
        200,
        "Beneficiary successfuly added",
        newBeneficiary,
        res
      );

    errorResponse(500, "Unable to add beneficiary", res);
  } catch (error) {
    console.log(error);
  }
};
module.exports = { addBeneficiary };
