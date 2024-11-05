export function validators(email:string, password:string){
	let validation = {
		status: true as boolean,
		messages: [] as string[]
	}
	if(!email.includes("@")){
		validation.status = false
		validation.messages.push("The email entered is not valid (@).")
	}
	if(password.length < 6){
		validation.status = false
		validation.messages.push("The password must be at least 8 characters.")
	}
	if(!/^(?=.*\d).+$/.test(password)){
		validation.status = false
		validation.messages.push("The password must have at least 1 number.")
	}
	return validation
}