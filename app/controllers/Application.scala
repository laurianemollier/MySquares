package controllers

import play.api._
import play.api.mvc._

import scala.util.Random

class Application extends Controller {

  val nbSquaresOneEdge = 100
  val r = new Random()

  // TODO: Connecter ca a la base de donne et refaire
  val colorsModel = Array.ofDim[Int](nbSquaresOneEdge*nbSquaresOneEdge, 3).map{array =>
    val i = r.nextInt(256)
    if(i < 70) null
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
    Ok(views.html.home.home(colors, nbSquaresOneEdge))
  }

  def haveSquares(month: String) = Action{
    Ok(views.html.haveSquares.haveSquares(month, colors, freeSquares, nbSquaresOneEdge))
  }

  def howItWorks = Action{
    Ok(views.html.howItWorks.howItWorks())
  }

  def blog = Action{
    Ok(views.html.blog.blog())
  }

  def about = Action{
    Ok(views.html.about.about())
  }

  def contact = Action{
    Ok(views.html.contact.contact())
  }
  def improve = Action{
    Ok(views.html.improve.improve())
  }

  def register = Action{
    Ok(views.html.register.register())
  }


//  register

}
