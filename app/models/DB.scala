package models

import sorm._

object DB extends Instance(
  entities = Set(Entity[User]()),
  url = "jdbc:h2:mem:test"
)