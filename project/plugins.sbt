// Comment to get more information during initialization
//logLevel := Level.Warn

resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.5.4")

addSbtPlugin("com.jamesward" %% "play-auto-refresh" % "0.0.14")

//addSbtPlugin("com.typesafe.sbt" % "sbt-less" % "1.0.6")
addSbtPlugin("com.typesafe.sbt" % "sbt-less" % "1.1.0")

addSbtPlugin("com.typesafe.sbt" % "sbt-rjs" % "1.0.1")

addSbtPlugin("com.typesafe.sbt" % "sbt-digest" % "1.0.0")

addSbtPlugin("com.typesafe.sbt" % "sbt-gzip" % "1.0.0")

addSbtPlugin("com.typesafe.sbt" % "sbt-js-engine" % "1.0.0-SNAPSHOT")

addSbtPlugin("com.heroku" % "sbt-heroku" % "1.0.1")






