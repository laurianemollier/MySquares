package controllers

import javax.inject.Inject


import models.{User, LittleSquare}

import dao.{LittleSquareRepo, UserRepo}
import play.api.mvc.{Action, Call, Controller, RequestHeader}
import play.api.libs.concurrent.Execution.Implicits.defaultContext

class Development @Inject()( littleSquareRepo: LittleSquareRepo, userRepo: UserRepo) extends Controller {


  def init = Action.async{
    littleSquareRepo.addAll()

//    val s = LittleSquare(4, 3.toLong, img)
//    littleSquareRepo.modify(s)
    littleSquareRepo.all().map(s => Ok(s.map(l => l.toString).mkString(" ")))
  }

  def icon = Action {
//    val u1 = User(1, "ddd", "aaa", "qqqq", 1)
//    userRepo.add(u1).map(i => Ok(i.toString.toInt.toString))

//    val u1 = User(1, "ddd", "aaa", "qqqq", 1)
//    val u2 = User(1, "qqq", "aaa", "qqqq", 1)
//    val u4 = User(1, "www", "aaa", "qqqq", 1)
//    val u3 = User(1, "zzz", "aaa", "qqqq", 1)
//
//    userRepo.add(u1)
//    userRepo.add(u4)
//    userRepo.add(u3)
//    userRepo.add(u2)
//
//    userRepo.all().map(s => Ok(s.map(l => l.toString).mkString(" ")))
//
//
//
    Ok(views.html.icon())
  }
  def doc = Action {
    Ok(views.html.index("C'est la doc!!!!"))
  }



}

