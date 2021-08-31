import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'

const prisma = new PrismaClient()

const createUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body

  hash(password, 10, async (errBcrypt, hashPw) => {
    if (errBcrypt) {
      return res.status(500).send({ error: errBcrypt})
    }
    try {
      const user = await prisma.user.create({
        data: {
          email, 
          password: hashPw,
          name
        }
      })
      return res.send(user)
    } catch (err) {
      if (err.code == "P2002") {
        return res.status(400).send({ error: 'E-mail já cadastrado'})
      }
      else {
        return res.status(400).send({ error: 'Erro ao cadastrar usuário'})
      }
    }
  })
}

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await prisma.user.findFirst({
    where: {
      email
    },
    select: {
      id: true,
      password: true
    }
  })

  if (user) {
    compare(password, user.password, (err, result) => {
      if (result) {
        let token = sign({
          userId: user.id
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "12h"
        })
        return res.status(200).send({ success: 'Autenticado com sucesso', token: token })
      }
      else {
        return res.status(403).send({ error: "Falha na autenticação" })
      }
    })
  }
  else {
    return res.status(400).send({ error: "E-mail não cadastrado" })
  }
}

export { createUser, loginUser }