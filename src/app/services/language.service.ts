import {Injectable} from '@angular/core';
import {Observable, of, ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = new ReplaySubject<string>();

  constructor(private http: HttpClient, private translateService: TranslateService) {
  }

  setCurrentLanguage(lang: string) {
    this.currentLanguage.next(lang);
    this.translateService.use(lang);
    localStorage.setItem('language', lang);
  }

  setLanguageList(languages: Array<string>) {
    this.translateService.addLangs(languages);  // Add languages to Translate Service
  }

  getCurrentLanguage = (): Observable<string> => this.currentLanguage.asObservable();

  getLanguageList = (): Observable<string[]> => of(this.translateService.getLangs());

  loadLanguages() {
    // If more languages need to be supported then add culture lang string to languages.json
    this.http.get(`/assets/i18n/languages.json`).subscribe((languages: [string]) => {
      this.setLanguageList(languages); // Set our language list

      // Set the fallback language, so when a translation is missing it returns the 'en-US' translation
      this.translateService.setDefaultLang('en-US');
      let activeLanguage = this.translateService.getDefaultLang();

      // Get active language from browser local storage
      if (localStorage.getItem('language')) {
        activeLanguage = localStorage.getItem('language');
      } else {
        // If there is nothing about the language in the local storage we need to get the browser culture language.
        // If there is no browser culture language we use the default language.
        activeLanguage = languages.find(lang => lang === this.translateService.getBrowserCultureLang()) ?
          this.translateService.getBrowserCultureLang() : this.translateService.getDefaultLang();
      }
      // Save the active language into the local storage
      localStorage.setItem('language', activeLanguage);
      this.setCurrentLanguage(activeLanguage);
    });
  }

}
