const crypto = require("crypto");
const fetch = require("node-fetch");
const models = require("../models/index");
const { successResponse, errorResponse } = require("../utilis/response");

const addPolicy = async (req, res) => {
  const { name, description, payout_amount, starting_amount } = req.body;
  const policy_number = Math.floor(1000000 + Math.random() * 9000000);

  //create policy
  try {
    const policy = await models.Policy.create({
      name,
      description,
      payout_amount,
      starting_amount,
      policy_number,
    });
    if (policy) {
      return res.status(200).json({
        success: true,
        message: "Policy created successfuly",
        policy,
      });
    }
    return res.status(500).json({
      success: false,
      error: "Unable to add policy at the moment",
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllPolicies = async (req, res) => {
  try {
    const allPolicies = await models.Policy.findAll();
    if (allPolicies.length < 1) {
      return res.status(200).json({
        success: true,
        message: "There are no policies listed yet",
      });
    }
    return res.status(200).json({
      success: true,
      result: allPolicies,
    });
  } catch (error) {
    console.log(error);
  }
};

const buyPolicy = async (req, res) => {
  // get user id
  const user_id = req.user;
  // get policy id
  const policy_id = req.params.id;
  // check if policy exist
  const policy = await models.Policy.findByPk(policy_id);
  if (!policy) {
    return res.status(404).json({
      success: false,
      error: "Policy does not exist",
    });
  }
  // get policy number
  const policy_number = policy.policy_number;

  try {
    // check if user already bought policy
    const alreadyBought = await models.UserPolicy.findAll({
      where: {
        policy: policy_id,
        user_id: user_id,
      },
    });

    if (alreadyBought.length > 0) {
      return res.status(400).json({
        success: false,
        error:
          "You have already bought this policy. Kindly add new beneficiaries",
      });
    }

    const boughtPolicy = await models.UserPolicy.create({
      user_id,
      policy: policy_id,
      policy_number,
    });
    if (boughtPolicy) {
      return res.status(200).json({
        success: true,
        message: "Success. Please add beneficiaries",
        policyPlanID: boughtPolicy.id,
        policy_number: policy_number,
      });
    }
    return res.status(500).json({
      success: false,
      error: "An error occured. Please try again later",
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserPolicy = async (req, res) => {
  const user_id = req.user;
  try {
    const userPolicies = await models.UserPolicy.findAll({
      where: {
        user_id: user_id,
      },
      include: [models.Policy],
    });

    if (userPolicies.length < 1) {
      return res.status(200).json({
        success: true,
        message: "You have no policies. Please buy one today",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Success",
      result: userPolicies,
    });
  } catch (error) {
    console.log(error);
  }
};

const initializePayment = async (req, res) => {
  const id = req.params.policyId;
  const user = await models.User.findByPk(req.user);
  const userEmail = user.email;

  const policyPlan = await models.UserPolicy.findAll({
    where: {
      id: id,
    },
    include: [models.Policy],
  });

  if (policyPlan[0].date_paid)
    successResponse(200, "You already bought this plan", res);
  // convert policy amount to kobo
  const amount = policyPlan[0].Policy.starting_amount * 100;
  // generate reference token
  const refToken = crypto.randomBytes(5).toString("hex");

  // make api call to paystack endpoint
  const raw = JSON.stringify({
    email: userEmail,
    amount: amount,
    reference: refToken,
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: raw,
    redirect: "follow",
  };

  try {
    const payNow = await fetch(
      "https://api.paystack.co/transaction/initialize",
      requestOptions
    );
    const response = await payNow.json();

    // update policyPlan referrence_id field
    await models.UserPolicy.update(
      {
        reference_id: response.data.reference,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return res.status(200).json({
      response,
    });
  } catch (error) {
    return next(error);
  }
};

const verifyPayment = async (req, res) => {
  const id = req.params.policyId;
  const policyPlan = await models.UserPolicy.findByPk(id);
  const REFERENCE = policyPlan.reference_id;

  try {
    const verify = await fetch(
      `https://api.paystack.co/transaction/verify/${REFERENCE}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verifiedPayment = await verify.json();
    if (verifiedPayment.data.status !== "success") {
      successResponse(200, verifiedPayment.data.gateway_response, res);
    }
    await models.UserPolicy.update(
      {
        channel: verifiedPayment.data.channel,
        date_paid: verifiedPayment.data.paid_at,
      },
      {
        where: {
          id: id,
        },
      }
    );
    successResponse(200, verifiedPayment.data.gateway_response, res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addPolicy,
  getAllPolicies,
  buyPolicy,
  getUserPolicy,
  initializePayment,
  verifyPayment,
};
