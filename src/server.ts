import express from 'express'
import cors from 'cors';

const app = express()

app.use(cors())
app.use(express.json())
app.use('/users', require('./routes/users'))
app.use('/', require('./routes/tasks'))


app.get('/', (req, res) => {
    return res.send('TODO')
})

app.listen(8080)