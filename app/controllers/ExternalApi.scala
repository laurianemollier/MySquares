//package controllers
//
//import javax.inject.Inject
//
//import play.api.mvc.{Action, Call, Controller, RequestHeader}
//import play.api.i18n.{I18nSupport, Lang, Messages, MessagesApi}
//import play.api.libs.concurrent.Execution.Implicits.defaultContext
//import dao.{LittleSquareRepo, UserRepo}
//import controllers.Authentication._
//import settings.Global.LogRegCont
//import models.LoginData._
//import models.RegisterData._
//import models.ContactData._
//import models.SelectedSquare._
//import models.{LittleSquare, MyUser}
//import controllers.FlashSession._
//import settings.Global._
//
//import scala.concurrent.{Await, Future}
//
//// email
//import play.api.libs.mailer._
//import java.io.File
//import org.apache.commons.mail.EmailAttachment
//
//import play.api.mvc.Cookie
//import play.api.mvc.DiscardingCookie
//class ExternalApi @Inject()(littleSquareRepo: LittleSquareRepo, userRepo: UserRepo,
//                            val messagesApi: MessagesApi, mailerClient: MailerClient,
//                            ws: WSClient) extends Controller with I18nSupport {
//
//
//  val askDB = new AskDB(littleSquareRepo, userRepo)
//
//  /**
//    * Get the expected response off the url
//    * @param url the url we want to connect
//    * @return Get the expected response off the url
//    */
//  def getResponseUrl(url: String): Future[WSResponse] = ws.url(url).get // TODO: error quand il n'y a pas de connection internet
//
//  val client_id = "3ccd7b6d58dd51427548"
//  val redirect_uri = "http://square-it.wtf/api"
//  def state = scala.util.Random.alphanumeric.take(20).mkString
//
//
//  /**
//    * Aks to login, check if the user exist a
//    * @param email The given email
//    * @param password The given password
//    * @return FTP server return codes and the user if everything is all right
//    */
//  def login(email: String, password: String) = ???
//
//  /**
//    * Aks to login, check if the user exist and compare the hashes
//    * @param email The given email
//    * @param hashPassword The given password hashed
//    * @return FTP server return codes and the user if everything is all right
//    */
//  def loginFromHash(email: String, hashPassword: String)= ???
//
//  /**
//    * Check if the user do not already exist
//    * @param email The given email
//    * @param password The given password
//    * @return FTP server return codes, key: "FTP"
//    *         the email, key: "email"
//    *         The user id if everything is all right, key: "idUser"
//    */
//  def addUser(email: String, password: String) = {
//    val url = "https://github.com/login/oauth/authorize?" +
//      "client_id=" + URLEncoder.encode(client_id, "UTF-8") +
//      "&redirect_uri=" + URLEncoder.encode(redirect_uri, "UTF-8") +
//      "&state=" + URLEncoder.encode(state, "UTF-8") +
//      "allow_signup=flase"
//
//    getResponseUrl(url)
//    ???
//  }
//
//  /**
//    *
//    * @param idSquare The square idx
//    * @param idx the index of the selected square in the square
//    * @param idUser user's id who want the square
//    * @param img the image produce by the user in base 64
//    * @return FTP server return codes
//    */
//  def addSelectedSquare(idSquare: Int, idx: Int, idUser: Long, img: String) = ???
//
//
//  def getSquares(idSquare: Int) = ???
//
//  def getSquares(idSquare: Int, idUser: Long) = ???
//
//  def getSquare(idSquare: Int, idx: Int, idUser: Long) = ???
//
//
//
//
//
//  def test = Action{
//    ???
//  }
//
//
//
//}
