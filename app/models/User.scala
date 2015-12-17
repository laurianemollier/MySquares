package models

import play.api.data.Forms._
import play.api.data.{Form, Mapping}
import play.api.data.validation.{ValidationError, Invalid, Valid, Constraint}
import play.api.libs.json.Json

case class RegisterData(email: String, password: String, verifyingPassword: String, termCondition: Boolean){
  def getUser = User(email, password)
}

object RegisterData{
  implicit val format = Json.format[RegisterData]



  /** constains and form for registeration **/
  val acceptedTermsAndConditions: Constraint[Boolean] = Constraint("constraints.termAndConditions")({
    bool => {
      if(bool) Valid
      else Invalid(Seq(ValidationError("You must accepte termes and conditions")))
    }
  })
  val termCondition : Mapping[Boolean] = boolean.verifying(acceptedTermsAndConditions)


  // Password matching expression. Password must be at least 8 characters, no more than 30 characters,
  // and must include at least one upper case letter, one lower case letter, and one numeric digit.
  val reg = """^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$""".r
  val passwordCheck: Constraint[String] = Constraint("constraints.passwordCheck")({
    plainText =>
      val errors = plainText match {
        case reg() => Nil
        case _ => Seq(ValidationError("Password must have between 8 and 30 characters, must contain at " +
          "least 1 number, 1 lower case and one upper case."))
      }
      if (errors.isEmpty) Valid
      else Invalid(errors)
  })
  val password = nonEmptyText(minLength = 8, maxLength = 30).verifying(passwordCheck)

  val samePassword: Constraint[RegisterData] = Constraint("constraints.samePassword")({
    fields =>
      if (fields.password == fields.verifyingPassword) Valid
      else Invalid(Seq(ValidationError("The two given password are not matching")))
  })



  /** register form **/
  val registerForm: Form[RegisterData] = Form{
    mapping("email" -> email,
      "password" -> password,
      "verifyingPassword" -> nonEmptyText(minLength = 8, maxLength = 30),
      "termCondition" -> termCondition
    )(RegisterData.apply)(RegisterData.unapply) verifying(samePassword)
  }

}


case class User(email: String, password: String)

object User{
  implicit val format = Json.format[User]
}


case class LoginData(email: String, password: String)


object LoginData{
  /** login form **/
  def loginForm: Form[LoginData] = Form{
    mapping("email" -> email,
      "password" -> nonEmptyText
    )(LoginData.apply)(LoginData.unapply)
  }
}
