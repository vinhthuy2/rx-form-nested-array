import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { fromEventPattern, Observable, Subject } from 'rxjs';
import { debounceTime, map, tap } from "rxjs/operators";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  releases = [
    {
      prjRelease: {
        id: 1,
        name: 'ABC',
        version: 'v1',
        revision: 0
      },
      predecessor: {
        id: 1.1,
        name: 'ABC',
        version: 'v0',
        revision: 2
      }
    },
    {
      prjRelease: {
        id: 2,
        name: 'XYZ',
        version: 'v121',
        revision: 4
      },
      predecessor: {
        id: 2.1,
        name: 'XYZ',
        version: 'v120',
        revision: 0
      }
    },
    {
      prjRelease: {
        id: 3,
        name: 'FGH',
        version: 'v788',
        revision: 2
      },
      predecessor: {
        id: 3.1,
        name: 'FGH',
        version: 'v787',
        revision: 4
      }
    }
  ]

  myform:FormGroup;
  inputChanged$ = new Subject();
  filteredOptions: Observable<any>;

  constructor(private fb: FormBuilder){}

  ngOnInit() {
    this.myform = this.fb.group({
      configuredReleases: this.fb.array(this.initReleaseControls())
    })

    this.filteredOptions = this.inputChangedObservable
      .pipe(
        map(({value, control}) => {
          console.log(value);

          return value ? this._filter(value) : this.releases.map(r=> r.prjRelease)
        }),
        tap(console.log),
        // map(opt => opt.map((r)=>r.prjRelease)),
        // tap(console.log),
      )
  }

  initReleaseControls() {
    return this.releases.map((el)=> {
      return this.fb.group({
        prjRelease: new FormControl(el.prjRelease),
        predecessor: new FormControl(el.predecessor)
      })
    })
  }

  title = 'rx-form-nested-array';

  get inputChangedObservable() {
    return this.inputChanged$.asObservable()
  }

  get releaseControls() {
    return this.myform.get('configuredReleases') as FormArray;
  }

  displayFn(release) {
    return release && release.name ? `${release.name} ${release.version}/${release.revision}` : ''
  }

  preInputChanged(value, control) {
    this.inputChanged$.next({value: value.target.value, control})
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.releases
      .map(r => r.prjRelease)
      .filter(option => {
        const name = `${option.name} ${option.version}/${option.revision}`;
        return name.toLowerCase().indexOf(filterValue) > -1
      });
  }

  save() {
    console.log(this.myform.getRawValue().configuredReleases)
  }
}
