package models

import play.api.data.Forms._
import play.api.data.{Form, Mapping}
import play.api.data.validation.{ValidationError, Invalid, Valid, Constraint}
import play.api.libs.json.Json


case class SubmitSquare(idSquare: Int, img: String, emailsToSend: List[String])

object SubmitSquare{

  implicit val format = Json.format[SubmitSquare]

  val submitSquareForm: Form[SubmitSquare] = Form{
    mapping("idSquare" -> number,
    "img" -> text,
    "emailsToSend" -> list(email))(SubmitSquare.apply)(SubmitSquare.unapply)
  }
}
