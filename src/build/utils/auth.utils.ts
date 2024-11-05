const bcrypt = require('bcrypt');
const saltRounds = 10;

export async function encryptPass(password:string):Promise<string>{
    return await bcrypt.hashSync(password, saltRounds);
}

export async function comparePass(password1:string,password2:string):Promise<boolean>{
    return (bcrypt.compareSync(password1,password2))
}
