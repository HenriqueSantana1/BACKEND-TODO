import { Router } from 'express'
import { listLists, createList, deleteList, listTasks, createTask, doneTask, deleteTask } from '../controllers/taskController'
import { verify } from 'jsonwebtoken'
import { Response, NextFunction } from 'express'

const router = Router()

router.get('/lists', verifyJWT, listLists)

router.post('/lists/new', verifyJWT, createList)

router.delete('/lists/:id', verifyJWT, deleteList)

router.get('/tasks', verifyJWT, listTasks)

router.post('/tasks/new', verifyJWT, createTask)

router.post('/tasks/:id', verifyJWT, doneTask)

router.delete('/tasks/:id', verifyJWT, deleteTask)

function verifyJWT(req: any, res: Response, next: NextFunction) {
  const token:any = req.headers['x-access-token']
  verify(token, process.env.JWT_SECRET, (err: any, decoded: { userId: string }) => {
      if(err) return res.status(401).send('Token inválido')
      req.userId = decoded.userId
      next()
  })
}

module.exports = router