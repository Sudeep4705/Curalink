const z = require("zod")
const Registervalidation = z.object({
    username:z.string().
    regex(/^[a-zA-Z0-9]{2,30}$/,"Invalid firstname"),
    email: z.string().email("Invalid email format").lowercase().trim(),
    password:z.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/, "Must include uppercase, lowercase, and number")
})
const Loginvalidation = z.object({
    email: z.string().email("Invalid email format").lowercase().trim(),
    password:z.string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/, "Must include uppercase, lowercase, and number")
})


module.exports ={Registervalidation,Loginvalidation}