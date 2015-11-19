package models

//import sun.security.util.Password
import play.api.libs.json.Json
import settings.Global._

case class UserData(email: String, password: String, verifyingPassword: String, termCondition: Boolean){
  def getUser = User(email, password)
}

object UserData{
  implicit  val format = Json.format[UserData]

}


case class User(email: String, password: String)

object User{

  implicit val format = Json.format[User]


}



case class LoginData(email: String, password: String)