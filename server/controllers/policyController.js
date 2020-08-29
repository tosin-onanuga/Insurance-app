const crypto = require('crypto');
const models = require("../models/index");


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
            policy_number
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
            error: "Unable to add policy at the moment"
        })
    } catch (error) {
        console.log(error);
    }
}

const getAllPolicies = async (req, res) => {
    try {
        const allPolicies = await models.Policy.findAll();
        if (allPolicies.length < 1) {
            return res.status(200).json({
                success: true,
                message: "There are no policies listed yet"
            });
        }
        return res.status(200).json({
            success: true,
            result: allPolicies
        });
    } catch (error) {
        console.log(error);
    }
}

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
            error: "Policy does not exist"
        });
    }
    // get policy number
    const policy_number = policy.policy_number;

    try {
        // check if user already bought policy
        const alreadyBought = await models.UserPolicy.findAll({
            where: {
                policy: policy_id,
                user_id: user_id
            }
        });

        if (alreadyBought.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'You have already bought this policy. Kindly add new beneficiaries'
            });
        }

        const boughtPolicy = await models.UserPolicy.create({
            user_id,
            policy: policy_id,
            policy_number
        });
        if (boughtPolicy) {
            return res.status(200).json({
                success: true,
                message: "Success. Please add beneficiaries",
                policyPlanID: boughtPolicy.id,
                policy_number: policy_number
            });
        }
        return res.status(500).json({
            success: false,
            error: 'An error occured. Please try again later'
        });
    } catch (error) {
        console.log(error);
    }

}

const getUserPolicy = async (req, res) => {
    const user_id = req.user;
    try {
        const userPolicies = await models.UserPolicy.findAll({
            where: {
                user_id: user_id
            },
            include: [
                models.Policy,
            ],
        });

        if (userPolicies.length < 1) {
            return res.status(200).json({
                success: true,
                message: 'You have no policies. Please buy one today'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Success',
            result: userPolicies
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { addPolicy, getAllPolicies, buyPolicy, getUserPolicy };