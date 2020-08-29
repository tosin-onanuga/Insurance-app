const models = require("../models/index");
const cloudinary = require("../config/cloudinary");
const { successResponse, errorResponse } = require("../utilis/response");

const addBeneficiary = async (req, res) => {
    const policy_id = req.params.policyId;
    const { firstName, lastName, middleName, dateOfBirth, gender, phoneNumber,
        email, bvn, bank, accountNumber, streetName, city, state
    } = req.body;
    const passport = req.file;
    if (passport.size > 1000000) errorResponse(400, 'Your passport must be less than 1mb', res);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.indexOf(passport.mimetype) === -1) errorResponse(400, 'Invalid passport type', res);

    if (isNaN(policy_id)) errorResponse(400, 'Are you sure you know what you are doing???', res);
    const policy = await models.Policy.findOne({
        where: {
            id: policy_id
        }
    });
    if (!policy) errorResponse(404, 'Policy does not exist', res);
    const policy_number = policy.policy_number;

    //upload passport to cloudinary
    cloudinary.uploader.upload(passport.path, (result, error) => {
        if (error) {
            console.log(error);
        }
        return res.json(result);
    })



}
module.exports = { addBeneficiary };