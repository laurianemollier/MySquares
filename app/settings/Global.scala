package settings

import scala.util.Random

object Global {

  // square data
  val nbSquaresOneEdge = 20
  val nbSquares = nbSquaresOneEdge*nbSquaresOneEdge

  val idCurrentMS = 1

  val r = new Random()

  val companyData: Map[String, String] =
    Map("phoneNumber" -> "+33 4 50 62 29 24",
    "email" -> "mollierlaurian@gmail.com",
    "address" -> "Not yet available",
    "name" -> "Square it",
    "owner" -> "Lauriane Mollier"
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

  // login - register - contact
  object LogRegCont extends Enumeration {
    type LogRegCont = Value
    val login, register, contact = Value
  }
}
