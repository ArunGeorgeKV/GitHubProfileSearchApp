import { Component, OnInit } from '@angular/core';
import {  HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  search: string;  // Entered username
  profile; // object storing all the details gathered
  loaderRequirement: boolean;  // flag to identify the places where loader
  errorMessage: boolean;  // flag to check whether to display error-message or not
  showButton: boolean;  // finding contexts where the button is to be displayed
  setMargin: number;  // variable to set margin of the profile card from the search bar 

  constructor(private httpClient: HttpClient, private toast: ToastrService) { }
  ngOnInit() {
    this.errorMessage = false;
    this.setMargin = 0;
    this.search = "";
    this.showButton = true;
    this.loaderRequirement = false;
  }
  find() {
    this.showButton = false;
    this.loaderRequirement = true;
    this.errorMessage = false;
    delete this.profile;
    if(localStorage.getItem(this.search)) // checking if the searching profile is already there in local storage
    {
      console.log("entered");
      this.setMargin = 1;
      this.profile = JSON.parse(localStorage.getItem(this.search));
      this.loaderRequirement = false;
    }
    else // If username is entered for the first time
    {
    this.profile = null;
    this.httpClient.get(`https://api.github.com/users/` + this.search)
      .subscribe((result) => {
        this.setMargin = 1;
        this.loaderRequirement = false;
        this.profile = result;
        localStorage.setItem(this.search, JSON.stringify(this.profile));  // Storing the profile to local storage 
      },
        (error) => {
          this.setMargin=3;
          delete this.profile;
          this.errorMessage = true;
          this.loaderRequirement = false;
          if (error.status == 404) {
            this.toast.error('Name is incorrect', 'Please check the name entered', {
              timeOut: 4000
            })
          }
          else if (error.status == 403) {
            this.toast.error('Sorry,Cannot find the id', 'Try at a later time', {
              timeOut: 4000
            })
          }
        });
  }}
  settingButton() {
    this.showButton = true;
    this.setMargin = 5;
  }
}
