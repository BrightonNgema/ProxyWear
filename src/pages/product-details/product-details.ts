import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as WC from 'woocommerce-api';
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {

  product:any;
  WooCommerce :any;
  reviews :any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {

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

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

}
