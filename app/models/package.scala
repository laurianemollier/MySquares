package models

case class A( name : String )
case class B( name : String )


//import sorm._
//
//object Db extends Instance(
//  entities = Set(Entity[A](), Entity[B]()),
//  url = "jdbc:h2:mem:test"
//)