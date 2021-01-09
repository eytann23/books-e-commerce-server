const express = require ('express');
const cors = require ('cors');

const port = process.env.PORT || 3001;

const app = express();
require('./db/mongoose');
const bookRouter=require("./routers/booksRouter");
const usersRouter=require("./routers/usersRouter");
app.use(cors());
app.use(express.json());

app.use(bookRouter);
app.use(usersRouter);

app.listen(port,()=>{
    console.log(`Listening on port ${port}`)
})