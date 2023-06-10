const client = require('../connection.js')
const express = require('express');
const router = express.Router();

const create = async (newData) => {
    try {
        const { author_id, category_id, publication_date, title, header_content, main_content, img_url, score } = newData;
        let insertQuery = `insert into public.news(authorid, categoryid, publicationdate, title, headercontent, maincontent, imgurl, score)
        values ('${author_id}', '${category_id}', '${publication_date}', '${title}', '${header_content}','${main_content}', '${img_url}', '${ score }') RETURNING *;`;
        const results = await client.query(insertQuery);
        return results.rows[0]        
    } catch (error) {
        return "Hubo un error al intentar crear la noticia."
    }
}

const update = async (id, newData) => {
    try {
        const {title, header_content,  main_content ,img_url } = newData;
        const results = await client.query('UPDATE news SET title=$1, headercontent=$2, maincontent=$3, imgurl=$4 WHERE newsid=$5', [title, header_content,  main_content ,img_url, id]);
        return results.rows[0]
    } catch (error) {
        return `Hubo un error al intentar actualizar la noticia ${id}.`
    }
}

const deleteById = async (id) => {
    try {
        const results = await client.query('UPDATE news SET active = $1 WHERE newsid = $2 RETURNING *', [false, id]);
        if (results.rows[0]) { 
            return true 
        }
    } catch (error) {
        return `Hubo un error al intentar eliminar la noticia ${id}.`
    }
}

const getAll = async () => {
    try {
        const results = await client.query(`Select * from news where active = true`);
        return results.rows
    } catch (error) {
        return error+" : Hubo un error al intentar obtener las noticias."
    }
}

const getById = async (id) => {
    try {
        const results = await client.query(`Select * from news where newsid=${id} and active=true`);
        console.log(results.rows)
        return results.rows
    } catch (error) {
      return `Hubo un error al intentar obtener la noticia con id ${id}`  
    }
}

module.exports = {create, update, deleteById, getAll, getById};

