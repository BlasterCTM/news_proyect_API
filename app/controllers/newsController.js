const client = require('../../connection')
const express = require('express');
const router = express.Router();
const newsRepository = require('../../repository/newsRepository.js')

client.connect();

//OBTIENE TODAS LAS NOTICIAS
const getNews = async (req, res) => {
  const allNews = await newsRepository.getAll();
  res.send(allNews)
};

//OBTIENE NOTICIAS POR UN ID
const getNewsById = async (req, res) => {
    const news = await newsRepository.getById(req.params.id);
    res.send(news)
};

//CREA UNA NOTICIA
const createNews = async (req, res) => {
  const createNew = await newsRepository.create(req.body)
  res.send(
    {
      message: "Noticia publicada con éxito.",
      data: createNew
    }
  )
};

//1
//TODO: ACTUALIZA UNA NOTICIA 
//Crear un metodo con router.put

const updateNews =  async (req, res) => {
  const  {id}  = req.params;
  const updateNew = await newsRepository.update(id, req.body)
  res.send(
    {
      message: "Noticia actualizada con éxito.",
      data:  updateNew
    }
  )
};

//ELIMINA UNA NOTICIA 

const deleteNews = async (req, res) => {

  const { id } = req.params;
  const deleteNews = await newsRepository.deleteById(id);
  res.send({
    message: "Noticia eliminada con éxito.",
    data: deleteNews
  }); 
};


module.exports = { getNews, getNewsById, createNews, updateNews, deleteNews };

