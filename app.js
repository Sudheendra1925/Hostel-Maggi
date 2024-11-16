const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'indra@sql',
    database: 'maggi'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});




app.get('/', (req, res) => {

 
    res.sendFile(path.join(__dirname, 'home.html'));
});


app.post('/order',(req,res)=>{


    let OrderId=Date.now();

    const {name,quantity,Pno,Rno,Price} = req.body;
    const sql = 'INSERT INTO orders (orderId,name,quantity,pno,rno,price) VALUES (?,?,?,?,?,?)';
    console.log(Rno,Price)
    db.query(sql, [OrderId,name,quantity,Pno,Rno,Price], (err) => {
        if (err) {
            console.error('Error in order', err);
            return res.status(500).json({ error: 'Error in order' });
        }
        console.log('Order Succesful');
     res.sendFile(path.join(__dirname, 'Succesful.html'))
    });

});
app.get("/admin",(req,res)=>{

    res.sendFile(path.join(__dirname, 'admin.html'));


})

app.get('/data', (req, res) => {
    db.query('SELECT * FROM orders', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({ error: 'Error fetching data' });
        }
        res.json(results);
    });
});



app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM orders WHERE orderid = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting data:', err);
            return res.status(500).json({ error: 'Error deleting data' });
        }
        res.sendFile(path.join(__dirname, 'admin.html'));
    });
});




const port = 3003;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
