package models

import play.api.libs.json.Json


case class LittleSquare(id: Long, idSquare: Int, idx: Int, idUser: Long, img: String)

object LittleSquare{
  implicit val format = Json.format[LittleSquare]
}


