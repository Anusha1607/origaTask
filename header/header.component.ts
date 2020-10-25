import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CommanservicesService } from 'src/app/services/commanservices.service';
import { Router } from '@angular/router';
import { AppConstantsService } from 'src/app/constants/app-constants.service';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DatePipe]
})
export class HeaderComponent implements OnInit {
  subscription: Subscription;
  data: any = {};
  headerbackColor: any;
  CurrentSessionData: any = {};
  changepassword: any = {};
  myDate: any = new Date();
  passwordRuleData: any = {};
  public type = 'password';
  public showPreviousPass = false;
  public type1 = 'password';
  public showNewPass = false;
  public type2 = 'password';
  public showConfirmPass = false;
  constructor(public translate: TranslateService,
    public common: CommanservicesService,
    public constant: AppConstantsService,
    public datePipe: DatePipe,
    public router: Router, ) {
    this.subscription = this.common.getMessage().subscribe(message => {
      this.headerbackColor = message;
    })
    translate.addLangs(['en-us', 'mr']);
    translate.setDefaultLang('en-us');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en-us|mr/) ? browserLang : 'en-us');
  }

  ngOnInit() {

    this.CurrentSessionData = JSON.parse(sessionStorage.getItem('CurrentUser'));
    if (this.CurrentSessionData) {
      this.CurrentSessionData.firstName = this.CurrentSessionData.firstName + ' ' + this.CurrentSessionData.lastName;
    }
    if (this.CurrentSessionData && this.CurrentSessionData.themePreference) {
      this.headerbackColor = this.CurrentSessionData.themePreference;
    }
    if (!this.headerbackColor) {
      this.headerbackColor = "#343a40";
    }
  }

  changePdPopup() {
    this.CurrentSessionData = JSON.parse(sessionStorage.getItem('CurrentUser'));
    if (this.CurrentSessionData) {
      let isChangePasswordRequired = this.CurrentSessionData.isChangePasswordRequired;
      let isPasswordExpired = this.CurrentSessionData.isPasswordExpired;
      if (isChangePasswordRequired == 1 || isPasswordExpired == 1) {
        this.passwordRule();
        $('#myModal').modal('show');
        $('#myModal').on('shown.bs.modal', function () {
          $('#myInput').trigger('focus')
        })
      }
    }
  }

  passwordRule() {
    this.common.getRequest(this.constant.SERVER_URLS['PASSWORD_RULE']).subscribe(response => {
      this.data = response.result;
      if (this.constant.SUCCESS === response.status) {
        this.passwordRuleData = this.data;
      }
    });
  }

  showPreviousPassword() {
    this.showPreviousPass = !this.showPreviousPass;
    if (this.showPreviousPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  showNewPassword() {
    this.showNewPass = !this.showNewPass;
    if (this.showNewPass) {
      this.type1 = 'text';
    } else {
      this.type1 = 'password';
    }
  }

  showConfirmPassword() {
    this.showConfirmPass = !this.showConfirmPass;
    if (this.showConfirmPass) {
      this.type2 = 'text';
    } else {
      this.type2 = 'password';
    }
  }

  changePassword(f: NgForm) {
    this.changepassword.userUniqueId = this.CurrentSessionData.userUniqueId;
    this.common.postRequest(this.changepassword, this.constant.SERVER_URLS['CHANGE_PASS']).subscribe(response => {
      this.data = response.result;
      if (this.constant.SUCCESS === response.status) {
        $('#myModal').modal('hide');
        sessionStorage.clear();
        this.router.navigate(['/web/login']);
      }
    });
  }

  gotoacc() {
    this.router.navigate(['web/user']);
  }

  signout() {
    sessionStorage.clear();
    this.router.navigate(['/web/login']);
  }

  checkPermission() {
    let hasPermission = false;
    if(this.CurrentSessionData && this.CurrentSessionData.userGroups){
      this.CurrentSessionData.userGroups.forEach(element => {
        if(element.securityGroup.groupName == 'Super Admin'){
          hasPermission = true;
        }
      });
    }
    return hasPermission;
  }
}