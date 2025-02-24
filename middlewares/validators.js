const { z } = require("zod");

exports.registerSchema = z.object({
    email: z.string().email("Invalid email"),
    username: z.string().min(3, "username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters")
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

exports.loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

exports.validationZod = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        console.log(error.errors)
        const errMsg = error.errors.map(el => el.path[0] + ':' + el.message).join(", ");
        const mergeError = new Error(errMsg);
        next(mergeError);
    }
};