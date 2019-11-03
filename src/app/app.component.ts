import {Component, OnInit} from '@angular/core';
import {LanguageService} from './services/language.service';
import {FormControl} from '@angular/forms';
import {distinctUntilChanged} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  languageList$: Observable<Array<string>>;
  currentLanguage: string;
  languageControl = new FormControl('');

  constructor(private languageService: LanguageService) {
  }

  ngOnInit(): void {
    // Get current language
    this.languageService.getCurrentLanguage()
      .pipe(distinctUntilChanged()) // only fetch when previous language is not equal with the current one
      .subscribe(lang => {
        this.currentLanguage = lang;
        this.languageControl.setValue(lang);
      });

    // Change languages when the selected language has been changed
    this.languageControl.valueChanges.subscribe(language => this.setLanguage(language));

    this.languageService.loadLanguages();    // Load languages

    this.languageList$ = this.languageService.getLanguageList();    // Get loaded languages
  }

  setLanguage(lang: string) {
    this.languageService.setCurrentLanguage(lang);
  }
}
