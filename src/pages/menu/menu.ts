import { Component , ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import * as WC from 'woocommerce-api';
import { ProductsByCategoryPage } from '../products-by-category/products-by-category';
import { SignupPage } from '../signup/signup';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

    homePage: Component;
    WooCommerce: any;
    categories: any;
    @ViewChild('content') childNavCtrl : NavController;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
      this.homePage = HomePage
      this.categories =[];

      this.WooCommerce = WC({
        url: "http://localhost/wordpress",
        consumerKey: "ck_3da6512125c03d1118fa8d4f45a02659a1450439",
        consumerSecret: "cs_3a9244ca676b1a5d847b477a177639ee4872bc40"
      });

      this.WooCommerce.getAsync("products/categories").then((data) => {
        console.log(JSON.parse(data.body).product_categories);

        let temp : any[]= JSON.parse(data.body).product_categories;

        for(let i = 0; i < temp.length; i ++){
          if(temp[i].parent == 0){
            if(temp[i].slug =="clothing"){
              temp[i].icon = "shirt";
            }
            if(temp[i].slug =="music"){
              temp[i].icon = "musical-notes";
            }
            if(temp[i].slug =="posters"){
              temp[i].icon = "images";
            }
          this.categories.push(temp[i]);
          }
        }

      },(err)=>{
        console.log(err);
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  openCategoryPage(category){

    this.childNavCtrl.setRoot(ProductsByCategoryPage, { "category" : category});
  }
  openPage(pageName: string){
    if(pageName == "signup"){
      this.navCtrl.push(SignupPage);
    }if(pageName == "login"){
      this.navCtrl.push(LoginPage);
    }
  }
}
