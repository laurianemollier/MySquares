package controllers

import javax.inject.Inject


import models.{User, LittleSquare}

import dao.{LittleSquareRepo, UserRepo}
import play.api.mvc.{Action, Call, Controller, RequestHeader}
import play.api.libs.concurrent.Execution.Implicits.defaultContext

// email
import play.api.libs.mailer._
import java.io.File
import org.apache.commons.mail.EmailAttachment

class Development @Inject()( littleSquareRepo: LittleSquareRepo, userRepo: UserRepo, mailerClient: MailerClient) extends Controller {


  def init = Action.async{
    littleSquareRepo.addAll()

//    val s = LittleSquare(4, 3.toLong, img)
//    littleSquareRepo.modify(s)
    littleSquareRepo.all().map(s => Ok(s.map(l => l.toString).mkString(" ")))
  }

  def icon = Action {

    val email = Email(
      "Simple email",
      "Mister FROM <info@squareit.com>",
      Seq("Miss TO <mollierlauriane@gmail.com>"),
      bodyText = Some("A text message"),
      bodyHtml = Some(s"""<html><body><p>An <b>html</b> message !!!</p></body></html>""")
    )
    mailerClient.send(email)



    Ok(views.html.icon())
  }
  def doc = Action {
    Ok(views.html.index("C'est la doc!!!!"))
  }



}

