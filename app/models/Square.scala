package models

import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.data.Forms._
import play.api.data.{Form, Mapping}
import scala.util.matching.Regex

/**
 *
 * @param nbSquaresOneEdge the square number in one edge. The total amount of square is nbSquaresOneEdge*nbSquaresOneEdge
 * @param squares the hole MySquare. Caracterized by the image produce by the user in base 64, and the user id who produce it
 */
case class Square(nbSquaresOneEdge: Int, squares: Seq[(String, Int)]){

  if(squares.length != nbSquaresOneEdge*nbSquaresOneEdge){
    throw new IllegalArgumentException("Array must be of size nbSquaresOneEdge*nbSquaresOneEdge")
    // TODO: Faire les autres verifications
  }
}

object Square{
  implicit def tuple2[A : Writes, B : Writes] = Writes[(A, B)] ( t =>  Json.obj("Image" -> t._1, "User" -> t._2))

  implicit val write: Writes[Square] = (
  (JsPath \ "number of square on one edge").write[Int] and
  (JsPath \ "squares").write[Seq[(String, Int)]]
  )(unlift(Square.unapply))
}

/**
 *
 * @param idMS id of the MySquares that we want to select the squares in the seq
 * @param idxSquare the index of the selected square
 * @param img the image produce by the user in base 64
 * @param emailsToSend The list of friend you want to notify
 */
case class SelectedSquare(idMS: Int, idxSquare: Int, img: String, emailsToSend: List[String])

object SelectedSquare{

  def selectedSquareForm: Form[SelectedSquare] = Form{
    mapping(
      "idMS" -> number,
      "idxSquare" -> number,
      "img" -> text,
      "emailsToSend" -> list(text) //Todo: option emails
    )(SelectedSquare.apply)(SelectedSquare.unapply) verifying("Not the correct strign format for the seq", fields => fields match{
      case squares => {
        // TODO: faire la verification: pas deux de meme indice 1,2~7,2
        true
      }
    })
  }




}

