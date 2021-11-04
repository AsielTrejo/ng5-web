import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { GraphqlProductsService} from '../graphql.products.service';
import { Subscription } from 'rxjs';
import { GraphqlUsersService} from '../graphql.users.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  itemCount: number = 0;
  btnText: string = "add an item";
  goalText: string = ""
  user: string = ""
  pass: string = ""
  token: string = ""

  goals : Array<any> = [];

  loading: boolean | undefined;
  private querySubscription?: Subscription;


  constructor(private _data: DataService, 
              private graphqlProductsService: GraphqlProductsService,
              private graphqlUsersService : GraphqlUsersService) { }

  ngOnInit(): void {
    this.itemCount = this.goals.length;


/*    this._data.goal.subscribe(
       res => 
            this.goals = res
    );
    this._data.changeGoal(this.goals);
*/

    this.querySubscription = this.graphqlProductsService.links("-")
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.goals = JSON.parse(JSON.stringify(data)).links;
        console.log(JSON.stringify(this.goals))
      });

  }

  loginUser() {

    alert(this.user + " - " + this.pass);
    this.graphqlUsersService.tokenAuth(this.user, this.pass)
    .subscribe(({ data }) => {
       console.log('logged: ', JSON.stringify(data));
      // this.storageService.setSession("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
      //this.storageService.setLocal("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
      this.token =  JSON.parse(JSON.stringify(data)).tokenAuth.token;
      

      //this.loginService.showData(mydata);
      // this.router.navigate(['/']);

    }, (error) => {
       console.log('there was an error sending the query', error);
    });
  
  }  

  addItem() {
//    this.goals.push(this.goalText);

  if(this.token){

    var mytoken = this.token;
    //this.storageService.getSession("token");
    alert(this.goalText);

    this.graphqlProductsService.createLink(mytoken, "https://www.github.com", this.goalText)
    .subscribe(({ data }) => {
       console.log('link created :  ', data);
    }, (error) => {
       console.log('there was an error sending the query', error);
    });
  
    this.goalText = "";
    this.itemCount = this.goals.length;
    this._data.changeGoal(this.goals);

    }

    else{
      alert('Unknown token, not authorized');
    }
  }

  removeItem(i:number) {
    this.goals.splice(i,1);
    this._data.changeGoal(this.goals);
  }
}