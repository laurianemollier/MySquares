package models

import play.api.libs.json.Json


case class LittleSquare(id: Long, idSquare: Int, idx: Int, idUser: Long, img: String){
  def isValid: Boolean = {
    !img.isEmpty // TODO mettre de vraie contraintes
  }

}

object LittleSquare{
  implicit val format = Json.format[LittleSquare]

  // TODO: Set the format of img

}


