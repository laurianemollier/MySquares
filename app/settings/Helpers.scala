package settings


object Helpers {
  import views.html.helper.FieldConstructor
  implicit val myFields = FieldConstructor(settings.html.fieldConstructorTemplate.f)
}