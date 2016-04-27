package controllers


import models._
import play.api.libs.json.Json
import play.api.mvc.{Controller, Action}
import settings.Global._

import controllers.Api._


import scala.util.Random

object Development extends Controller  {

  def icon = Action {
    Ok(views.html.icon())
  }
  def doc = Action {
    Ok(views.html.index("C'est la doc!!!!"))
  }


  def init = Action {
    def square = Array.ofDim[(String, Int)](nbSquares).map{ tupple =>
      ("", -1)
    }
    for(i <- 0 until 1){
      DB.save(Square(nbSquaresOneEdge, square))
    }
    Ok("tout est bien: 6 MySquares ont ete ajouter a la base de donne")
  }



  def addRandomSquare = Action{ implicit request =>

    val base64_1 = "data:image/png;base64,xfSAqVVYkQoC102YmzC17FgDAYHfPHUYQwbL1g1rh1gCpmqa1WPnfeqi23zDWea1lSV1KTCiZjQk5UpeldJaag5VtDA16+QGlXXyUgFQrSwo9aRoDkznllS+9jxgVte8Ua6RPJkgjUHYrhwJAksNSwJQbkLstHyADmKHq6xqW4f2jh6w6pGWfACmhHYDHnDFUiAmV6gVL/qpq4k5VXXrukXXnxRdfkCtWrUqST1IN4ALgIPUE+o2jBMIA2AhMREf0GLMCD8c+Y7yFPNXLEdcL8Qko/yksZBbariF0mjnZ4vReDH6tjNtjlfZmgro45ViTidTYAVRIBg6zOQ973mP/fCHPzTm6IQBAFkNoAmGXMx+MKEwNOAMkAAeXK9evTpdAzQcAA9STgAOK1+gjsO/aK1Gurw3QCyYWVgdAmyzXeQvwI97woV/pEG8SJ+wRRdhi375OlNgpVIgtfGVmrmcr0yB40GBYNKo9m644YY0j+cHP="

    val base64 = "aaaaa"
    addSelectedSquare(1,4,4, base64) match {
      case 200 => Ok("ok")
      case 50 => Ok("existe pas")
      case _ => Ok("pas marchée")
    }

//    val squares = DB.query[Square].fetch
//    Ok(Json.toJson(squares))

//    Ok("dddd")

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
