package controllers

import javax.inject.Inject
import dao.{UserRepo, LittleSquareRepo}
import play.api.i18n.MessagesApi
import play.api.mvc.{Action, Controller}

import play.api.i18n.{I18nSupport, MessagesApi, Messages, Lang}


class ApiDeMerde @Inject()(littleSquareRepo: LittleSquareRepo, userRepo: UserRepo,
                           val messagesApi: MessagesApi) extends Controller with I18nSupport {

  def logFacebook(id: Int, name: String) = Action { implicit request =>

    ???
  }

  def regFacebook = Action { implicit request =>
    ???
  }




}
