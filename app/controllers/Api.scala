package controllers


import javax.inject.Inject
import play.api.mvc.{Action, Call, Controller, RequestHeader}
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import scala.concurrent.duration._

import dao.{LittleSquareRepo, UserRepo}
import controllers.Authentication._
import settings.Global.LogRegCont
import models.LoginData._
import models.RegisterData._
import models.SelectedSquare._
import models.{LittleSquare, User}
import controllers.FlashSession._


import scala.concurrent.{Await, Future}


// TODO: You are using status code '200' with flashing, which should only be used with a redirect status!
class Api @Inject()(littleSquareRepo: LittleSquareRepo, userRepo: UserRepo) extends Controller {


  def getSquares = Action.async { implicit request =>
    littleSquareRepo.all().map(s => Ok(s.map(l => l.toString).mkString(" ")))
  }
  def getUsers = Action.async { implicit request =>
    userRepo.all().map(s => Ok(s.map(l => l.toString).mkString(" ")))
  }

  def selectSquare = Action.async { implicit request =>
    getUserId match {
      case None => {
        Future(1).map(_ =>
          Redirect(routes.Application.login())
        )
      }
      case Some(idUser) => {
        selectedSquareForm.bindFromRequest.fold(
          errorForm => {
            Future(1).map(_ => Redirect(routes.Application.contact()).flashing(
              "mainError" -> "Le formulaire pour pour selectionner les petits carree ne sont pas bon"
            ))
          },
          selectedSquare => {
            addSelectedSquare(selectedSquare.idxSquare, idUser, selectedSquare.img).map(ftp => ftp match {
              case 200 => {
                //TODO: Envoyer les email
                Redirect(routes.Application.home()) // TODO: montrer qu'on a bien selectionné son petit carré.
              }
              case _ => Redirect(routes.Application.contact()).flashing(
                  "mainError" -> "Le formulaire pour pour selectionner les petits carree ne sont pas bon" // TODO
              )
            })
          }
        )
      }
    }
  }



  def logout = Action { implicit request =>
    Redirect(routes.Application.home()).withNewSession.flashing(
      "logout" -> ""
    )
  }

  /**
   * Action for login, Form: loginForm
   * @return
   */
  def login = Action.async { implicit request =>
    loginForm.bindFromRequest.fold(
      errorForm => {
        Future(1).map(_ =>
          BadRequest(views.html.loginRegisterContact.loginRegisterContact(LogRegCont.login, registerForm, errorForm))
        )
      },
      loginData => {
        askLogin(loginData.email, loginData.password).map{case (ftp, user) => ftp match {
          case 200 => Redirect(redirectByFlash(request)).withSession(
            "email" -> loginData.email,
            "idUser" -> user.get.id.toString
          ).flashing(
            "login" -> "success"
          )
          case _ => Redirect(routes.Api.login()).flashing(
            "errorLogin" -> "",
            "redirection" -> getRedirectionFlashString // TODO: redirection after the second login does not work
          )
        }}
      }
    )
  }


  /**
   * Action for add an user, Form: registerForm
   * @return
   */
  def addUser = Action.async{ implicit request =>
    registerForm.bindFromRequest.fold(
      errorFrom => {
        Future(1).map(_ =>
          BadRequest(views.html.loginRegisterContact.loginRegisterContact(LogRegCont.register, errorFrom, loginForm))
        )
      },
      user => {
        val responseUser = askAddUser(user.email, user.password)
        responseUser.map(res => res.get("FTP").get.toInt match {
          case 331 => Redirect(routes.Application.login()).flashing(
            "email" -> user.email
          )
          case 200 => Redirect(redirectByFlash(request)).withSession(
            "email" -> user.email,
            "idUser" -> 1.toString//res.get("idUser").get
          ).flashing(
            "login" -> "success"
          )
        })
      }
    )
  }


  /**
   * Check if the user do not already exist
   * @param email The given email
   * @param password The given password
   * @return FTP server return codes, key: "FTP"
   *         the email, key: "email"
   *         The user id if everything is all right, key: "idUser"
   */
  def askAddUser(email: String, password: String): Future[Map[String, String]] ={
    userRepo.getUser(email).map( opUser => opUser match {
      case Some(user) => Map(
        "FTP" -> 331.toString,
        "email" -> email // User name exists already, need password
      )
      case None => {
        val (hashPassword, salt1, salt2) = encryptPassword(password)
        val user = User(1, email, hashPassword, salt1.mkString(","), salt2)
        val idUser = userRepo.add(user)

        Map(
          "FTP" -> 200.toString,
          "email" -> email,
          "idUser" -> Await.result(idUser, 10 seconds).toString
        )
      }
    })
  }

  /**
   * Aks to login, check if the user exist a
   * @param email The given email
   * @param password The given password
   * @return FTP server return codes and the user if everything is all right
   */
  def askLogin(email: String, password: String): Future[(Int, Option[User])] = {
    userRepo.getUser(email).map(opUser => opUser match {
      case None => (430, None)
      case Some(userDB) => {
        if(verifyPassword(password, userDB.passwordHash, userDB.salt1.split(',').map{i => i.toByte}, userDB.salt2)){
          (200, Some(userDB))
        }
        else (331, None) // User name okay, need password
      }
    })
  }


  /**
  * Verify if the square is not already taken, if not, add this square
  * @param idUser user's id who want the square
  * @param idxSquare the index of the selected square
  * @param img the image produce by the user in base 64
   * @return FTP server return codes
   */
  def addSelectedSquare(idxSquare: Int, idUser: Long, img: String): Future[Int] ={
    littleSquareRepo.findByIdx(idxSquare).map(ls =>
      if(ls.idUser != -1) 504
      else{
        val newLs = LittleSquare(idxSquare, idUser, img: String)
        littleSquareRepo.modify(newLs)
        200
      }
    )
  }


}

