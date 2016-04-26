package controllers


import play.api._
import play.api.mvc._

import models._
import models.RegisterData.registerForm
import models.LoginData.loginForm


import settings.Global._

object Application extends Controller {


  def connected(implicit request : RequestHeader) = request.session.get("email") match{
    case Some(s) => true
    case None => false
  }

  def getUserId(implicit request : RequestHeader): Option[Long] = request.session.get("idUser") match{
    case Some(id) => Some(id.toLong)
    case None => None
  }

  def home = Action{ implicit request =>
    Api.getColorSquare(idCurrentMS) match {
      case null => BadRequest(views.html.errorPage.error404(connected)) // TODO: dire qu'il faut contacter
      case (colors: Array[Array[Int]], nbSquaresOneEdge: Int) => {
        Ok(views.html.home.home(colors, nbSquaresOneEdge, connected))
      }
    }
  }

  def haveSquares(id: Int) = Action{ implicit request =>
    Api.getColorSquare(id) match {
      case null => BadRequest(views.html.errorPage.error404(connected))
      case (colors: Array[Array[Int]], nbSquaresOneEdge: Int) => {

        // You need to be authentified if you want to have a square
        if(connected){
          Ok(views.html.haveSquares.haveSquares(id, colors, nbSquaresOneEdge, connected)(SubmitSquare.submitSquareForm))
        }
        else {
          Ok(views.html.loginRegisterContact.loginRegisterContact(LogRegCont.login, registerForm, loginForm)) // TODO: imbriquer les actions
        }
      }
    }
  }

  def howItWorks = Action{ implicit request =>
    Ok(views.html.howItWorks.howItWorks(connected))
  }

  def company = Action{ implicit request =>
    Ok(views.html.company.company(contactData, connected))
  }

// login - register - contact
  object LogRegCont extends Enumeration {
    type LogRegCont = Value
    val login, register, contact = Value
  }

  def register = loginRegisterContact(LogRegCont.register)
  def login = loginRegisterContact(LogRegCont.login)
  def contact = loginRegisterContact(LogRegCont.contact)

  def loginRegisterContact(redirect: LogRegCont.LogRegCont) = Action{ implicit request =>
    Ok(views.html.loginRegisterContact.loginRegisterContact(redirect, registerForm, loginForm))
  }


  def termsConditions = Action{ implicit request =>
    Ok(views.html.termsConditions.termsConditions(connected))
  }


  def confirmSquares = Action{ implicit request =>
    Ok(views.html.confirmSquares.confirmSquares(colors, nbSquaresOneEdge, connected, registerForm, loginForm))
  }


  def noFound = Action{ implicit request =>
    Ok(views.html.errorPage.error404(connected))
  }

}




