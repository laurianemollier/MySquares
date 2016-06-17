package dao

import javax.inject.Inject
import play.api.db.slick.DatabaseConfigProvider
import settings.Global
import slick.dbio
import slick.dbio.Effect.Read
import slick.driver.JdbcProfile
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

import models.LittleSquare
import Global._
import scala.concurrent._
import scala.concurrent.duration._


/**
  * Created by laurianemollier on 06/06/2016.
  */
class LittleSquareRepo @Inject()(protected val dbConfigProvider: DatabaseConfigProvider) {
  val dbConfig = dbConfigProvider.get[JdbcProfile]
  val db = dbConfig.db
  import dbConfig.driver.api._

  private val LittleSquares = TableQuery[LittleSquareTable]

  def findByIdx(idSquare: Int, idx: Int): Future[LittleSquare] =
    db.run(LittleSquares.filter(ls => ls.idx === idx && ls.idSquare === idSquare).result.head)

  def findByUser(idSquare: Int, idUser: Long): Future[Seq[LittleSquare]] =
    db.run(LittleSquares.filter(ls => ls.idUser === idUser && ls.idSquare === idSquare).result)

  def all(idSquare: Int): Future[Seq[LittleSquare]] =
    db.run(LittleSquares.filter(_.idSquare === idSquare).result).map(_.sortBy(_.idx))

  def all(): Future[Seq[LittleSquare]] =
    db.run(LittleSquares.result).map(_.sortBy(_.id))


  def modify(littleSquares: LittleSquare): Future[Int] =
    db.run(LittleSquares.insertOrUpdate(littleSquares)) // Add protection

  def addSquare(idSquare: Int, nbSquares: Int): Int ={
    val squares: Seq[LittleSquare] = (0 until nbSquares).map{ i =>
      LittleSquare(1, idSquare, i, -1.toLong, "")
    }
    db.run(LittleSquares ++= squares)
    squares.length
  }
  def add(square: LittleSquare): Future[Int] = {
    db.run(LittleSquares += square)
  }

  private class LittleSquareTable(tag: Tag) extends Table[LittleSquare](tag, "LITTLE_SQUARE"){
    def id = column[Long]("ID", O.AutoInc, O.PrimaryKey)
    def idSquare = column[Int]("ID_SQUARE")
    def idx = column[Int]("IDX")
    def idUser = column[Long]("USER_ID")
    def img = column[String]("IMG")

    def * = (id, idSquare, idx, idUser, img) <> ((LittleSquare.apply _).tupled, LittleSquare.unapply)
    def ? = (id.?, idSquare.?, idx.?, idUser.?, img.?).shaped.<>({ r => import r._; _1.map(_ =>
      (LittleSquare.apply _).tupled((_1.get, _2.get, _3.get, _4.get, _5.get))) }, (_: Any) =>
      throw new Exception("Inserting into ? projection not supported."))
  }
}
