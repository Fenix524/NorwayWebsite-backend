import bcrypt from 'bcrypt'

export const passwordEncryption = password => {
	const salt = bcrypt.genSaltSync(10)

	return bcrypt.hashSync(password, salt)
}
export const passwordDecryption = (password, userPassword) => {
	return bcrypt.compareSync(password, userPassword)
}
