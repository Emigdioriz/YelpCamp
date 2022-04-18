const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const {places, descriptors} = require('./seedhelpers');
const cities = require('./cities');


mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db=mongoose.connection;
db.on('error', console.error.bind(console, 'connection error : '));
db.once('open', function (){ 
    console.log('MONGO CONNECTION OPEN!!!')
});

const sample = array => array[Math.floor(Math.random()*array.length)];// pega um valor de um array qualquer

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i =0; i< 250; i++) {
        const random1000 = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20 +10);
        const camp = new Campground({
            author: '62052e6ca16e077aa11ea940', //todos os campgrounds pertencem a  esse ID de emi2
            location: `${cities[random1000].city}, ${cities[random1000].state}`,// cria um campground com a cidade e estado de numero aleatorio gerado para lista de cidades(cities.js) 
            title: `${sample(descriptors)} ${sample(places)}`,// cria um nome a partir da lista de seedhelpers.js 
            images: [
                {
                  url: 'https://res.cloudinary.com/di5zsfn8r/image/upload/v1645553989/Yelpcamp/qwerqycar5kgpxlbcbtk.jpg',
                  filename: 'Yelpcamp/qwerqycar5kgpxlbcbtk',
                },
                {
                  url: 'https://res.cloudinary.com/di5zsfn8r/image/upload/v1645553989/Yelpcamp/uw5a0qyuiurwtrpxb7do.jpg',
                  filename: 'Yelpcamp/uw5a0qyuiurwtrpxb7do',
                }
              ],
            description: 'oauhcoahoasnakpasmaksmcp adpasdjasdpd pasjpdad dmas;d;a apodjasda;ksaslk jasdjaslkj alsd  asdpajsdj j a;sdas dpasdao kj j alsdkmasd ap',
            price,
            geometry: {
              type: "Point",
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude,
              ]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})