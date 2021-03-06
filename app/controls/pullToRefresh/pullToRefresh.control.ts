import { Component, OnInit } from "@angular/core";
import { ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Input, Output, ViewChild, ViewChildren } from "@angular/core";
import { Observable, Subject, Subscription } from 'rxjs/Rx';
import { ViewClass, registerElement } from "nativescript-angular/element-registry";

import { AnimationPromise } from "ui/animation";
import {LayoutBase} from "ui/layouts/layout-base";
import { ListView } from "ui/list-view";
import { ListViewComponent } from "nativescript-angular/directives/list-view-comp";
import { Logger } from "../../providers/logger";
import { PullToRefresh } from "nativescript-pulltorefresh";
import { StackLayout } from "ui/layouts/stack-layout";

registerElement("PullToRefresh", () => require("nativescript-pulltorefresh").PullToRefresh);

@Directive({
    selector: "[pull-to-animate]"
})
export class NxPullToRefreshAnimateElement{
    
    constructor(private element : ElementRef){

    }

    public get Element() : StackLayout{
        return this.element.nativeElement;
    } 
}

@Directive({
    selector: "[pull-list-view]",
    //outputs: ["refreshStarted", "refreshCompleted"],
    host: {
        "(refresh)" : "refreshMe($event)"
    }
})
export class NxPullToRefreshView{
    
    constructor(private element: ElementRef, private logger: Logger){
        // this.logger.Notify("listview - that i want to pull");
        // this.logger.NotifyObjectProperties(element.nativeElement);
        // this.logger.Notify(element.nativeElement.typeName);
    }

    public get Component(): ListView{
        let component :ListViewComponent = this.element.nativeElement;
        let anon: any = component;

        let realThing : ListView = anon.listView ;
        return realThing;
    }

    @Output("refreshStarted")
    public refreshStarted = new EventEmitter();
    @Output("refreshCompleted")
    public refreshCompleted = new EventEmitter();

    private refreshMe(args : any){
        this.logger.Notify("Refresh notified in the directive NxPullListView");

        var notifyRefreshCompleted = () => { 
            args.object.refreshing = false;
            
            this.refreshCompleted.next({
                object: args.object
            });
            this.grow();
        };
        
        this.refreshStarted.next({
            object: args.object,
            completed : notifyRefreshCompleted
        });

        this.shrink();
    }

    private animateContentChildElement: NxPullToRefreshAnimateElement[];
    @ContentChildren(NxPullToRefreshAnimateElement)
    public set contentChildren(elements)
    {
        this.animateContentChildElement = elements.toArray();
    }

    private animateViewChild : NxPullToRefreshAnimateElement[];
    @ViewChildren(NxPullToRefreshAnimateElement)
    public set viewChildren(elements){
        this.animateViewChild = elements.toArray();
    }

    private get AnimateElements() : NxPullToRefreshAnimateElement[]{
        let a = [];
        if(this.animateContentChildElement && this.animateContentChildElement.length > 0)
        {
            this.logger.Notify("animateContentChildElement");
            this.animateContentChildElement.forEach(item => { a.push(item); });
        }
        if(this.animateViewChild && this.animateViewChild.length > 0)
        { 
            this.logger.Notify("animateViewChild");
            this.animateViewChild.forEach(item => { a.push(item); });
        }

        if(a.length === 0){
            this.logger.Notify("neither contentchild or viewchild is found");
        }
        
        return a;
    }

    private transition: AnimationPromise = null;

    private shrink(){
        var animateChildren = this.AnimateElements;

        animateChildren.forEach((child) => {
            let stackLayout = child.Element;
            let animation = stackLayout.animate({ opacity : 0.2, scale: { x : 0.5, y: 0.5 } });
            animation.then(() => {
                let innerAnimation = stackLayout.animate({ opacity: 0, translate: { x: -1000, y: 0 }});
                return innerAnimation;
            });
            this.transition = animation;
        });
    }
    
    private grow(){
        var animateChildren = this.AnimateElements;


        animateChildren.forEach((child) => {
            let stackLayout = child.Element;
        
            let fadeIn = () => { 
                console.log("fade in");
                stackLayout.translateX = 0;
                return stackLayout.animate({ opacity : 1, scale: { x : 1, y: 1 }, translate: { x: 0, y: 0} }) 
            };
            
            this.transition
                .then(fadeIn);
        });
        
        
    }

}

@Component({
    selector: "nx-pull-to-refresh",
    template:`
    <PullToRefresh [pull-list-view] 
        (refreshStarted)="refreshMeStarted($event)" 
        (refreshCompleted)="refreshMeCompleted($event)">
        <ScrollView>
            <StackLayout [pull-to-animate]>
                <ng-content></ng-content>
            </StackLayout>
        </ScrollView>
    </PullToRefresh>
    `,
    outputs: ["refresh", "refreshCompleted"],
    //inputs: ["complete"]
})

export class NxPullToRefresh {
    

    constructor(private logger: Logger)
    {
        this.logger.Notify("NxPullToRefresh - started");
    }
    
    @ViewChild("item")
    public pullToRefreshElement : ElementRef;
    
    @Output("refreshStarted")
    public refreshStarted = new EventEmitter();
    @Output("refreshCompleted")
    public refreshCompleted = new EventEmitter();

    private refreshMeStarted(args : any){
        this.refreshStarted.next(args);
        //this.shrink();
    }
    
    private refreshMeCompleted($event){
        console.log("completed");
        this.refreshCompleted.next($event);
        //this.grow(); 
    }

    
       
    
}

