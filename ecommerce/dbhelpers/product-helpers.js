var db = require('../config/connection');
var collection = require('../config/collections');
const { ObjectId } = require('mongodb');

module.exports ={
    addProduct: (product, fileExtension, callback) => {
        product.fileExtension=fileExtension;
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
            const imageName = data.insertedId+"."+product.fileExtension;
            callback(imageName);
        })
    },
    getAllProducts: ()=>{
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
            resolve(products);
        })
    },
    getAllCategories: () => {
        return new Promise (async (resolve,reject) => {
            let categories = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray();
            resolve(categories);
        })
    },
    getHighlights: () => {
        return new Promise (async (resolve,reject) =>{
            let highlights = await db.get().collection(collection.HIGHLIGHT_COLLECTION).find().toArray();
            resolve(highlights);
        })
    },
    getTopDeals: () => {
        return new Promise (async (resolve,reject) => {
            let 
        })
    },
    updateProduct:(product,fileExtension)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id: new ObjectId(product.id)},
            {
                $set:{
                    Name:product.Name,
                    Description:product.Description,
                    Price:product.Price,
                    Category:product.Category
                   
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    updateProductImgExtension:(extension,id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id: new ObjectId(id)},
            {
                $set:{
                    fileExtension:extension   
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    deleteProduct: (proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:new ObjectId(proId)}).then((response)=>{
                resolve(response);
            })
        })
    },
    getProductDetails: (proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new ObjectId(proId)}).then((product)=>{
                resolve(product);
            })
        })
    }
}