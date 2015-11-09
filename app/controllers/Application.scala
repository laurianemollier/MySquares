package controllers

import play.api._
import play.api.mvc._

import scala.util.Random

object Application extends Controller {

  // square data
  val nbSquaresOneEdge = 100
  val r = new Random()

  // TODO: Mettre dans le footer aussi et reoganiser le code
  //contact data
  val contactData = Map("phoneNumber" -> "+33 4 50 62 29 24",
    "email" -> "mollierlaurian@gmail.com",
    "address" -> "Not yet available"
  )


  // TODO: Connecter ca a la base de donne et refaire
  val colorsModel = Array.ofDim[Int](nbSquaresOneEdge*nbSquaresOneEdge, 3).map{array =>
    val i = r.nextInt(256)
    if(i < 250) null
    else array.map(x => r.nextInt(256))
  }

  val colors = colorsModel.map{ array =>
    if(array == null) Array(-1, -1, -1)
    else array
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
    Ok(views.html.haveSquares.haveSquares(month, colors, nbSquaresOneEdge))
  }

  def howItWorks = Action{
    Ok(views.html.howItWorks.howItWorks())
  }

  def company = Action{
    Ok(views.html.company.company(contactData))
  }

  def confirmSquares = Action{
    Ok(views.html.confirmSquares.confirmSquares(colors, nbSquaresOneEdge))
  }


  def register = Action{
    Ok(views.html.register.register())
  }

  def termsConditions = Action{
    Ok(views.html.termsConditions.termsConditions())
  }



//  register

}
