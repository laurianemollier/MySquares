package controllers


import javax.inject.Inject
import play.api.mvc.{Action, Call, Controller, RequestHeader}
import play.api.i18n.{I18nSupport, MessagesApi, Messages, Lang}
import play.api.libs.concurrent.Execution.Implicits.defaultContext


import dao.{LittleSquareRepo, UserRepo}
import controllers.Authentication._
import settings.Global.LogRegCont
import models.LoginData._
import models.RegisterData._
import models.ContactData._
import models.SelectedSquare._
import models.{LittleSquare, MyUser}
import controllers.FlashSession._
import settings.Global._


import scala.concurrent.{Await, Future}

// email
import play.api.libs.mailer._
import java.io.File
import org.apache.commons.mail.EmailAttachment

import play.api.mvc.Cookie
import play.api.mvc.DiscardingCookie


// TODO: You are using status code '200' with flashing, which should only be used with a redirect status!
class Api @Inject()(littleSquareRepo: LittleSquareRepo, userRepo: UserRepo,
                    val messagesApi: MessagesApi, mailerClient: MailerClient) extends Controller with I18nSupport {

  val askDB = new AskDB(littleSquareRepo, userRepo)

  def getSquares = Action.async { implicit request =>
    littleSquareRepo.all().map(s => Ok(s.map(l => l.toString).mkString(" ")))
  }
  def getUsers = Action.async { implicit request =>
    userRepo.all().map(s => Ok(s.map(l => l.toString).mkString(" ")))
  }


  def contactUs = Action{ implicit request =>
    contactForm.bindFromRequest.fold(
      errorForm => {
          BadRequest(views.html.loginRegisterContact.loginRegisterContact(LogRegCont.contact, registerForm, loginForm, errorForm, companyData))
      },
      contactData => {
        val email = Email(
          "Simple email",
          "Square it FROM <" + contactData.email +">",
          Seq("Miss TO <mollierlauriane@gmail.com>"),
          bodyText = Some("From:" +  contactData.email + " \n \n " + contactData.text)
        )
        mailerClient.send(email)
        Redirect(redirectByFlash(request)).flashing(
          "sendEmail" -> "Email send"
        )
      }
    )
  }

  def emailSeeMySquare(to: String, from: String) = Email(
    "Discover",
    "Square it FROM <" + from +">",
    Seq("Miss TO <"+ to +">"),
    bodyText = Some("blabalabalablabalablabalb")
  )

  def selectSquare = Action.async { implicit request =>
    getUserId match {
      case None => {
        Future(
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
            askDB.addSelectedSquare(selectedSquare.idMS, selectedSquare.idxSquare, idUser, selectedSquare.img).map(ftp => ftp match {
              case 200 => {
                val emails = selectedSquare.emailsToSend.filter(op => op.isDefined).map(op => op.get)
                for(email <- emails){
                  val toSend =  emailSeeMySquare(email, getUserEmail.get)
                  mailerClient.send(toSend)
                }
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


  def loginByCookies = Action.async { implicit request =>
    val email = request.cookies.get(cookieEmail)
    val hash = request.cookies.get(cookieHash)

    if(email.isDefined && hash.isDefined){
      askDB.askLoginFromHash(email.get.value, hash.get.value).map{case (ftp, user) => ftp match {
        case 200 => Redirect(redirectByFlash(request)).withSession(
          "email" -> user.get.email,
          "idUser" -> user.get.id.toString
        )
        case _ => Ok("wwwccc") //Redirect(redirectByFlash(request))
      }}
    }
    else Future(Ok("ccc"))//Future(1).map(_ => Redirect(redirectByFlash(request)))
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
        Future(
          BadRequest(views.html.loginRegisterContact.loginRegisterContact(LogRegCont.login, registerForm, errorForm, contactForm, companyData))
        )
      },
      loginData => {
        askDB.askLogin(loginData.email, loginData.password).map{case (ftp, user) => ftp match {
          case 200 => Redirect(redirectByFlash(request)).withSession(
            "email" -> loginData.email,
            "idUser" -> user.get.id.toString
          ).flashing(
            "login" -> "success"
          ).withCookies(Cookie(cookieEmail, loginData.email), Cookie(cookieHash, user.get.passwordHash))
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
        Future(
          BadRequest(views.html.loginRegisterContact.loginRegisterContact(LogRegCont.register, errorFrom, loginForm, contactForm, companyData))
        )
      },
      user => {
        val responseUser = askDB.askAddUser(user.firstName, user.lastName, user.email, user.password)
        responseUser.map(res => res.get("FTP").get.toInt match {
          case 331 => Redirect(routes.Application.login()).flashing(
            "email" -> user.email
          )
          case 200 => Redirect(redirectByFlash(request)).withSession(
            "email" -> user.email,
            "idUser" -> res("idUser")
          ).flashing(
            "login" -> "success"
          ).withCookies(Cookie(cookieEmail, user.email), Cookie(cookieHash, res("password")))
        })
      }
    )
  }


}



