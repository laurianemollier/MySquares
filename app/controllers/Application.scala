package controllers

import play.api._
import play.api.mvc._

import scala.util.Random

class Application extends Controller {

  val nbSquaresOneEdge = 50
  val r = new Random()

  // TODO: Connecter ca a la base de donne et refaire
  val colorsModel = Array.ofDim[Int](nbSquaresOneEdge*nbSquaresOneEdge, 3).map{array =>
    val i = r.nextInt(256)
    if(i < 230) null
    else array.map(x => r.nextInt(256))
  }

  val colors = colorsModel.map{ array =>
    if(array == null) Array(255, 255, 255)
    else array
  }
  val freeSquares = colorsModel.map{ array =>
    if(array == null) true
    else false
  }

  def icon = Action {
    Ok(views.html.icon())
  }
  def doc = Action {
    Ok(views.html.index("C'est la doc!!!!"))
  }

  def home = Action{
    Ok(views.html.home.home(colors, freeSquares, nbSquaresOneEdge))
  }

  def haveSquares(month: String) = Action{
    Ok(views.html.haveSquares.haveSquares(month, colors, freeSquares, nbSquaresOneEdge))
  }

  def howItWorks = Action{
    Ok(views.html.howItWorks.howItWorks())
  }

  def company = Action{
    Ok(views.html.company.company())
  }

  def confirmSquares = Action{
    Ok(views.html.confirmSquares.confirmSquares(colors, freeSquares, nbSquaresOneEdge))
  }


  def register = Action{
    Ok(views.html.register.register())
  }




//  register

}
