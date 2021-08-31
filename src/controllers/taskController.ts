import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

const prisma = new PrismaClient()

const listLists = async (req: Request, res: Response) => {
  try {
    const lists = await prisma.list.findMany({
      include: {
        tasks: true
      }
    })
    return res.send(lists)
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao listar listas' })
  }
}

const createList = async (req: any, res: Response) => {
  const { name } = req.body
  try {
    const list = await prisma.list.create({
      data: {
        name,
        user: {
          connect: {
            id: req.userId
          }
        }
      }
    })
    return res.status(200).send({ list })
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao cadastrar lista' })
  }
}

const deleteList = async (req: Request, res: Response) => {
  try {
    await prisma.task.deleteMany({
      where: {
        listId: Number(req.params.id)
      }
    })
    
    await prisma.list.delete({
      where: {
        id: Number(req.params.id)
      }
    })

    return res.status(200).send({ success: 'Lista deletada com sucesso' })
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao deletar lista' })
  }
}

const listTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany()
    return res.send(tasks)
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao listar tasks' })
  }
}

const createTask = async (req: Request, res: Response) => {
  const { name, listId } = req.body
  try {
    const task = await prisma.task.create({
      data: {
        name,
        list: {
          connect: {
            id: Number(listId)
          }
        }
      }
    })
    return res.status(200).send({ task })
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao criar task' })
  }
}

const doneTask = async (req: Request, res: Response) => {
  const { done } = req.body
  try {
    await prisma.task.update({
      where: {
        id: Number(req.params.id)
      },
      data: {
        done
      }
    })
    return res.status(200).send({ success: 'Ok' })
  } catch (err) {
    return res.status(400).send({ error: err})
  }
}

const deleteTask = async (req: Request, res: Response) => {
  try {
    await prisma.task.delete({
      where: {
        id: Number(req.params.id)
      }
    })
    return res.status(200).send({ success: 'Task deletada com sucesso' })
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao deletar task' })
  }
}

export { listLists, createList, deleteList, listTasks, createTask, doneTask, deleteTask }

