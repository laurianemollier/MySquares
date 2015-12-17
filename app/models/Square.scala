package models

import play.api.libs.json._
import play.api.libs.functional.syntax._
import play.api.data.Forms._
import play.api.data.{Form, Mapping}
import scala.util.matching.Regex


case class Square(nbSquaresOneEdge: Int, squares: Seq[(Long, Int)]){

  if(squares.length != nbSquaresOneEdge*nbSquaresOneEdge){
    throw new IllegalArgumentException("Array must be of size nbSquaresOneEdge*nbSquaresOneEdge")
    // TODO: Faire les autres verifications
  }

  def index(x: Int, y: Int) = x + nbSquaresOneEdge * y

  def coordX(n: Int) = n % nbSquaresOneEdge

  def coordY(n: Int) = n / nbSquaresOneEdge

  def coord(n: Int) = (coordX(n), coordY(n))

  def getArray = {
    val copy = Array.ofDim[(Long, Int)](nbSquaresOneEdge*nbSquaresOneEdge)
    squares.copyToArray(copy)
    copy
  } // TODO: uhhhhhhhhhhhhhhhhh mais je ne vois pas comment faire pour el moment


//  def update(x: Int, y: Int, idUser: Long, color: (Int, Int, Int, Int)) = ?
}

object Square{

  def rgbaToInt(r: Int, g: Int, b: Int, a: Int): Option[Int] = {
    if(!(0<= r && r <= 255)) None
    else if(!(0<= g && g <= 255)) None
    else if(!(0<= b && b <= 255)) None
    else if(!(0<= a && a <= 255)) None
    else {
      Some(r << 8*3 | g<< 8*2 | b << 8 | a)
    }
  }

  def r(i: Int) = i >>> 8*3
  def g(i: Int) = i >>> 8*2 & 255
  def b(i: Int) = i >>> 8 & 255
  def a(i: Int) = i & 255


  implicit def tuple2[A : Writes, B : Writes] = Writes[(A, B)] ( t =>  Json.obj("User" -> t._1, "color" -> t._2))

  implicit val write: Writes[Square] = (
  (JsPath \ "number of square on one edge").write[Int] and
  (JsPath \ "squares").write[Seq[(Long, Int)]]
  )(unlift(Square.unapply))



}


//TODO: A faire tout ca

/**
 * idMS: id of the MySquares that we want to select the squares in the seq
 * seq: seq of (idUser, r, g, b)
 */
case class SelectedSquares(idMS: Int, seq: String)

object SelectedSquares{

  def selectedSquaresForm: Form[SelectedSquares] = Form{
    mapping(
      "idMS" -> number,
      "seq" -> text
    )(SelectedSquares.apply)(SelectedSquares.unapply) verifying("Not the correct strign format for the seq", fields => fields match{
      case squares => {
// TODO: faire la verification: pas deux de meme indice 1,2~7,2



        true
      }
    })
  }




}

