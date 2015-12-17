package controllers


import controllers.Application.LogRegCont
import org.mindrot.jbcrypt.BCrypt
import play.api.mvc._
import play.api.libs.json.Json
import settings.Global._


import models._
import models.SelectedSquares._

object Api extends Controller {



  def addUser = Authentication.addUser

  def getUsers = Action{
    val users = DB.query[User].fetch
    Ok(Json.toJson(users))
  }

  // TODO: protection
  def getUser(email: String): Option[User] ={
    DB.query[User].whereEqual("email", email).fetchOne()
  }

  def getSquares = Action {
    val squares = DB.query[Square].fetch
    Ok(Json.toJson(squares))
  }

  // TODO: protection et refaire
  def getColorSquare(id: Int) = {
    val squarePersist = DB.query[Square].whereEqual("id", id).fetchOne()
    squarePersist match {
      case None => null
      case Some(square) => {
        val colors = square.getArray.map { case (idUser ,c) =>
          if(idUser == -1) Array(-1, -1, -1)
          else Array(Square.r(c), Square.g(c), Square.b(c))
        }
        (colors, square.nbSquaresOneEdge)
      }
    }
  }

  def login = Authentication.login

  def logout = Action{ implicit request =>
    Redirect(routes.Application.home()).withNewSession
  }

  def selectSquares = Action{ implicit request =>
    selectedSquaresForm.bindFromRequest.fold(
      errorsForm => {
        Ok("Error -> Contacte the compagni Erruer dans le fomulaire") // TODO: faire une page speciale pour ca
      },
      selectedSquaresSting => {
        // TODO: partie dure avec la concurnce et tout le bordel + a optimiser

        val MSOp = DB.query[Square].whereEqual("id", selectedSquaresSting.idMS).fetchOne()
        MSOp match {
          case null => Ok("le MS n'existe pas contacte la compagnie") //  // TODO: faire une page speciale pour ca
          case Some(ms) => {
            val selectedSquares :  Seq[(Int, Int)] = stringToSelectedSquare(selectedSquaresSting.seq)

            // verify that all the selected Squares are free
            val valid = selectedSquares.forall{ case (idx, color) =>
              ms.squares(idx)._1 == -1
            }

            if(valid){
              DB.save(ms.copy(squares = ms.squares.zipWithIndex.map{case (tupple, i) => {
                val selectedSquare = selectedSquares.filter{
                  case (idx, _) => idx == i
                }
                if(selectedSquare.nonEmpty) {
                  (2222.toLong, selectedSquare.head._2)
                }
                else tupple
              }}))
              Ok("C'est bon")
            }
            else Ok("Error -> Contacte the compagnie les square selectionne sont deja pris   " + selectedSquaresSting.seq) // TODO: faire une page speciale pour ca
          }
        }

      }
    )
  }

// must be format 1,2~3,3
  def stringToSelectedSquare(s: String): Seq[(Int, Int)] = {
    s.split("~").map{ a =>
      val t = a.split(",")
      (t(0).toInt, t(1).toInt)
    }
  }
}
