const models = require("../models/index");
const { successResponse, errorResponse } = require("../utilis/response");

const userDashboard = async (req, res) => {
  const user_id = req.user;
  try {
    const user = await models.User.findByPk(user_id);

    if (!user) errorResponse(404, "User not found", res);

    successResponse(200, "Success", user, res);
  } catch (error) {
    console.log(error);
  }
};

const policyPlanDetail = async (req, res) => {
  const { id } = req.params;
  try {
    if (isNaN(id)) errorResponse(400, "Invalid Policy ID");

    const result = await models.UserPolicy.findAll({
      where: {
        id: id,
      },
      include: [models.Policy],
    });
    if (!result) errorResponse(404, "No policy exists with that ID", res);

    const beneficiaries = await models.Beneficiary.findAll({
      where: {
        policyPlan: id,
      },
      attributes: ["firstName", "lastName"],
    });
    const data = { result, beneficiaries };

    successResponse(200, "Success", data, res);
  } catch (error) {
    console.log("Error: ", error);
  }
};

module.exports = { userDashboard, policyPlanDetail };
