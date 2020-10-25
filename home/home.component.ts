import { Component, OnInit } from '@angular/core';
import { CommanservicesService } from 'src/app/services/commanservices.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConstantsService } from 'src/app/constants/app-constants.service';
import { Chart } from 'chart.js';
import * as country from './../../processData.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: any = {};
  processContent: any = [];
  name: any = "Anusha";
  information: any = (country as any).default;

  constructor(public translate: TranslateService,
    public common: CommanservicesService,
    public constant: AppConstantsService, ) { }

  ngOnInit() {
    this.processList();

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        datasets: [{
          backgroundColor: [
            "#e74c3c", // red
            "#20b2aa", // blue
            "#f1c40f", // yellow
            "#95a5a6", // gray
          ],
          data: [90, 12, 25, 10]
        }]
      }
    });
  }

  processList() {
    this.common.getRequest('​https://jsonplaceholder.typicode.com/users').subscribe(response => {
      this.data = response;
      if (this.constant.SUCCESS === this.data.status) {
        this.information = this.data.result;
      } else {
        this.constant.errorMsg(this.data.message);
      }
    }), err => {
      this.constant.errorMsg(this.data.message);
    };
  }

}
