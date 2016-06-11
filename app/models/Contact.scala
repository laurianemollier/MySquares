package models

import play.api.data.Form
import play.api.data.Forms._

case class ContactData(email: String, text: String)

object ContactData{
  def contactForm: Form[ContactData] = Form{
    mapping("email" -> email,
    "text" -> nonEmptyText
    )(ContactData.apply)(ContactData.unapply)
  }
}


