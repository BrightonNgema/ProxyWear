import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, ToastController} from 'ionic-angular';
import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  WooCommerce: any;
  products: any[];
  moreProducts : any[];
  page: number;

    @ViewChild('productSlides') productSlides: Slides;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController) {

      this.page = 2;

      this.WooCommerce = WC({
        url: "http://localhost/wordpress",
        // consumerKey: "ck_f42939ed59d4fdd0ea63250f7068a555e6e56fe4",
        // consumerSecret: "cs_44b2acab21161515db8cf027a39e0b26570826e9"
        consumerKey: "ck_beede5b07f003b6de16315ec5fcede47039df365",
        consumerSecret: "cs_fd6549ffb8247fe2656ee99c6b240c563045356b"
      });

      this.loadMoreProducts(null);

      this.WooCommerce.getAsync("products").then((data) => {
        console.log("Passed here");
        console.log(JSON.parse(data.body));

        this.products = JSON.parse(data.body).products;

      },(err)=>{
      console.log(err)
      })
  }
  //Slide function
  ionViewDidLoad(){
    setInterval(() =>{
      //Resets slide when it reaches the end
      if(this.productSlides.getActiveIndex()== this.productSlides.length()-1)
      this.productSlides.slideTo(0);
      this.productSlides.slideNext();
    }, 3000)
  }


  loadMoreProducts(event){

    if(event==null){
      this.page = 1;
      this.moreProducts =[];
    }
    else
        this.page ++;

    this.WooCommerce.getAsync("products?page=" + this.page).then((data) => {
      console.log("Passed here");
      console.log(JSON.parse(data.body));

      this.moreProducts = this.moreProducts.concat(JSON.parse(data.body).products);

        if(event != null){
          event.complete();
        }
        if (JSON.parse(data.body).products < 10){
          event.enable(false);
          this.toastCtrl.create({
            message:"No more products!",
            duration: 5000
          }).present();

        }
    },(err)=>{
    console.log(err)
    })
  }

}
