import {Observable, EventData } from "data/observable";
import {alert} from "ui/dialogs";

import {Inject, Component} from '@angular/core';
import {Logger} from "../../providers/logger";
//import {Router} from "@angular/router-deprecated";
import {NxNav} from "../../controls/nav/nav";
import {NxList} from "../../controls/list/list";
import {NxListItem} from "../../controls/list/list-item";
import {NxHeader} from "../../controls/list/header";
import {IonIcon,NavIcon} from "../../controls/icons/ion-icon";
//import {TitleTransform} from "../../pipes/title";
@Component({
    selector: "map-page",
    //move directives to App .. 
    templateUrl: "pages/mapPage/mapPage.html"
})
export class MapPage 
{
    constructor(private logger:Logger)
    {
        this.logger.Notify("Start Page - constructor hit");   
    }
    
    public pageLoaded(args: any): void {
        this.logger.Notify("start page - loaded");
        console.log("start page - loaded - i happen alot?");
    }
    
    public loadRegions(args: EventData) : void{
        this.logger.Notify("time to load regions");
        
        if(args){ 
            this.logger.Notify("There are args");
            //to do animate transition
        }
        
        alert("nav is broken - not sure why.");
        
        //let promise: Promise<any> = this.router.navigate(["Regions"]);
        
        // promise.then(() => {
        //     this.logger.Notify("I Should have navigated from start -> regions");
        // });
        
        // promise.catch(() => {
        //     this.logger.Notify("I failed navigating from start -> regions");
        // });
    }
    
    public incomplete(args: EventData) : void {
        alert("Its not made yet");
    }
    
    
}


//var vmModule = require("./main-view-model");
// export function pageLoaded(args) {
//     var page = args.object;
//     var vm = new startPage();
//     page.bindingContext = vm;
// }

//exports.pageLoaded = pageLoaded;
