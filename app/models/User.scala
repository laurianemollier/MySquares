package models

//import sun.security.util.Password
import play.api.libs.json.Json

// TODO: Faire que je mot de passe ne sois pas stoker comme ca et tout le tralala
case class User(email: String, password: String)



object User{
  implicit val format = Json.format[User]
}
