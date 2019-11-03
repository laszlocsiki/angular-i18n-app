import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


/**
 * Create our own language file loader.
 * So for that we implement TranslateLoader abstract class.
 */
export class AppTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  /**
   * Fetch the correct language file
   * @param  lang - is the language code, ex. en-US, de, hu.
   */
  getTranslation(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/languages/${lang}.json`);
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new AppTranslateLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
