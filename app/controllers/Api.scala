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
                Redirect(routes.Application.home()).flashing(
                  "login" -> "success"
                ) // TODO: montrer qu'on a bien selectionné son petit carré.
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



//  def selectSquares = Action{ implicit request =>
//    getUserId match {
//      case None => {
//        Redirect(routes.Application.login()).flashing(
//          "haveToLogin" -> ""
//        )
//      }
//      case Some(idUser) => {
//        selectedSquaresForm.bindFromRequest.fold(
//          errorsForm => {
//            Redirect(routes.Application.contact()).flashing(
//              "mainError" -> "Le formulaire pour pour selectionner les petits carree ne sont pas bon"
//            )
//          },
//          selectedSquaresSting => {
//            // TODO: partie dure avec la concurnce et tout le bordel + a optimiser
//
//            val MSOp = DB.query[Square].whereEqual("id", selectedSquaresSting.idMS).fetchOne()
//            MSOp match {
//              case null => Redirect(routes.Application.contact()).flashing(
//                "mainError" -> "Le carré souhaité pour la selection des petits carré n'existe pas"
//              )
//              case Some(ms) => {
//                val selectedSquares :  Seq[(Int, Int)] = stringToSelectedSquare(selectedSquaresSting.seq)
//
//                // verify that all the selected Squares are free
//                val valid = selectedSquares.forall{ case (idx, color) =>
//                  ms.squares(idx)._1 == -1
//                }
//                if(valid){
//                  DB.save(ms.copy(squares = ms.squares.zipWithIndex.map{case (tupple, i) => {
//                    val selectedSquare = selectedSquares.filter{
//                      case (idx, _) => idx == i
//                    }
//                    if(selectedSquare.nonEmpty) {
//                      (idUser, selectedSquare.head._2)
//                    }
//                    else tupple
//                  }}))
//                  // Redirect to the same square
//                  Redirect(routes.Application.haveSquares( selectedSquaresSting.idMS))
//                }
//                else{
//                  Redirect(routes.Application.contact()).flashing(
//                    "mainError" -> "Les petits carré souhaité sont déjà pris"
//                  )
//                }
//              }
//            }
//          }
//        )
//      }
//    }
//  }

// must be format 1,2~3,3 avec le premier chiffre, l'indice et l;autre la couleur
  def stringToSelectedSquare(s: String): Seq[(Int, Int)] = {
    s.split("~").map{ a =>
      val t = a.split(",")
      (t(0).toInt, t(1).toInt)
    }
  }
}
