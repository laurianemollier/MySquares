package controllers

import org.mindrot.jbcrypt.BCrypt
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

  // TODO: Faire une page pour actitiver le javascript
  def addUser = Action{ implicit request =>
    userForm.bindFromRequest.fold(
      errorFrom => {
        BadRequest(views.html.register.register(errorFrom, loginForm))
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


  //TODO: set the passwords errors
  val userForm: Form[UserData] = Form{
    mapping("email" -> email,
      "password" -> nonEmptyText,
      "verifyingPassword" -> nonEmptyText,
      "termCondition" -> boolean
    )(UserData.apply)(UserData.unapply) verifying("Not the same password ", fields => fields match {
      case userData => userData.password == userData.verifyingPassword && passwordCheck(userData.password) && userData.termCondition
    })
  }

  // Password matching expression. Password must be at least 8 characters, no more than 30 characters,
  // and must include at least one upper case letter, one lower case letter, and one numeric digit.
  val reg = """^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}$""".r
  def passwordCheck(password: String) ={
    password match {
      case reg() => true
      case _ => false
    }
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
