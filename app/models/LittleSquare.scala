package models

import play.api.libs.json.Json


case class LittleSquare(idx: Int, idUser: Long, img: String)

object LittleSquare{
  implicit val format = Json.format[LittleSquare]
}


