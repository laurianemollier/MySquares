package models

import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.functional.syntax._
import play.api.libs.json._

/**
  *
  * @param id The square id
  * @param nbSquares The total amount of square: nbSquaresOneEdge*nbSquaresOneEdge
  * @param nbSquaresOneEdge the square number in one edge. The total amount of square is nbSquaresOneEdge*nbSquaresOneEdge
  */
case class Square(id: Int, nbSquaresOneEdge: Int, nbSquares: Int)

object Squares {
  val squares = Seq(
    Square(1, 20, 400),
    Square(2, 10, 100)
  )

  val idCurrentSquare = 1

  def nbSquares(id: Int): Int = squares.filter(_.id == id).head.nbSquares
  def nbSquaresOneEdge(id: Int): Int = squares.filter(_.id == id).head.nbSquaresOneEdge
  def isDefine(id: Int): Boolean = squares.exists(_.id == id)

}





//object Square{
//  implicit def tuple2[A : Writes, B : Writes] = Writes[(A, B)] ( t =>  Json.obj("Image" -> t._1, "User" -> t._2))
//
//  implicit val write: Writes[Square] = (
//  (JsPath \ "number of square on one edge").write[Int] and
//  (JsPath \ "squares").write[Seq[(String, Long)]]
//  )(unlift(Square.unapply))
//}

/**
 *
 * @param idMS id of the MySquares that we want to select the squares in the seq
 * @param idxSquare the index of the selected square
 * @param img the image produce by the user in base 64
 * @param emailsToSend The list of friend you want to notify
 */
case class SelectedSquare(idMS: Int, idxSquare: Int, img: String, emailsToSend: List[Option[String]])

object SelectedSquare{

  def selectedSquareForm: Form[SelectedSquare] = Form{
    mapping(
      "idMS" -> number,
      "idxSquare" -> number,
      "img" -> text,
      "emailsToSend" -> list(optional(email)) //Todo: option emails
    )(SelectedSquare.apply)(SelectedSquare.unapply) verifying("Not the correct strign format for the seq", fields => fields match{
      case squares => {
        // TODO: faire la verification: pas deux de meme indice 1,2~7,2
        true
      }
    })
  }




}

