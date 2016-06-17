package controllers

import javax.inject.Inject


import controllers.FlashSession._
import models.LittleSquare

import dao.{LittleSquareRepo, UserRepo}
import play.api.mvc.{Action, Call, Controller, RequestHeader}
import play.api.i18n.{I18nSupport, MessagesApi, Messages, Lang}


import play.api.libs.concurrent.Execution.Implicits.defaultContext
import settings.Global._
import models.LoginData._
import models.RegisterData._
import models.SelectedSquare._
import models.ContactData._
import models.Squares._

import scala.concurrent.Future


// TODO: You are using status code '200' with flashing, which should only be used with a redirect status!

@javax.inject.Inject
class Application @Inject()( littleSquareRepo: LittleSquareRepo, userRepo: UserRepo, val messagesApi: MessagesApi) extends Controller with I18nSupport{

  def home = Action.async { implicit request =>
    littleSquareRepo.all(idCurrentSquare).map(littleSquares => {
      val squares: Seq[(String, Long)] = littleSquares.map(ls => (ls.img, ls.idUser))

      val idxSquaresUser: Seq[Int] = getUserId match {
        case None => Seq()
        case Some(userId) => squares.zipWithIndex.filter({
          case ((img, idUsers), idxSquare) => userId == idUsers
        }).map{
          case ((img, idUsers), idxSquare) =>  idxSquare
        }
      }
      Ok(views.html.home.home(squares, nbSquaresOneEdge(idCurrentSquare), idxSquaresUser, companyData, connected))
    })
  }

  def haveSquares(id: Int) = Action.async{ implicit request =>
    if(isDefine(id)){
      if(connected){
        littleSquareRepo.all(id).map(littleSquares => {
          val squares: Seq[(String, Long)] = littleSquares.map(ls => (ls.img, ls.idUser))
          Ok(views.html.haveSquares.haveSquares(squares, nbSquaresOneEdge(id), companyData, connected)(selectedSquareForm)).withLang(Lang("en"))
        })
      }
      else {
        //      implicit val userLang = Lang("fr")
        Future(Ok(views.html.loginRegisterContact.loginRegisterContact(LogRegCont.login, registerForm, loginForm, contactForm, companyData))
          .withLang(Lang("en"))
          .flashing{
            "redirection" -> "haveSquares"
          })
      }
    }
    else{
      Future.successful(Ok(views.html.errorPage.error404(companyData, connected)))
    }
  }

  def howItWorks = Action{ implicit request =>
    Ok(views.html.howItWorks.howItWorks(companyData, connected)).withLang(Lang("en"))
  }

  def company = Action{ implicit request =>
    Ok(views.html.company.company(contactForm, companyData, connected)).flashing{
      "redirection" -> "company"
    }
  }


  def register = loginRegisterContact(LogRegCont.register)
  def login = loginRegisterContact(LogRegCont.login)
  def contact = loginRegisterContact(LogRegCont.contact)

  def loginRegisterContact(redirect: LogRegCont.LogRegCont) = Action{ implicit request =>
    Ok(views.html.loginRegisterContact.loginRegisterContact(redirect, registerForm, loginForm, contactForm, companyData)).withLang(Lang("en"))
  }


  def termsConditions = Action{ implicit request =>
    Ok(views.html.termsConditions.termsConditions(companyData, connected))
  }

  def noFound = Action{ implicit request =>
    Ok(views.html.errorPage.error404(companyData, connected))
  }



}



