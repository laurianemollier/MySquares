package controllers


import models._
import play.api.mvc.{Controller, Action}
import settings.Global._


import scala.util.Random

object Development extends Controller  {

  def icon = Action {
    Ok(views.html.icon())
  }
  def doc = Action {
    Ok(views.html.index("C'est la doc!!!!"))
  }


  val r = new Random()
  def init = Action {
    def square(p: Int) = Array.ofDim[(Long, Int)](nbSquares).map{ tupple =>
      val i = r.nextInt(256)
      if(i < p) (-1.toLong, -1)
      else {
        val color = Square.rgbaToInt(r.nextInt(256), r.nextInt(256), r.nextInt(256), 255).get
        (1.toLong, color)
      }
    }

    for(i <- 0 until 6){
      if(i < 2) DB.save(Square(nbSquaresOneEdge, square(250)))
      else DB.save(Square(nbSquaresOneEdge, square(500)))
    }
    Ok("tout est bien: 6 MySquares ont ete ajouter a la base de donne")
  }


  // TODO: Connecter ca a la base de donne et refaire
  val colorsModel = Array.ofDim[Int](nbSquares, 3).map{array =>
    val i = r.nextInt(256)
    if(i < 250) null
    else array.map(x => r.nextInt(256))
  }

  val colors = colorsModel.map{ array =>
    if(array == null) Array(-1, -1, -1)
    else array
  }

  def mailtest = Action{
    send a new Mail (
      from = ("john.smith@mycompany.com", "John Smith"),
      to = Seq("mollierlauriane@gmail.com"),
      subject = "Import stuff",
      message = "Dear Boss..."
    )
    Ok("regarde dans taboite mail!!!!!")
  }

}
