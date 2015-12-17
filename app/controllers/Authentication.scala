package controllers

import controllers.Api._
import controllers.Application.LogRegCont

import org.mindrot.jbcrypt.BCrypt
import play.api.data.Forms._
import play.api.mvc.Action
import settings.Global._
import sorm.Persisted

import models._
import models.RegisterData.registerForm
import models.LoginData.loginForm

object Authentication {

  // user
  def addUser = Action{ implicit request =>
    registerForm.bindFromRequest.fold(
      errorFrom => {
        BadRequest(views.html.loginRegisterContact.loginRegisterContact(LogRegCont.register, errorFrom, loginForm))
      },
      user => {
        val email: Option[User with Persisted] = DB.query[User].whereEqual("email", user.email).fetchOne()
        email match{
          // the user is already register
          case Some(email) => Redirect(routes.Application.login()).flashing(
            "email" -> user.email
          )
          case None => {
            val hashPassword = BCrypt.hashpw(user.password, BCrypt.gensalt()) // TODO: verrifer que ce truc est bon
            DB.save(User(user.email, hashPassword))
            Redirect(routes.Application.home()).flashing(
              "login" -> "success"
            ).withSession(
              "connected" -> user.email
            )
          }
        }
      }
    )
  }

  def login = Action { implicit request =>
    loginForm.bindFromRequest.fold(
      errorForm => {
        //  TODO: faire le css
        BadRequest(views.html.loginRegisterContact.loginRegisterContact(LogRegCont.login, registerForm, errorForm))
      },
      loginData => {
        getUser(loginData.email) match {
          case None => Redirect(routes.Api.login()).flashing(
            "errorLogin" -> "Not registered"
          )
          case Some(userDB) => {
            if(BCrypt.checkpw(loginData.password, userDB.password)){
              Ok(views.html.home.home(colors, nbSquaresOneEdge, true)).withSession(
                "connected" -> loginData.email
              )
            }
            else{
              Redirect(routes.Api.login()).flashing(
                "errorLogin" -> "Wrong password"
              )
            }
          }
        }
      }
   )

  }






}
