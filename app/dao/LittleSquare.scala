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

  def findByIdx(idx: Int): Future[LittleSquare] =
    db.run(LittleSquares.filter(_.idx === idx).result.head)

  def findByUser(idUser: Long): Future[Seq[LittleSquare]] =
    db.run(LittleSquares.filter(_.idUser === idUser).result)

  def all(): Future[Seq[LittleSquare]] =
    db.run(LittleSquares.result)

  def modify(littleSquares: LittleSquare): Future[Int] =
    db.run(LittleSquares.insertOrUpdate(littleSquares)) // Add protection

  def addAll() ={
    (0 until nbSquares).map{ i =>
      val square = LittleSquare(i, -1.toLong, "")
      add(square)
    }
  }
  def add(square: LittleSquare): Future[Int] = {
    db.run(LittleSquares += square)
  }

  private class LittleSquareTable(tag: Tag) extends Table[LittleSquare](tag, "LITTLE_SQUARE"){
    def idx = column[Int]("IDX", O.PrimaryKey)
    def idUser = column[Long]("USER_ID")
    def img = column[String]("IMG")

    def * = (idx, idUser, img) <> ((LittleSquare.apply _).tupled, LittleSquare.unapply)
    def ? = (idx.?, idUser.?, img.?).shaped.<>({ r => import r._; _1.map(_ =>
      (LittleSquare.apply _).tupled((_1.get, _2.get, _3.get))) }, (_: Any) =>
      throw new Exception("Inserting into ? projection not supported."))

  }
}
