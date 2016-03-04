package settings

import models._
import play.api._
import play.api.mvc._
import com.typesafe.config.{Config, ConfigFactory}
import play.filters.csrf._

import scala.util.Random

object Global extends WithFilters(CSRFFilter()) with GlobalSettings {

  val nbSquaresOneEdge = 50
  val nbSquares = nbSquaresOneEdge*nbSquaresOneEdge

  val idCurrentMS = 1

  // square data
  //val nbSquaresOneEdge = 100
  val r = new Random()

  // TODO: Mettre dans le footer aussi et reoganiser le code
  //contact data
  val contactData = Map("phoneNumber" -> "+33 4 50 62 29 24",
    "email" -> "mollierlaurian@gmail.com",
    "address" -> "Not yet available"
  )

  object MySquareName extends Enumeration {
    type MySquareName = Value
    val January, February, March = Value
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

  override def onStart(app: Application) {


//    // Here I use typesafe config to get config data out of application conf
//    val cfg: Config = ConfigFactory.load()
//
//
//    val initialValue = cfg.getInt(shared.initial)
//    // set initial value for shared
//    Shared.setData(initialValue)
  }
}
