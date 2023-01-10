import { BackEndService } from 'src/app/shared/services/back-end-service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainContainerComponent } from './home/pages/main-container/main-container.component';
import { ListContainerComponent } from './home/pages/list-container/list-container.component';
import { HeaderComponent } from './home/components/header/header.component';
import { FooterComponent } from './home/components/footer/footer.component';
import { AntdModule } from './shared/modules/antd-module';
import { CarouselComponent } from './home/components/carousel/carousel.component';
import { ListCardComponent } from './home/components/list-card/list-card.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    MainContainerComponent,
    ListContainerComponent,
    HeaderComponent,
    FooterComponent,
    CarouselComponent,
    ListCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AntdModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
})
export class AppModule {}
