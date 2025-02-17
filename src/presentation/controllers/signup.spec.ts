import { SignUpController } from "./signup";
import { MissingParamError } from "../errors/missing-param-error";
import { InvalidParamError } from "../errors/invalid-param-error";
import { EmailValidator } from "../protocols/email-validator";

interface SutTypes {
    sut: SignUpController,
    emailValidatorstub: EmailValidator
}
const makeSut = (): SutTypes => {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean {
            return true;
        }
    }
    const emailValidatorstub = new EmailValidatorStub();
    const sut =  new SignUpController(emailValidatorstub);

    return {
        sut,
        emailValidatorstub
    }
}
describe('Signup Controller', () =>{
    test('Should return 400 if no name is provided', () =>{
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('name'));
    });
    test('Should return 400 if no email is provided', () =>{
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('email'));
    });
    test('Should return 400 if no password is provided', () =>{
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('password'));
    });
    test('Should return 400 if no passwordConfirmation is provided', () =>{
        const {sut} = makeSut();
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
            }
        }
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
    });
    test('Should return 400 if an invalid email is provided ', () =>{
        const {sut, emailValidatorstub} = makeSut();
        jest.spyOn(emailValidatorstub, 'isValid').mockReturnValueOnce(false);
        
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new InvalidParamError('email'));
    });
})