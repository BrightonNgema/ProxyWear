import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ProductDetailsPage } from '../product-details/product-details';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})

export class ProductsByCategoryPage {

  WooCommerce: any;
  products: any[];
  page: number;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
      this.page = 1;
      this.category = this.navParams.get("category");

    this.WooCommerce = WC({
      url: "http://localhost/wordpress",
      consumerKey: "ck_3da6512125c03d1118fa8d4f45a02659a1450439",
      consumerSecret: "cs_3a9244ca676b1a5d847b477a177639ee4872bc40"
    });

    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug).then((data) => {
      console.log(JSON.parse(data.body));
      this.products = JSON.parse(data.body).products;

    },(err)=>{
    console.log(err)
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event){
        this.page ++;

    this.WooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=").then((data) => {
      let temp = (JSON.parse(data.body).products);

      this.products = this.products.concat(JSON.parse(data.body).products);
      event.complete();

      if (temp.length < 10){
        event.enable(false);
        this.toastCtrl.create({
          message:"No more products!",
          duration: 5000
        }).present();

      }
    })
  }
  openProductPage(product){
    this.navCtrl.push(ProductDetailsPage, {"product": product});
  }
}
