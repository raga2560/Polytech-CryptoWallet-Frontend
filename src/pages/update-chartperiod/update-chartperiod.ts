import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { ChartPeriod } from '../../entities/chartperiod';
import { ChartPeriodForm } from '../../forms/chartperiodform';

import { AdministratorChartPeriodProvider } from '../../providers/administrator/chartperiod';
import { LocalStorageProvider } from '../../providers/storage/localstorage';

import { UserAuthenticationPage } from '../user-authentication/user-authentication';
import { AllChartPeriodsPage } from '../all-chartperiods/all-chartperiods';

@Component({
  selector: 'page-update-chartperiod',
  templateUrl: 'update-chartperiod.html',
})
export class UpdateChartPeriodPage {

  public chartPeriodForm: ChartPeriodForm;
  public chartPeriodFormGroup: FormGroup;

  constructor(private navCtrl: NavController, private navParams: NavParams, private toastCtrl: ToastController, private formBuilder: FormBuilder, private administratorChartPeriodProvider: AdministratorChartPeriodProvider, private localStorageProvider: LocalStorageProvider) {
    this.chartPeriodForm = new ChartPeriodForm();

    this.chartPeriodFormGroup = formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(250)])]
    });
  }

  public ionViewWillEnter(): void {
    if (!this.localStorageProvider.isUserAdministrator()) {
      this.navCtrl.setRoot(UserAuthenticationPage, { onSuccessRedirect: AllChartPeriodsPage });
      return;
    }
  }

  public ionViewDidEnter(): void {
    let chartPeriod: ChartPeriod = this.navParams.get("chartPeriod");

    this.chartPeriodForm.id = chartPeriod.id;
    this.chartPeriodForm.name = chartPeriod.name;
  }

  public onSubmit(value: any): void {
    this.administratorChartPeriodProvider.updateChartPeriod(this.localStorageProvider.getUserTokenValue(), this.chartPeriodForm).subscribe(result => {
      let toastOverlay = this.toastCtrl.create({
        message: result.message,
        duration: 3000,
        position: 'top'
      });

      toastOverlay.present();

      this.navCtrl.getPrevious().data.chartPeriod = result.data;
      this.navCtrl.pop();
    }, error => {
      console.error(error);

      let toastOverlay = this.toastCtrl.create({
        message: 'An error occured...',
        duration: 3000,
        position: 'top'
      });

      toastOverlay.present();
    });
  }
}