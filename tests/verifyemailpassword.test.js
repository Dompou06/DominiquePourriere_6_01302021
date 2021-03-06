const { expectCt } = require('helmet')
const Joi = require('joi')
const checkSignUp = require('../middleware/verifyemailpassword')
const { error } = schema.validate({ email, password })
if (error) {
  // console.log('error', error)
  return { message: 'Is not valid' }
} else {
  return { message: 'Is valid' }
}
let results
test('valid SignUp', () => {
    result = checkSignUp('email','password')
    expect(result).toEqual({
        message: 'Is not valid'
    })
})
test('valid SignUp', () => {
    result = checkSignUp('email@test.fr','maSoeur!is1')
    expect(result).toEqual({
        message: 'Is valid'
    })
})