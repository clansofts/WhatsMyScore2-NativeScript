import { Component } from '@angular/core';
import {Page as PageControl} from "ui/page";
import {Logger} from "../../providers/logger";
import {NxPullToRefresh} from "../../controls/pullToRefresh/pullToRefresh.control";
import {Image} from "ui/image";
import {PullToRefresh} from "nativescript-pulltorefresh";
import {Color} from "color";
//Page is a wrapper on @Component

@Component({
    selector: "start",
    template: `
        <StackLayout >

            <nx-card>
                <nx-header item-top>
                    <label [text]="'Test Card' | Title" class="nx-header-title"></label>
                </nx-header>
                <nx-item>
                    <label text="Pull on the image to refresh"></label>
                    <label class="note" [text]="Message"></label>
                </nx-item>
                
                <nx-item [nxRoute]="['Start']">
                    <ion-icon item-left icon="ion-map"></ion-icon>
                    <label text="Back to Start"></label>
                    <ion-icon item-right icon="ion-chevron-right"></ion-icon>
                </nx-item>
            </nx-card>

            <StackLayout class='inset'>
                <nx-pull-to-refresh (refresh)="refreshPage($event)">
                    <img [src]="RandomImage" stretch ="none"> 
                </nx-pull-to-refresh>
            </StackLayout>
        </StackLayout>
    `
})
export class TestPage 
{
    private _randomImage = "https://unsplash.it/1600/1600/?random=";

    public RefreshedTimes = 0;
    public Message = "Pull to refresh";
    public RandomImage = "https://unsplash.it/1600/1600/?random=0";
    constructor(private logger:Logger, private page: PageControl)
    {
        this.logger.Notify("Start Page - constructor hit"); 
        page.actionBarHidden = true;
    }
    
    public refreshPage(args: any) {
        console.log("page refresh -> go");
        let control : PullToRefresh = args.object;
        
        let randromColor = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
        
        let colors = {
            a : "#FC000D",
            b : "#19FF01"
        };
        control.color = new Color("#000000");

        control.animate({
            backgroundColor : new Color(randromColor),
        });
        
        control.color = new Color(colors.a);
        setTimeout(() => {
            args.object.refreshing = false;
            this.RefreshedTimes += 1;
            this.Message = "Pull to refresh - " + this.RefreshedTimes;
            this.RandomImage = this._randomImage + this.RefreshedTimes;
            control.color = new Color(colors.b);
        }, 1000);
    }
}
