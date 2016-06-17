package settings

object Global {

  val companyData: Map[String, String] =
    Map("phoneNumber" -> "+33 4 50 62 29 24",
      "email" -> "mollierlaurian@gmail.com",
      "address" -> "Not yet available",
      "name" -> "Square it",
      "owner" -> "Lauriane Mollier",
      "idCurrentMS" -> "1"
    )

  // login - register - contact
  object LogRegCont extends Enumeration {
    type LogRegCont = Value
    val login, register, contact = Value
  }
}
