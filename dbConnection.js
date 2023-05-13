const options = {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
    database: 'news-db',
    username: 'postgres',
    password: 'postgres',
    directory: './models', // directorio donde se generarán las clases
    additional: {
      timestamps: true // omitir campos createdAt y updatedAt
    },
    tables: 'category commentary follow_up interaction_type news news_interaction user_favorite user_type users',
    schema: 'public'
  };
  
  module.exports = options;
