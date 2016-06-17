package controllers

import javax.inject.Inject
import controllers.Authentication._
import dao.{UserRepo, LittleSquareRepo}
import models.{LittleSquare, MyUser}
import play.api.mvc.Controller
import scala.concurrent.ExecutionContext.Implicits.global

import scala.concurrent.duration._
import scala.concurrent.{Await, Future}

class AskDB @Inject()(littleSquareRepo: LittleSquareRepo, userRepo: UserRepo) {

  /**
   * Check if the user do not already exist
   * @param email The given email
   * @param password The given password
   * @return FTP server return codes, key: "FTP"
   *         the email, key: "email"
   *         The user id if everything is all right, key: "idUser"
   */
  def askAddUser(email: String, password: String): Future[Map[String, String]] ={
    userRepo.getUser(email).map( opUser => opUser match {
      case Some(user) => Map(
        "FTP" -> 331.toString,
        "email" -> email // User name exists already, need password
      )
      case None => {
        val (hashPassword, salt1, salt2) = encryptPassword(password)
        val user = MyUser(1, email, hashPassword, salt1.mkString(","), salt2)
        val idUser = userRepo.add(user)

        Map(
          "FTP" -> 200.toString,
          "email" -> email,
          "idUser" -> Await.result(idUser, 10 seconds).toString,
          "password" -> hashPassword
        )
      }
    })
  }

  /**
   * Aks to login, check if the user exist and compare the hashes
   * @param email The given email
   * @param hashPassword The given password hashed
   * @return FTP server return codes and the user if everything is all right
   */
  def askLoginFromHash(email: String, hashPassword: String): Future[(Int, Option[MyUser])] = {
    userRepo.getUser(email).map(opUser => opUser match {
      case None => (430, None)
      case Some(userDB) =>{
        if(hashPassword == userDB.passwordHash) (200, Some(userDB))
        else (331, None)
      }
    })
  }

  /**
   * Aks to login, check if the user exist a
   * @param email The given email
   * @param password The given password
   * @return FTP server return codes and the user if everything is all right
   */
  def askLogin(email: String, password: String): Future[(Int, Option[MyUser])] = {
    userRepo.getUser(email).map(opUser => opUser match {
      case None => (430, None)
      case Some(userDB) => {
        if(verifyPassword(password, userDB.passwordHash, userDB.salt1.split(',').map{i => i.toByte}, userDB.salt2)){
          (200, Some(userDB))
        }
        else (331, None) // User name okay, need password
      }
    })
  }

  /**
    *
    * @param idSquare The square idx
    * @param idx the index of the selected square in the square
    * @param idUser user's id who want the square
    * @param img the image produce by the user in base 64
    * @return FTP server return codes
    */
  def addSelectedSquare(idSquare: Int, idx: Int, idUser: Long, img: String): Future[Int] ={
    littleSquareRepo.findByIdx(idSquare, idx).map(ls =>
      if(ls.idUser != -1) 504
      else{
        val newLs = LittleSquare(ls.id, idSquare, idx, idUser, img)
        littleSquareRepo.modify(newLs)
        200
      }
    )
  }

}
