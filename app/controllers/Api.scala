package controllers

import controllers.Application.LogRegCont
import org.mindrot.jbcrypt.BCrypt
import play.api.data.validation._
import play.api.data.Mapping
import play.api.mvc._
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import settings.Global._
import sorm.Persisted

import models._


// TODO: SQL injection
object Api extends Controller {



  // user
  def addUser = Action{ implicit request =>
    userForm.bindFromRequest.fold(
      errorFrom => {
        // TODO: Faire le css des erreurs + ajouter une belle erreurs + Rediriger
       BadRequest(views.html.loginRegisterContact.loginRegisterContact(LogRegCont.register, errorFrom, loginForm))
      },
      userData => {
        val user = userForm.bindFromRequest.get
        val email: Option[User with Persisted] = DB.query[User].whereEqual("email", user.email).fetchOne()
        email match{
          //TODO: not set ok quand c'estd deja  ou creer un page pour ca
            // the user is already register
          case Some(email) => Ok("already registered")
          case None => {
            val hashPassword = BCrypt.hashpw(user.password, BCrypt.gensalt())
            DB.save(User(user.email, hashPassword))
            Redirect(routes.Application.home())
          }
        }
      }
    )
  }


  def getUsers = Action{
    val users = DB.query[User].fetch
    Ok(Json.toJson(users))
  }


  def getUser(email: String): Option[User] ={
    DB.query[User].whereEqual("email", email).fetchOne()
  }



/** constains and form for register **/

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

  val userForm: Form[RegisterData] = Form{
    mapping("email" -> email,
      "password" -> password,
      "verifyingPassword" -> nonEmptyText(minLength = 8, maxLength = 30),
      "termCondition" -> termCondition
    )(RegisterData.apply)(RegisterData.unapply) verifying(samePassword)
  }












  def loginForm: Form[LoginData] = Form{
    mapping("email" -> email,
      "password" -> nonEmptyText
    )(LoginData.apply)(LoginData.unapply)
  }



// TODO: Faire les bonnes redirection
  def login = Action { implicit request =>
    loginForm.bindFromRequest.fold(
      errorForm => {
        Ok("Pas les bons argument")
      },
      login => {
        val loginData = loginForm.bindFromRequest.get
        getUser(loginData.email) match {
          case None => Ok("Email existe pas ") //TODO: change that
          case Some(userDB) => {
            if(BCrypt.checkpw(loginData.password, userDB.password)){
              Ok(views.html.home.home(colors, nbSquaresOneEdge, true)).withSession("connected" -> loginData.email)
            }
            else{
              Ok("mauvais mot de passe!")
            }
          }
        }


      }
    )

  }

  def logout = Action{ implicit request =>
    Redirect(routes.Application.home()).withNewSession
  }


}
