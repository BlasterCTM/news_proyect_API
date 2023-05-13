const client = require('../connection.js')
const express = require('express');
const router = express.Router();

client.connect();

//OBTIENE TODAS LAS NOTICIAS
router.get('/news', (req, res)=>{
    client.query(`Select * from news`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

//OBTIENE NOTICIAS POR UN ID
router.get('/news/:id', (req, res)=>{

    client.query(`Select * from news where newsid=${req.params.id}`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
});

//CREA UNA NOTICIA
router.post('/news', async (req, res)=> {
    
    try {
        const { author_id, category_id, publication_date, title, header_content, main_content, img_url, score } = req.body;
        let insertQuery = `insert into public.news(authorid, categoryid, publicationdate, title, headercontent, maincontent, imgurl, score)
        values ('${author_id}', '${category_id}', '${publication_date}', '${title}', '${header_content}','${main_content}', '${img_url}', '${ score }') RETURNING *;`;
    
        const results = await client.query(insertQuery)
        res.send(
            {
                status:{
                    code:201,
                    name: 'CREATED'
                }, 
                message: 'Noticia publicada con éxito.',
                body: results.rows[0]
            })
        client.end;
        
    } catch (error) {
        console.log("API_ERROR: ",error);
        client.end;
    }
   
})

//1
//TODO: ACTUALIZA UNA NOTICIA 
//Crear un metodo con router.put

// router.put('/:id', (req, res) => {
//     const id = req.params.id;
//     const { name, email } = req.body;
  
//     pool.query(
//       'UPDATE users SET name=$1, email=$2 WHERE id=$3',
//       [name, email, id],
//       (error, results) => {
//         if (error) {
//           console.log(error);
//           res.status(500).send('Error updating user');
//         } else {
//           console.log(results);
//           res.send(User ${id} updated successfully);
//         }
//       }
//     );
//   })


//ELIMINA UNA NOTICIA 
router.patch('/news/:id', (req, res) => {

    const { id } = req.params;
    const { active } = req.body;
  
    client.query('UPDATE news SET active = $1 WHERE newsid = $2 RETURNING *', [active, id], (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error actualizando noticia');
      } else {
        const updatedNews = result.rows[0];
        res.json(updatedNews);
      }
    });
  });

module.exports = router;
