package models

//import sun.security.util.Password
import play.api.libs.json.Json

// TODO: Faire que je mot de passe ne sois pas stoker comme ca et tout le tralala
case class Person(email: Email, password: String) {



}
object Person{
//  implicit val format = Json.format[Person]
}
