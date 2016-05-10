package controllers


import play.api._
import play.api.mvc._


import models._
import models.RegisterData.registerForm
import models.LoginData.loginForm
import models.SelectedSquare.selectedSquareForm



import settings.Global._

object Application extends Controller {




// get the session params
  def connected(implicit request : RequestHeader) = request.session.get("email") match{
    case Some(s) => true
    case None => false
  }

  def getUserId(implicit request : RequestHeader): Option[Int] = request.session.get("idUser") match{
    case Some(id) => Some(id.toInt)
    case None => None
  }



  def redirectByFlash(implicit request : RequestHeader, default: Call = routes.Application.home()): Call = {
    val redirection = Map(
      "haveSquares" -> routes.Application.haveSquares(idCurrentMS),
      "home" -> routes.Application.home()
    )

    request.flash.get("redirection") match {
      case None => default
      case Some(redirect) => redirection.get(redirect).getOrElse(default)
    }
  }

  def getRedirectionFlashString(implicit request : RequestHeader): String =
    request.flash.get("redirection").getOrElse("")

  def home = Action{ implicit request =>
    Api.getSquare(idCurrentMS) match {
      case null => BadRequest(views.html.errorPage.error404(connected)) // TODO: dire qu'il faut contacter
      case square: Square => {
        val idxSquaresUser: Seq[Int] = getUserId match {
          case None => Seq()
          case Some(userId) => square.squares.zipWithIndex.filter({
            case ((img, idUsers), idxSquare) => userId == idUsers
          }).map{
            case ((img, idUsers), idxSquare) =>  idxSquare
          }
        }

        Ok(views.html.home.home(square, idxSquaresUser, connected))
      }
    }
  }

  def haveSquares(id: Int) = Action{ implicit request =>
    Api.getSquare(id) match {
      case null => BadRequest(views.html.errorPage.error404(connected))
      case square: Square => {
        // You need to be authentified if you want to have a square
        if(connected){
          Ok(views.html.haveSquares.haveSquares(square, connected)(selectedSquareForm))
        }
        else {
          Ok(views.html.loginRegisterContact.loginRegisterContact(LogRegCont.login, registerForm, loginForm)).flashing{
            "redirection" -> "haveSquares"
          }
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




