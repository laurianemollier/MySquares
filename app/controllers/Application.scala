package controllers

import javax.inject.Inject


import controllers.FlashSession._
import models.LittleSquare

import dao.{LittleSquareRepo, UserRepo}
import play.api.mvc.{Action, Call, Controller, RequestHeader}
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import settings.Global._
import models.LoginData._
import models.RegisterData._
import models.SelectedSquare._
import models.ContactData._

import scala.concurrent.Future


// TODO: You are using status code '200' with flashing, which should only be used with a redirect status!

class Application @Inject()( littleSquareRepo: LittleSquareRepo, userRepo: UserRepo) extends Controller {

  def home = Action.async { implicit request =>
    littleSquareRepo.all().map(littleSquares => {
      val squares: Seq[(String, Long)] = littleSquares.map(ls => (ls.img, ls.idUser))

      val idxSquaresUser: Seq[Int] = getUserId match {
        case None => Seq()
        case Some(userId) => squares.zipWithIndex.filter({
          case ((img, idUsers), idxSquare) => userId == idUsers
        }).map{
          case ((img, idUsers), idxSquare) =>  idxSquare
        }
      }
      Ok(views.html.home.home(squares, nbSquaresOneEdge, idxSquaresUser, companyData, connected))
    })
  }

  def haveSquares(id: Int) = Action.async{ implicit request =>
    if(connected){
      littleSquareRepo.all().map(littleSquares => {
        val squares: Seq[(String, Long)] = littleSquares.map(ls => (ls.img, ls.idUser))
        Ok(views.html.haveSquares.haveSquares(squares, nbSquaresOneEdge, companyData, connected)(selectedSquareForm))
      })
    }
    else {
      Future(1).map(_ => Ok(views.html.loginRegisterContact.loginRegisterContact(LogRegCont.login, registerForm, loginForm, contactForm, companyData)).flashing {
        "redirection" -> "haveSquares"
      })
    }
  }

  def howItWorks = Action{ implicit request =>
    Ok(views.html.howItWorks.howItWorks(companyData, connected))
  }

  def company = Action{ implicit request =>
    Ok(views.html.company.company(contactForm, companyData, connected)).flashing {
      "redirection" -> "company"
    }
  }


  def register = loginRegisterContact(LogRegCont.register)
  def login = loginRegisterContact(LogRegCont.login)
  def contact = loginRegisterContact(LogRegCont.contact)

  def loginRegisterContact(redirect: LogRegCont.LogRegCont) = Action{ implicit request =>
    Ok(views.html.loginRegisterContact.loginRegisterContact(redirect, registerForm, loginForm, contactForm, companyData))
  }


  def termsConditions = Action{ implicit request =>
    Ok(views.html.termsConditions.termsConditions(companyData, connected))
  }

  def noFound = Action{ implicit request =>
    Ok(views.html.errorPage.error404(companyData, connected))
  }



}



