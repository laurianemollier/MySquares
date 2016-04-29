package controllers


import controllers.Application.{connected, getUserId}
import play.api.mvc._
import play.api.libs.json.Json
import settings.Global._


import models._
import models.SelectedSquare._

object Api extends Controller {

  def addUser = Authentication.addUser

  def getUsers = Action{
    val users = DB.query[User].fetch
    Ok(Json.toJson(users))
  }

  def getUser(email: String): Option[User] ={
    DB.query[User].whereEqual("email", email).fetchOne()
  }

  def getSquares = Action {
    val squares = DB.query[Square].fetch
    Ok(Json.toJson(squares))
  }

  def getSquare(id: Int): Square = {
    val squarePersist = DB.query[Square].whereEqual("id", id).fetchOne()
    squarePersist match {
      case None => null
      case Some(square) => square
    }
  }

  def login = Authentication.login

  def logout = Action{ implicit request =>
    Redirect(routes.Application.home()).withNewSession.flashing(
      "logout" -> ""
    )
  }



  def selectSquare = Action { implicit request =>
    getUserId match {
      case None => {
        Redirect(routes.Application.login())
      }
      case Some(idUser) => {
        selectedSquareForm.bindFromRequest.fold(
          errorForm => {
            Redirect(routes.Application.contact()).flashing(
              "mainError" -> "Le formulaire pour pour selectionner les petits carree ne sont pas bon"
            )
          },
          selectedSquare => {
            addSelectedSquare(idCurrentMS, idUser, selectedSquare.idxSquare, selectedSquare.img) match {
              case 200 => {
                //TODO: Envoyer les email
                Redirect(routes.Application.home()) // TODO: montrer qu'on a bien selectionné son petit carré.
              }
              case _ => Redirect(routes.Application.contact()).flashing(
                "mainError" -> "Le formulaire pour pour selectionner les petits carree ne sont pas bon"
              )
            }
          }
        )
      }
    }
  }

  /**
   *
   * @param idMS id of the MySquare that we want to select the squares in the seq
   * @param idUser user's id who want the square
   * @param idxSquare the index of the selected square
   * @param img the image produce by the user in base 64
   */
  def addSelectedSquare(idMS: Int, idUser: Int, idxSquare: Int, img: String): Int ={
    // TODO: verifier que l'utilisateur existe
    val MSop = DB.query[Square].whereEqual("id", idMS).fetchOne()
    MSop match {
      case None => 504
      case Some(ms) => {
        // verify that the square is free
        if(ms.squares(idxSquare)._2 != -1) 504
        else{
          DB.save(ms.copy(squares = ms.squares.updated (idxSquare, (img, idUser))))
          200
        }
      }
    }
  }

}
