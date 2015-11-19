package controllers

import play.api._
import play.api.mvc._
import controllers.Api._

//import models._
import models.{DB, User}

import scala.util.Random

import settings.Global._

object Application extends Controller {

  def icon = Action {
    Ok(views.html.icon())
  }
  def doc = Action {
    Ok(views.html.index("C'est la doc!!!!"))
  }

  def connected(implicit request : RequestHeader) = request.session.get("connected") match{
    case Some(s) => true
    case None => false
  }

  def home = Action{ implicit request =>
    Ok(views.html.home.home(colors, nbSquaresOneEdge, connected))
  }

  def haveSquares(month: String) = Action{ implicit request =>

    Ok(views.html.haveSquares.haveSquares(month, colors, nbSquaresOneEdge, connected))
  }

  def howItWorks = Action{ implicit request =>
    Ok(views.html.howItWorks.howItWorks(connected))
  }

  def company = Action{ implicit request =>
    Ok(views.html.company.company(contactData, connected))
  }

  def confirmSquares = Action{ implicit request =>
    Ok(views.html.confirmSquares.confirmSquares(colors, nbSquaresOneEdge, connected))
  }


  def register = Action{ implicit request =>
    Ok(views.html.register.register(Api.userForm, Api.loginForm))
  }

  def termsConditions = Action{ implicit request =>
    Ok(views.html.termsConditions.termsConditions(connected))
  }










}




