'use strict';
const { Snowflake } = require("nodejs-snowflake");

const uid = new Snowflake({
  custom_epoch: 1725148800000,
  instance_id: 1
});

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // Remove all existing records
    await queryInterface.bulkDelete('products', null, {});
    
    const productList = [
      {
        productName:"Dumbbell",
        productPrice:80,
        productDescription:"Tumblr man braid vinyl whatever bodega boys, keffiyeh mumblecore yes plz. Unicorn vegan four dollar toast taxidermy, vaporware tote bag tacos distillery vibecession austin messenger bag. ",
        productUrl:"https://images.unsplash.com/photo-1703668984128-b506579acdd2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGR1bWJlbGxzfGVufDB8fDB8fHww"
      },
    
      {
        productName:"YogaMat",
        productPrice:60,
        productDescription:"Try-hard whatever skateboard trust fund gochujang pabst pork belly. Poutine gentrify chartreuse yes plz cliche.",
        productUrl:"https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        productName:"Barbell",
        productPrice:95,
        productDescription:"Salvia flexitarian meh, four dollar toast retro hexagon cray pabst before they sold out dreamcatcher microdosing literally. ",
        productUrl:"https://images.pexels.com/photos/2261481/pexels-photo-2261481.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        productName:"T-Shirts",
        productPrice:60,
        productDescription:"Occupy keytar kogi fashion axe mustache tote bag ramps gatekeep whatever gastropub shaman. Lo-fi neutral milk hotel locavore retro fam fingerstache. ",
        productUrl:"https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        productName:"Tops",
        productPrice:45,
        productDescription:"Quinoa selfies edison bulb offal YOLO. Mumblecore slow-carb pitchfork banjo, readymade gatekeep 3 wolf moon meggings hell of narwhal poke PBR&B yr blue bottle VHS. Four loko woke microdosing sustainable vinyl. ",
        productUrl:"https://images.pexels.com/photos/6443532/pexels-photo-6443532.jpeg?auto=compress&cs=tinysrgb&w=800"
      },
      {
        productName:"Gloves",
        productPrice:60,
        productDescription:"Letterpress seitan lomo kogi. Shaman adaptogen meh coloring book fam, cliche chicharrones. Taxidermy hashtag chartreuse blog austin keffiyeh craft beer godard fit pinterest umami schlitz narwhal tumblr. ",
        productUrl:"https://slack-imgs.com/?c=1&o1=ro&url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1583473848882-f9a5bc7fd2ee%3Fq%3D80%26w%3D3540%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D"
      },
      {
        productName:"Dumbbell",
        productPrice:15,
        productDescription:"Schlitz semiotics forage shaman fanny pack. Intelligentsia VHS kitsch meh fingerstache, fixie fashion axe tilde flannel. Craft beer roof party JOMO, kombucha.",
        productUrl:"https://images.unsplash.com/photo-1586401100295-7a8096fd231a?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        productName:"Leggings",
        productPrice:55,
        productDescription:"Literally iceland green juice solarpunk, next level jawn wayfarers vape direct trade. Ethical live-edge shoreditch, activated charcoal tofu hexagon vegan wayfarers jean shorts squid. ",
        // productUrl:"https://images.pexels.com/photos/7880080/pexels-photo-7880080.jpeg?auto=compress&cs=tinysrgb&w=800"
        productUrl:"https://images.pexels.com/photos/7593007/pexels-photo-7593007.jpeg?auto=compress&cs=tinysrgb&w=800"      
        },
      {
        productName:"The Rope",
        productPrice:70,
        productDescription:"Air plant direct trade ugh slow-carb butcher activated charcoal. PBR&B blackbird spyplane jawn try-hard. Whatever brunch flexitarian church-key. ",
        productUrl:"https://images.pexels.com/photos/7671467/pexels-photo-7671467.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      },
      {
        productName:"MedBall",
        productPrice:75,
        productDescription:"Asymmetrical vexillologist authentic trust fund chicharrones iPhone. Chicharrones kitsch williamsburg fixie before they sold out chillwave bruh everyday carry health goth chia iPhone marfa.  ",
        productUrl:"https://images.unsplash.com/photo-1620188552551-9f98661cbef7?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
      {
        productName:"Bosu Ball",
        productPrice:65,
        productDescription:"Prism scenester try-hard, locavore humblebrag glossier synth. DSA messenger bag activated charcoal kinfolk thundercats Brooklyn.",
        productUrl:"https://images.unsplash.com/photo-1581122584612-713f89daa8eb?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D”,“createdAt”:“2023-12-19T11:43:40.000Z”,“updatedAt”:“2023-12-19T11:43:40.000Z"
      },
      {
        productName:"Kettlebell",
        productPrice:80,
        productDescription:"Wayfarers biodiesel pabst keffiyeh retro jean shorts. Sus butcher banh mi, DIY dreamcatcher raw denim church-key hammock. Tumblr migas la croix vaporware lyft af. ",
        productUrl:"https://images.unsplash.com/photo-1603233720024-bebea0128645?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      },
    ];

    const productsToCreate = productList.map(product => ({
      productId: uid.getUniqueID().toString(),
      productName: product.productName,
      productPrice: product.productPrice,
      productDescription: product.productDescription,
      productUrl: product.productUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('products', productsToCreate, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  }
};