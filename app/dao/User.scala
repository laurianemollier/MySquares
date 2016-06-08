package dao

import javax.inject.Inject
import play.api.db.slick.DatabaseConfigProvider
import slick.dbio
import slick.dbio.Effect.Read
import slick.driver.JdbcProfile
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

import models.User


class UserRepo @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) {

  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val db = dbConfig.db
  import dbConfig.driver.api._
  private val Users = TableQuery[UserTable]

  def getUser(id: Long): Future[Option[User]] =
    db.run(Users.filter(_.id === id).result.headOption)

  def getUser(email: String): Future[Option[User]] =
    db.run(Users.filter(_.email === email).result.headOption)

  def getUserId(email: String): Future[Option[Long]] =
    getUser(email).map(op => op match {
      case None => None
      case Some(user) => Some(user.id)
    })

  def all(): Future[Seq[User]] =
    db.run(Users.result)

  def add(user: User): Future[Long] =
    db.run(Users returning Users.map(_.id) += user)

  def _deleteAllInProject(projectId: Long): DBIO[Int] =
    Users.delete




  private class UserTable(tag: Tag) extends Table[User](tag, "USER"){
    def id = column[Long]("ID", O.AutoInc, O.PrimaryKey)
    def email = column[String]("EMAIL")
    def passwordHash = column[String]("PASSWORD_HASH")
    def salt1 = column[String]("SALT1")
    def salt2 = column[Int]("SALT2")

    def * = (id, email, passwordHash, salt1, salt2) <> ((User.apply _).tupled, User.unapply)
    def ? = (id.?, email.?, passwordHash.?, salt1.?, salt2.?).shaped.<>({ r => import r._; _1.map(_ =>
      (User.apply _).tupled((_1.get, _2.get, _3.get, _4.get, _5.get))) }, (_: Any) =>
      throw new Exception("Inserting into ? projection not supported."))

  }

}