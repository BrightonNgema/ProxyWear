import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import * as WC from 'woocommerce-api';

import { Storage } from '@ionic/storage';
import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  product:any;
  WooCommerce :any;
  reviews :any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storage: Storage, public toastCtrl: ToastController,
     public modalCtrl: ModalController) {

    this.product = this.navParams.get("product");
    console.log(this.product);

    this.WooCommerce = WC({
      url: "http://localhost/wordpress",
      consumerKey: "ck_3da6512125c03d1118fa8d4f45a02659a1450439",
      consumerSecret: "cs_3a9244ca676b1a5d847b477a177639ee4872bc40"
    });

    this.WooCommerce.getAsync('products/'+this.product.id + '/reviews').then((data)=>{

      this.reviews = JSON.parse(data.body).product_reviews;
      console.log(this.reviews);
    },(err)=>{
      console.log(err);
    })
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ProductDetailsPage');
  // }
  addToCart(product){
    this.storage.get("cart").then((data)=>{
      if(data == null || data.length == 0){

        data = [];
        data.push({
          "product":product,
          "qty":1,
          "amount": parseFloat(product.price)
        });
      }else{
        let added = 0;

        for (let i =0; i < data.length; i++){
          if(product.id == data[i].product.id){
            console.log("product is already added");

            let qty = data[i].qty;
            data[i].qty = qty+1;
            data[i].amount = parseFloat(data[i].amount)+ parseFloat(data[i].product.price);
            added = 1;

            this.toastCtrl.create({ //deletedlater
              message: "Item already in the cart",
              duration: 3000
            }).present();
          }

        }
        if(added == 0){
          data.push({
            "product": product,
            "qty":1,
            "amount": parseFloat(product.price)
          });
        }
      }
        this.storage.set("cart", data).then((data)=>{
          console.log("cart updated");
          console.log(data);

          this.toastCtrl.create({
            message: "Cart Updated",
            duration: 3000
          }).present();
        })
    });
  }
  openCart(){
      this.modalCtrl.create(CartPage).present();
  }
}
