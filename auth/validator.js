const Joi=require("@hapi/joi");

const loginValidation= function(user){
    const schema=Joi.object({
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(user);
}
const registerValidation= function(user){
    const schema=Joi.object({
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required(),
        name: Joi.string().min(2).required(),
    });
    return schema.validate(user);
}

module.exports.registerValidation=registerValidation;
module.exports.loginValidation=loginValidation;